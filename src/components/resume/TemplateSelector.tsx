import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  font: string;
  atsScore: number;
  features: string[];
}

const TEMPLATES: ResumeTemplate[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Clean, traditional layout optimized for ATS systems. Uses Georgia font with clear section headers.',
    font: 'Georgia',
    atsScore: 98,
    features: ['Single column', 'Clear hierarchy', 'Standard sections', 'No graphics'],
  },
  {
    id: 'modern',
    name: 'Modern Clean',
    description: 'Contemporary design with Arial font. Balanced whitespace for easy reading by both humans and ATS.',
    font: 'Arial',
    atsScore: 96,
    features: ['Single column', 'Modern typography', 'Bold headers', 'ATS optimized'],
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated layout with Times New Roman. Perfect for senior roles and traditional industries.',
    font: 'Times New Roman',
    atsScore: 99,
    features: ['Single column', 'Traditional style', 'Formal tone', 'Highly compatible'],
  },
  {
    id: 'technical',
    name: 'Technical Focus',
    description: 'Optimized for tech roles with Calibri font. Emphasizes skills and project experience.',
    font: 'Calibri',
    atsScore: 95,
    features: ['Single column', 'Skills emphasis', 'Project sections', 'Clean layout'],
  },
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Resume Template</CardTitle>
        </div>
        <CardDescription>
          Choose an ATS-friendly template. All templates are designed to pass Applicant Tracking Systems.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={cn(
                "relative p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50",
                selectedTemplate === template.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              )}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{template.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    ATS {template.atsScore}%
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
                
                <div className="flex flex-wrap gap-1 pt-1">
                  {template.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs font-normal">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-xs text-muted-foreground pt-1">
                  Font: {template.font}
                </p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { TEMPLATES };
