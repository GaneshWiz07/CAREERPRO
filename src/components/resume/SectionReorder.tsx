import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { GripVertical, Plus, Layers } from 'lucide-react';
import { ResumeSection, CustomSection } from '@/types/resume';

interface SortableItemProps {
  section: ResumeSection;
  onToggleVisibility: (id: string, visible: boolean) => void;
}

function SortableItem({ section, onToggleVisibility }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg mb-2"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab hover:bg-accent rounded p-1"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <span className="flex-1 font-medium text-sm">{section.title}</span>
      <Switch
        checked={section.visible}
        onCheckedChange={(checked) => onToggleVisibility(section.id, checked)}
      />
    </div>
  );
}

export function SectionReorder() {
  const { resume, updateResume } = useResume();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Combine built-in sections with custom sections
  const allSections: ResumeSection[] = [
    ...resume.sections.filter(s => s.type !== 'custom'),
    ...resume.customSections.map(cs => ({
      id: cs.id,
      type: 'custom' as const,
      title: cs.title,
      order: cs.order,
      visible: cs.visible,
    })),
  ].sort((a, b) => a.order - b.order);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = allSections.findIndex((s) => s.id === active.id);
      const newIndex = allSections.findIndex((s) => s.id === over.id);
      
      const reordered = arrayMove(allSections, oldIndex, newIndex).map((section, index) => ({
        ...section,
        order: index,
      }));

      // Separate built-in and custom sections
      const builtInSections = reordered.filter(s => s.type !== 'custom');
      const customSectionIds = reordered.filter(s => s.type === 'custom').map(s => s.id);
      
      // Update custom sections with new order
      const updatedCustomSections = resume.customSections.map(cs => {
        const newOrder = reordered.find(s => s.id === cs.id)?.order ?? cs.order;
        return { ...cs, order: newOrder };
      });

      updateResume({
        sections: builtInSections,
        customSections: updatedCustomSections,
      });
    }
  };

  const handleToggleVisibility = (id: string, visible: boolean) => {
    const isBuiltIn = resume.sections.some(s => s.id === id);
    
    if (isBuiltIn) {
      updateResume({
        sections: resume.sections.map(s => 
          s.id === id ? { ...s, visible } : s
        ),
      });
    } else {
      updateResume({
        customSections: resume.customSections.map(cs =>
          cs.id === id ? { ...cs, visible } : cs
        ),
      });
    }
  };

  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: crypto.randomUUID(),
      title: 'New Section',
      type: 'custom',
      items: [],
      order: allSections.length,
      visible: true,
      showTechnologies: false,
    };

    updateResume({
      customSections: [...resume.customSections, newSection],
    });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Layers className="h-5 w-5 text-primary" />
            Section Order
          </CardTitle>
          <Button variant="outline" size="sm" onClick={addCustomSection} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Section
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Drag to reorder sections. Toggle visibility on/off.
        </p>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={allSections.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {allSections.map((section) => (
              <SortableItem
                key={section.id}
                section={section}
                onToggleVisibility={handleToggleVisibility}
              />
            ))}
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
