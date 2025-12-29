import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TemplateThumbnail } from './TemplateThumbnail';

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  font: string;
  atsScore: number;
  features: string[];
  bestFor: string;
}

const TEMPLATES: ResumeTemplate[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Clean, traditional layout optimized for ATS systems. Uses Georgia font with clear section headers.',
    font: 'Georgia',
    atsScore: 98,
    features: ['Single column', 'Clear hierarchy', 'Standard sections'],
    bestFor: 'All industries',
  },
  {
    id: 'modern',
    name: 'Modern Clean',
    description: 'Contemporary design with Arial font. Balanced whitespace for easy reading.',
    font: 'Arial',
    atsScore: 96,
    features: ['Modern typography', 'Bold headers', 'Clean lines'],
    bestFor: 'Tech & Startups',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated layout with Times New Roman. Perfect for senior roles and traditional industries.',
    font: 'Times New Roman',
    atsScore: 99,
    features: ['Traditional style', 'Formal tone', 'Highly compatible'],
    bestFor: 'Senior Roles',
  },
  {
    id: 'technical',
    name: 'Technical Focus',
    description: 'Optimized for tech roles with Calibri font. Emphasizes skills and project experience.',
    font: 'Calibri',
    atsScore: 95,
    features: ['Skills emphasis', 'Project sections', 'Technical layout'],
    bestFor: 'Engineering & IT',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean design with maximum whitespace. Helvetica font for modern simplicity.',
    font: 'Helvetica',
    atsScore: 97,
    features: ['Minimal design', 'Maximum clarity', 'Elegant spacing'],
    bestFor: 'Design & UX',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Subtle design accents while maintaining ATS compatibility. Great for creative professionals.',
    font: 'Lato',
    atsScore: 92,
    features: ['Subtle accents', 'Creative flair', 'ATS friendly'],
    bestFor: 'Marketing & Design',
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Dense layout to fit more content. Perfect for experienced professionals with extensive history.',
    font: 'Verdana',
    atsScore: 94,
    features: ['Dense layout', 'More content', 'Space efficient'],
    bestFor: 'Experienced Pros',
  },
  {
    id: 'academic',
    name: 'Academic CV',
    description: 'Formal academic style with emphasis on education, publications, and research.',
    font: 'Garamond',
    atsScore: 98,
    features: ['Education focus', 'Formal structure', 'Publication ready'],
    bestFor: 'Academia & Research',
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={cn(
                "relative p-3 rounded-lg border-2 text-left transition-all hover:border-primary/50 hover:shadow-md group",
                selectedTemplate === template.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card hover:bg-accent/50"
              )}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 z-10">
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                {/* Visual Template Preview */}
                <div className="relative group-hover:scale-[1.02] transition-transform">
                  <TemplateThumbnail templateId={template.id} />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-semibold text-foreground text-sm truncate">{template.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      ATS {template.atsScore}%
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                      {template.bestFor}
                    </Badge>
                  </div>
                  
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                  
                  <p className="text-[10px] text-muted-foreground">
                    Font: {template.font}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { TEMPLATES };
