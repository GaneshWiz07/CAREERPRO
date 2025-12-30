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
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with refined typography. Features a subtle accent color and elegant spacing.',
    font: 'Playfair Display',
    atsScore: 94,
    features: ['Refined typography', 'Subtle accents', 'Elegant spacing'],
    bestFor: 'Creative & Design',
  },
  {
    id: 'flat',
    name: 'Flat Minimal',
    description: 'Ultra-clean flat design with maximum whitespace. Perfect for minimalist professionals.',
    font: 'Roboto',
    atsScore: 97,
    features: ['Flat design', 'Minimal styling', 'High readability'],
    bestFor: 'Tech & Consulting',
  },
  {
    id: 'onepage',
    name: 'OnePage Plus',
    description: 'Compact layout designed to fit everything on a single page without sacrificing readability.',
    font: 'Inter',
    atsScore: 95,
    features: ['Compact layout', 'Space efficient', 'Dense content'],
    bestFor: 'Experienced professionals',
  },
  {
    id: 'spartan',
    name: 'Spartan',
    description: 'Bold and impactful design with strong typography. Makes a powerful first impression.',
    font: 'Montserrat',
    atsScore: 93,
    features: ['Bold headers', 'Strong contrast', 'Executive feel'],
    bestFor: 'Leadership & Executive',
  },
  {
    id: 'stackoverflow',
    name: 'StackOverflow',
    description: 'Developer-friendly template inspired by the StackOverflow design. Great for tech professionals.',
    font: 'Source Sans Pro',
    atsScore: 96,
    features: ['Code-friendly', 'Clean sections', 'Tech aesthetic'],
    bestFor: 'Software Engineers',
  },
  // New templates
  {
    id: 'kendall',
    name: 'Kendall',
    description: 'Minimalist design with blue-gray accent. Clean and professional with subtle styling.',
    font: 'Lato',
    atsScore: 97,
    features: ['Minimal lines', 'Cool tones', 'Professional'],
    bestFor: 'Business & Finance',
  },
  {
    id: 'paper',
    name: 'Paper',
    description: 'Newspaper-inspired layout with strong headers. Traditional yet contemporary feel.',
    font: 'Merriweather',
    atsScore: 96,
    features: ['Newspaper style', 'Bold titles', 'Classic feel'],
    bestFor: 'Journalism & Media',
  },
  {
    id: 'macchiato',
    name: 'Macchiato',
    description: 'Warm, coffee-inspired tones with elegant styling. Perfect for creative professionals.',
    font: 'Nunito',
    atsScore: 94,
    features: ['Warm colors', 'Friendly feel', 'Unique style'],
    bestFor: 'Creative & Hospitality',
  },
  {
    id: 'crisp',
    name: 'Crisp',
    description: 'Sharp, high-contrast design with clean lines. Modern and impactful presentation.',
    font: 'Poppins',
    atsScore: 95,
    features: ['High contrast', 'Sharp lines', 'Modern look'],
    bestFor: 'Marketing & Sales',
  },
  {
    id: 'classy',
    name: 'Classy',
    description: 'Elegant design with gold accents. Sophisticated and premium appearance.',
    font: 'Cormorant Garamond',
    atsScore: 93,
    features: ['Gold accents', 'Premium feel', 'Sophisticated'],
    bestFor: 'Luxury & Fashion',
  },
  {
    id: 'refined',
    name: 'Refined',
    description: 'Subtle and professional with soft green accents. Balanced and polished design.',
    font: 'Quicksand',
    atsScore: 95,
    features: ['Soft colors', 'Balanced layout', 'Polished'],
    bestFor: 'Healthcare & Education',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Corporate-focused with navy blue accents. Perfect for senior professionals.',
    font: 'Libre Baskerville',
    atsScore: 97,
    features: ['Corporate style', 'Navy accents', 'Senior focus'],
    bestFor: 'C-Suite & Directors',
  },
  {
    id: 'nordic',
    name: 'Nordic',
    description: 'Scandinavian-inspired minimalism with teal accents. Clean and functional design.',
    font: 'Work Sans',
    atsScore: 96,
    features: ['Scandi design', 'Teal accents', 'Functional'],
    bestFor: 'Design & Architecture',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    description: 'Modern Japanese-inspired design with red accents. Bold and memorable.',
    font: 'Noto Sans',
    atsScore: 94,
    features: ['Japanese inspired', 'Red accents', 'Bold style'],
    bestFor: 'Creative & Tech',
  },
  {
    id: 'fresh',
    name: 'Fresh',
    description: 'Bright and energetic with lime green accents. Perfect for new graduates.',
    font: 'DM Sans',
    atsScore: 95,
    features: ['Energetic', 'Bright colors', 'Youthful'],
    bestFor: 'Entry Level & Graduates',
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
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
