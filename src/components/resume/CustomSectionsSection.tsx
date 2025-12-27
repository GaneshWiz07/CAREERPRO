import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Plus, Trash2, GripVertical } from 'lucide-react';
import { CustomSection, CustomSectionItem } from '@/types/resume';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

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
      technologies: '',
      date: '',
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
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              {item.title || 'Untitled Item'}
                            </h4>
                            {item.technologies && (
                              <span className="text-sm text-muted-foreground italic">
                                {item.technologies}
                              </span>
                            )}
                          </div>
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
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={item.title}
                            onChange={e =>
                              updateCustomSectionItem(section.id, item.id, {
                                title: e.target.value,
                              })
                            }
                            placeholder="Project name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Technologies</Label>
                          <Input
                            value={item.technologies}
                            onChange={e =>
                              updateCustomSectionItem(section.id, item.id, {
                                technologies: e.target.value,
                              })
                            }
                            placeholder="React, Node.js, MongoDB"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input
                            value={item.date}
                            onChange={e =>
                              updateCustomSectionItem(section.id, item.id, {
                                date: e.target.value,
                              })
                            }
                            placeholder="Jan 2024 - Mar 2024"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Bullet Points</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              updateCustomSectionItem(section.id, item.id, {
                                bullets: [...item.bullets, ''],
                              });
                            }}
                            className="gap-1 text-xs"
                          >
                            <Plus className="h-3 w-3" />
                            Add Bullet
                          </Button>
                        </div>
                        {item.bullets.map((bullet, bulletIdx) => (
                          <div key={bulletIdx} className="flex gap-2 items-start">
                            <span className="text-muted-foreground mt-3">•</span>
                            <div className="flex-1">
                              <RichTextEditor
                                content={bullet}
                                onChange={(value) => {
                                  const newBullets = [...item.bullets];
                                  newBullets[bulletIdx] = value;
                                  updateCustomSectionItem(section.id, item.id, {
                                    bullets: newBullets,
                                  });
                                }}
                                placeholder="Describe your achievement..."
                                minHeight="60px"
                              />
                            </div>
                            {item.bullets.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newBullets = item.bullets.filter((_, i) => i !== bulletIdx);
                                  updateCustomSectionItem(section.id, item.id, {
                                    bullets: newBullets,
                                  });
                                }}
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        {item.bullets.length === 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              updateCustomSectionItem(section.id, item.id, {
                                bullets: [''],
                              });
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add first bullet point
                          </Button>
                        )}
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
