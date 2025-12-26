import React from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Wrench, Plus, X } from 'lucide-react';

const SKILL_CATEGORIES = [
  'Technical',
  'Programming Languages',
  'Frameworks',
  'Tools',
  'Soft Skills',
  'Languages',
  'Certifications',
  'Other',
];

export function SkillsSection() {
  const { resume, addSkill, updateSkill, removeSkill } = useResume();

  // Group skills by category
  const skillsByCategory = resume.skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, typeof resume.skills>);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wrench className="h-5 w-5 text-primary" />
            Skills
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => addSkill()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {resume.skills.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Wrench className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No skills added yet</p>
            <Button variant="link" onClick={() => addSkill()} className="mt-2">
              Add your first skill
            </Button>
          </div>
        ) : (
          <>
            {/* Skills grouped by category */}
            <div className="space-y-4">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category}>
                  <p className="text-sm font-medium text-muted-foreground mb-2">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="secondary"
                        className="gap-1 pr-1"
                      >
                        {skill.name || 'Untitled'}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSkill(skill.id)}
                          className="h-4 w-4 p-0 hover:bg-transparent"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Edit skills */}
            <div className="border-t border-border pt-4 mt-4">
              <p className="text-sm font-medium mb-3">Edit Skills</p>
              <div className="space-y-3">
                {resume.skills.map((skill) => (
                  <div key={skill.id} className="flex gap-2 items-center">
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                      placeholder="Skill name"
                      className="flex-1"
                    />
                    <Select
                      value={skill.category}
                      onValueChange={(value) => updateSkill(skill.id, { category: value })}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSkill(skill.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
