import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Briefcase,
  Plus,
  Trash2,
  GripVertical,
  Sparkles,
  Loader2,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { invokeNetlifyFunction } from '@/lib/api';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

export function ExperienceSection() {
  const { resume, addExperience, updateExperience, removeExperience } = useResume();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [enhancingBullet, setEnhancingBullet] = useState<{ expId: string; index: number } | null>(null);

  const handleAddBullet = (expId: string) => {
    const exp = resume.experiences.find((e) => e.id === expId);
    if (exp) {
      updateExperience(expId, { bullets: [...exp.bullets, ''] });
    }
  };

  const handleUpdateBullet = (expId: string, index: number, value: string) => {
    const exp = resume.experiences.find((e) => e.id === expId);
    if (exp) {
      const newBullets = [...exp.bullets];
      newBullets[index] = value;
      updateExperience(expId, { bullets: newBullets });
    }
  };

  const handleRemoveBullet = (expId: string, index: number) => {
    const exp = resume.experiences.find((e) => e.id === expId);
    if (exp && exp.bullets.length > 1) {
      const newBullets = exp.bullets.filter((_, i) => i !== index);
      updateExperience(expId, { bullets: newBullets });
    }
  };

  const handleEnhanceBullet = async (expId: string, index: number) => {
    const exp = resume.experiences.find((e) => e.id === expId);
    if (!exp || !exp.bullets[index].trim()) {
      toast.error('Please write something first');
      return;
    }

    setEnhancingBullet({ expId, index });
    try {
      const { data, error } = await invokeNetlifyFunction('transform-achievement', {
        bullet: exp.bullets[index],
        role: exp.title,
        company: exp.company,
      });

      if (error) throw error;
      if (data?.transformedBullet) {
        handleUpdateBullet(expId, index, data.transformedBullet);
        toast.success('Achievement transformed!');
      }
    } catch (error) {
      console.error('Error transforming bullet:', error);
      toast.error('Failed to transform achievement');
    } finally {
      setEnhancingBullet(null);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="h-5 w-5 text-primary" />
            Work Experience
          </CardTitle>
          <Button variant="outline" size="sm" onClick={addExperience} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Experience
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {resume.experiences.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No experience added yet</p>
            <Button variant="link" onClick={addExperience} className="mt-2">
              Add your first experience
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {resume.experiences.map((exp, idx) => (
              <Collapsible
                key={exp.id}
                open={expandedId === exp.id}
                onOpenChange={(open) => setExpandedId(open ? exp.id : null)}
              >
                <div className="border border-border rounded-lg">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {exp.title || 'Untitled Position'}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {exp.company || 'Company'} • {exp.startDate || 'Start'} - {exp.current ? 'Present' : exp.endDate || 'End'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExperience(exp.id);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-border p-4 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Job Title</Label>
                          <Input
                            value={exp.title}
                            onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                            placeholder="Senior Software Engineer"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                            placeholder="Tech Company Inc."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                            placeholder="San Francisco, CA"
                          />
                        </div>
                        <div className="flex items-end gap-4">
                          <div className="flex-1 space-y-2">
                            <Label>Start Date</Label>
                            <Input
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                              placeholder="Jan 2020"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Label>End Date</Label>
                            <Input
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                              placeholder="Dec 2023"
                              disabled={exp.current}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onCheckedChange={(checked) =>
                            updateExperience(exp.id, { current: checked as boolean })
                          }
                        />
                        <Label htmlFor={`current-${exp.id}`}>I currently work here</Label>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Achievements & Responsibilities</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddBullet(exp.id)}
                            className="gap-1 text-xs"
                          >
                            <Plus className="h-3 w-3" />
                            Add Bullet
                          </Button>
                        </div>
                        {exp.bullets.map((bullet, bulletIdx) => (
                          <div key={bulletIdx} className="flex gap-2 items-start">
                            <span className="text-muted-foreground mt-3">•</span>
                            <div className="flex-1">
                              <RichTextEditor
                                content={bullet}
                                onChange={(value) => handleUpdateBullet(exp.id, bulletIdx, value)}
                                placeholder="Describe your achievement with metrics..."
                                minHeight="60px"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEnhanceBullet(exp.id, bulletIdx)}
                                disabled={enhancingBullet?.expId === exp.id && enhancingBullet?.index === bulletIdx}
                                className="h-8 w-8"
                                title="Transform to achievement"
                              >
                                {enhancingBullet?.expId === exp.id && enhancingBullet?.index === bulletIdx ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Sparkles className="h-4 w-4" />
                                )}
                              </Button>
                              {exp.bullets.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveBullet(exp.id, bulletIdx)}
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
