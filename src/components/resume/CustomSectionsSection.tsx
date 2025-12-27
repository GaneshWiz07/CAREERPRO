import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Plus, Trash2, GripVertical } from 'lucide-react';
import { CustomSection, CustomSectionItem } from '@/types/resume';

export function CustomSectionsSection() {
  const { resume, updateResume } = useResume();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const updateCustomSection = (sectionId: string, updates: Partial<CustomSection>) => {
    updateResume({
      customSections: resume.customSections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    });
  };

  const updateCustomSectionItem = (
    sectionId: string,
    itemId: string,
    updates: Partial<CustomSectionItem>
  ) => {
    updateResume({
      customSections: resume.customSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
              ),
            }
          : section
      ),
    });
  };

  const addItemToSection = (sectionId: string) => {
    const newItem: CustomSectionItem = {
      id: crypto.randomUUID(),
      title: '',
      subtitle: '',
      description: '',
      bullets: [],
    };
    updateResume({
      customSections: resume.customSections.map(section =>
        section.id === sectionId
          ? { ...section, items: [...section.items, newItem] }
          : section
      ),
    });
  };

  const removeItemFromSection = (sectionId: string, itemId: string) => {
    updateResume({
      customSections: resume.customSections.map(section =>
        section.id === sectionId
          ? { ...section, items: section.items.filter(item => item.id !== itemId) }
          : section
      ),
    });
  };

  const removeSection = (sectionId: string) => {
    updateResume({
      customSections: resume.customSections.filter(section => section.id !== sectionId),
      sections: resume.sections.filter(section => section.id !== sectionId),
    });
  };

  if (!resume.customSections || resume.customSections.length === 0) {
    return null;
  }

  return (
    <>
      {resume.customSections.map(section => (
        <Card key={section.id} className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <Input
                value={section.title}
                onChange={e => updateCustomSection(section.id, { title: e.target.value })}
                className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
                placeholder="Section Title"
              />
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addItemToSection(section.id)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => removeSection(section.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.items.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No items in this section. Click "Add Item" to add content.
              </p>
            ) : (
              section.items.map(item => (
                <Collapsible
                  key={item.id}
                  open={expandedSections.has(item.id)}
                  onOpenChange={() => toggleSection(item.id)}
                >
                  <div className="border rounded-lg p-4">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between cursor-pointer">
                        <div>
                          <h4 className="font-medium">
                            {item.title || 'Untitled Item'}
                          </h4>
                          {item.subtitle && (
                            <p className="text-sm text-muted-foreground">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={e => {
                              e.stopPropagation();
                              removeItemFromSection(section.id, item.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expandedSections.has(item.id) ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={item.title}
                            onChange={e =>
                              updateCustomSectionItem(section.id, item.id, {
                                title: e.target.value,
                              })
                            }
                            placeholder="Item title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Subtitle</Label>
                          <Input
                            value={item.subtitle}
                            onChange={e =>
                              updateCustomSectionItem(section.id, item.id, {
                                subtitle: e.target.value,
                              })
                            }
                            placeholder="Subtitle (e.g., date, location)"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={item.description}
                          onChange={e =>
                            updateCustomSectionItem(section.id, item.id, {
                              description: e.target.value,
                            })
                          }
                          placeholder="Description or details"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bullet Points (one per line)</Label>
                        <Textarea
                          value={item.bullets.join('\n')}
                          onChange={e =>
                            updateCustomSectionItem(section.id, item.id, {
                              bullets: e.target.value.split('\n').filter(b => b.trim()),
                            })
                          }
                          placeholder="• Point 1&#10;• Point 2"
                          rows={4}
                        />
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
}
