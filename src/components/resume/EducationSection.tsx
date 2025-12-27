import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Plus, Trash2, GripVertical } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

export function EducationSection() {
  const { resume, addEducation, updateEducation, removeEducation } = useResume();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-primary" />
            Education
          </CardTitle>
          <Button variant="outline" size="sm" onClick={addEducation} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Education
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {resume.education.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No education added yet</p>
            <Button variant="link" onClick={addEducation} className="mt-2">
              Add your education
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {resume.education.map((edu) => (
              <Collapsible
                key={edu.id}
                open={expandedId === edu.id}
                onOpenChange={(open) => setExpandedId(open ? edu.id : null)}
              >
                <div className="border border-border rounded-lg">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {edu.degree || 'Degree'}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {edu.institution || 'Institution'} • {edu.batchStart && edu.batchEnd ? `${edu.batchStart} - ${edu.batchEnd}` : 'Batch'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEducation(edu.id);
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
                          <Label>Institution</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                            placeholder="University of California"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                            placeholder="Bachelor of Science"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={edu.location}
                            onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                            placeholder="Berkeley, CA"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Batch Start</Label>
                          <Input
                            value={edu.batchStart || ''}
                            onChange={(e) => updateEducation(edu.id, { batchStart: e.target.value })}
                            placeholder="Nov 2022"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Batch End</Label>
                          <Input
                            value={edu.batchEnd || ''}
                            onChange={(e) => updateEducation(edu.id, { batchEnd: e.target.value })}
                            placeholder="April 2026"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>GPA (Optional)</Label>
                          <Input
                            value={edu.gpa || ''}
                            onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                            placeholder="3.8/4.0"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Honors & Awards (Optional)</Label>
                        <RichTextEditor
                          content={edu.honors || ''}
                          onChange={(value) => updateEducation(edu.id, { honors: value })}
                          placeholder="Magna Cum Laude, Dean's List"
                          minHeight="60px"
                        />
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
