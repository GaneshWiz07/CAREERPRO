import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, FileText, Briefcase, Palette, Building2, GraduationCap, Sparkles, TrendingUp } from 'lucide-react';
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
  category: 'professional' | 'creative' | 'corporate' | 'academic' | 'modern' | 'industry';
}

// Template categories with metadata
const CATEGORIES = [
  {
    id: 'all',
    name: 'All Templates',
    icon: Sparkles,
    description: 'Browse all 27 templates',
    color: 'bg-gradient-to-r from-violet-500 to-purple-500',
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: Briefcase,
    description: 'Clean, traditional layouts for any industry',
    color: 'bg-gradient-to-r from-slate-600 to-slate-700',
  },
  {
    id: 'modern',
    name: 'Modern & Minimal',
    icon: TrendingUp,
    description: 'Contemporary designs with clean aesthetics',
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  },
  {
    id: 'creative',
    name: 'Creative & Bold',
    icon: Palette,
    description: 'Eye-catching designs for creative roles',
    color: 'bg-gradient-to-r from-pink-500 to-rose-500',
  },
  {
    id: 'corporate',
    name: 'Corporate & Executive',
    icon: Building2,
    description: 'Sophisticated templates for senior roles',
    color: 'bg-gradient-to-r from-blue-800 to-indigo-800',
  },
  {
    id: 'academic',
    name: 'Academic & Research',
    icon: GraduationCap,
    description: 'Scholarly designs for academia',
    color: 'bg-gradient-to-r from-green-600 to-emerald-600',
  },
  {
    id: 'industry',
    name: 'Industry Specific',
    icon: Building2,
    description: 'Tailored for specific industries',
    color: 'bg-gradient-to-r from-amber-500 to-orange-500',
  },
];

const TEMPLATES: ResumeTemplate[] = [
  // Professional Templates
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean, traditional layout optimized for ATS systems. Uses Georgia font with clear section headers.',
    font: 'Georgia',
    atsScore: 98,
    features: ['Single column', 'Clear hierarchy', 'Standard sections'],
    bestFor: 'All industries',
    category: 'professional',
  },
  {
    id: 'kendall',
    name: 'Kendall',
    description: 'Minimalist design with blue-gray accent. Clean and professional with subtle styling.',
    font: 'Lato',
    atsScore: 97,
    features: ['Minimal lines', 'Cool tones', 'Professional'],
    bestFor: 'Business & Finance',
    category: 'professional',
  },
  {
    id: 'paper',
    name: 'Paper',
    description: 'Newspaper-inspired layout with strong headers. Traditional yet contemporary feel.',
    font: 'Merriweather',
    atsScore: 96,
    features: ['Newspaper style', 'Bold titles', 'Classic feel'],
    bestFor: 'Journalism & Media',
    category: 'professional',
  },
  {
    id: 'ember',
    name: 'Ember',
    description: 'Warm coral tones with friendly styling. Approachable and memorable.',
    font: 'Rubik',
    atsScore: 95,
    features: ['Warm tones', 'Friendly', 'Approachable'],
    bestFor: 'HR & Customer Service',
    category: 'professional',
  },

  // Modern & Minimal Templates
  {
    id: 'modern',
    name: 'Modern Clean',
    description: 'Contemporary design with Arial font. Balanced whitespace for easy reading.',
    font: 'Arial',
    atsScore: 96,
    features: ['Modern typography', 'Bold headers', 'Clean lines'],
    bestFor: 'Tech & Startups',
    category: 'modern',
  },
  {
    id: 'flat',
    name: 'Flat Minimal',
    description: 'Ultra-clean flat design with maximum whitespace. Perfect for minimalist professionals.',
    font: 'Roboto',
    atsScore: 97,
    features: ['Flat design', 'Minimal styling', 'High readability'],
    bestFor: 'Tech & Consulting',
    category: 'modern',
  },
  {
    id: 'onepage',
    name: 'OnePage Plus',
    description: 'Compact layout designed to fit everything on a single page without sacrificing readability.',
    font: 'Inter',
    atsScore: 95,
    features: ['Compact layout', 'Space efficient', 'Dense content'],
    bestFor: 'Experienced professionals',
    category: 'modern',
  },
  {
    id: 'nordic',
    name: 'Nordic',
    description: 'Scandinavian-inspired minimalism with teal accents. Clean and functional design.',
    font: 'Work Sans',
    atsScore: 96,
    features: ['Scandi design', 'Teal accents', 'Functional'],
    bestFor: 'Design & Architecture',
    category: 'modern',
  },
  {
    id: 'crisp',
    name: 'Crisp',
    description: 'Sharp, high-contrast design with clean lines. Modern and impactful presentation.',
    font: 'Poppins',
    atsScore: 95,
    features: ['High contrast', 'Sharp lines', 'Modern look'],
    bestFor: 'Marketing & Sales',
    category: 'modern',
  },
  {
    id: 'glacier',
    name: 'Glacier',
    description: 'Cool blue tones with icy minimalism. Clean and refreshing design.',
    font: 'Cabin',
    atsScore: 96,
    features: ['Cool tones', 'Icy clean', 'Refreshing'],
    bestFor: 'Healthcare & Science',
    category: 'modern',
  },

  // Creative & Bold Templates
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with refined typography. Features a subtle accent color and elegant spacing.',
    font: 'Playfair Display',
    atsScore: 94,
    features: ['Refined typography', 'Subtle accents', 'Elegant spacing'],
    bestFor: 'Creative & Design',
    category: 'creative',
  },
  {
    id: 'macchiato',
    name: 'Macchiato',
    description: 'Warm, coffee-inspired tones with elegant styling. Perfect for creative professionals.',
    font: 'Nunito',
    atsScore: 94,
    features: ['Warm colors', 'Friendly feel', 'Unique style'],
    bestFor: 'Creative & Hospitality',
    category: 'creative',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    description: 'Modern Japanese-inspired design with red accents. Bold and memorable.',
    font: 'Noto Sans',
    atsScore: 94,
    features: ['Japanese inspired', 'Red accents', 'Bold style'],
    bestFor: 'Creative & Tech',
    category: 'creative',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Gradient-inspired design with violet accents. Modern and eye-catching aesthetic.',
    font: 'Outfit',
    atsScore: 94,
    features: ['Gradient vibes', 'Violet accents', 'Modern'],
    bestFor: 'Creative & Tech',
    category: 'creative',
  },
  {
    id: 'iconic',
    name: 'Iconic',
    description: 'Bold statement design with black and yellow. Impossible to ignore.',
    font: 'Barlow',
    atsScore: 94,
    features: ['Bold statement', 'High contrast', 'Memorable'],
    bestFor: 'Creative Directors',
    category: 'creative',
  },
  {
    id: 'harmony',
    name: 'Harmony',
    description: 'Balanced design with soft purple accents. Calming and professional.',
    font: 'Karla',
    atsScore: 95,
    features: ['Balanced', 'Soft purple', 'Calming'],
    bestFor: 'Non-profit & Social',
    category: 'creative',
  },

  // Corporate & Executive Templates
  {
    id: 'spartan',
    name: 'Spartan',
    description: 'Bold and impactful design with strong typography. Makes a powerful first impression.',
    font: 'Montserrat',
    atsScore: 93,
    features: ['Bold headers', 'Strong contrast', 'Executive feel'],
    bestFor: 'Leadership & Executive',
    category: 'corporate',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Corporate-focused with navy blue accents. Perfect for senior professionals.',
    font: 'Libre Baskerville',
    atsScore: 97,
    features: ['Corporate style', 'Navy accents', 'Senior focus'],
    bestFor: 'C-Suite & Directors',
    category: 'corporate',
  },
  {
    id: 'classy',
    name: 'Classy',
    description: 'Elegant design with gold accents. Sophisticated and premium appearance.',
    font: 'Cormorant Garamond',
    atsScore: 93,
    features: ['Gold accents', 'Premium feel', 'Sophisticated'],
    bestFor: 'Luxury & Fashion',
    category: 'corporate',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    description: 'Luxurious design with gold and black. Premium and sophisticated feel.',
    font: 'Bodoni Moda',
    atsScore: 93,
    features: ['Luxury feel', 'Gold accents', 'Premium'],
    bestFor: 'Luxury & Real Estate',
    category: 'corporate',
  },
  {
    id: 'fortune',
    name: 'Fortune',
    description: 'Finance-focused with deep burgundy accents. Professional and trustworthy.',
    font: 'Crimson Pro',
    atsScore: 97,
    features: ['Finance style', 'Burgundy accents', 'Trustworthy'],
    bestFor: 'Finance & Banking',
    category: 'corporate',
  },

  // Academic & Research Templates
  {
    id: 'cambridge',
    name: 'Cambridge',
    description: 'Academic elegance with deep green accents. Perfect for scholarly professionals.',
    font: 'EB Garamond',
    atsScore: 97,
    features: ['Academic style', 'Green accents', 'Scholarly'],
    bestFor: 'Academia & Research',
    category: 'academic',
  },
  {
    id: 'refined',
    name: 'Refined',
    description: 'Subtle and professional with soft green accents. Balanced and polished design.',
    font: 'Quicksand',
    atsScore: 95,
    features: ['Soft colors', 'Balanced layout', 'Polished'],
    bestFor: 'Healthcare & Education',
    category: 'academic',
  },
  {
    id: 'fresh',
    name: 'Fresh',
    description: 'Bright and energetic with lime green accents. Perfect for new graduates.',
    font: 'DM Sans',
    atsScore: 95,
    features: ['Energetic', 'Bright colors', 'Youthful'],
    bestFor: 'Entry Level & Graduates',
    category: 'academic',
  },

  // Industry Specific Templates
  {
    id: 'stackoverflow',
    name: 'StackOverflow',
    description: 'Developer-friendly template inspired by the StackOverflow design. Great for tech professionals.',
    font: 'Source Sans Pro',
    atsScore: 96,
    features: ['Code-friendly', 'Clean sections', 'Tech aesthetic'],
    bestFor: 'Software Engineers',
    category: 'industry',
  },
  {
    id: 'berlin',
    name: 'Berlin',
    description: 'Industrial-inspired with bold typography. Strong and confident presentation.',
    font: 'Oswald',
    atsScore: 95,
    features: ['Bold headers', 'Industrial', 'Confident'],
    bestFor: 'Engineering & Manufacturing',
    category: 'industry',
  },
  {
    id: 'jasper',
    name: 'Jasper',
    description: 'Earthy tones with terracotta accents. Natural and grounded aesthetic.',
    font: 'Josefin Sans',
    atsScore: 95,
    features: ['Earthy tones', 'Natural feel', 'Grounded'],
    bestFor: 'Environmental & Agriculture',
    category: 'industry',
  },
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

// Template card component
function TemplateCard({ 
  template, 
  isSelected, 
  onSelect 
}: { 
  template: ResumeTemplate; 
  isSelected: boolean; 
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative p-2 sm:p-3 rounded-lg border-2 text-left transition-all hover:border-primary/50 hover:shadow-md group",
        isSelected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border bg-card hover:bg-accent/50"
      )}
    >
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10">
          <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary-foreground" />
          </div>
        </div>
      )}

      <div className="space-y-1.5 sm:space-y-2">
        <div className="relative group-hover:scale-[1.02] transition-transform">
          <TemplateThumbnail templateId={template.id} />
        </div>

        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="font-semibold text-foreground text-xs sm:text-sm truncate">{template.name}</h3>

          <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap">
            <Badge variant="secondary" className="text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0">
              ATS {template.atsScore}%
            </Badge>
            <Badge variant="outline" className="text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0 font-normal truncate max-w-[60px] sm:max-w-[80px] hidden xs:inline-flex">
              {template.bestFor}
            </Badge>
          </div>

          <p className="text-[10px] sm:text-[11px] text-muted-foreground line-clamp-2 hidden sm:block">
            {template.description}
          </p>

          <p className="text-[9px] sm:text-[10px] text-muted-foreground">
            {template.font}
          </p>
        </div>
      </div>
    </button>
  );
}

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter templates based on active category
  const filteredTemplates = activeCategory === 'all' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === activeCategory);

  // Get count for each category
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return TEMPLATES.length;
    return TEMPLATES.filter(t => t.category === categoryId).length;
  };

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <CardTitle className="text-base sm:text-lg">Resume Template</CardTitle>
        </div>
        <CardDescription className="text-xs sm:text-sm">
          Choose an ATS-friendly template. All {TEMPLATES.length} templates pass ATS systems.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Category Filter Pills - Horizontally scrollable on mobile */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-1.5 sm:gap-2 sm:flex-wrap min-w-max sm:min-w-0">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              const count = getCategoryCount(category.id);
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap",
                    isActive
                      ? `${category.color} text-white shadow-md`
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">{category.name}</span>
                  <span className="xs:hidden">{category.name.split(' ')[0]}</span>
                  <span className={cn(
                    "text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full",
                    isActive ? "bg-white/20" : "bg-background"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Description */}
        <div className="text-xs sm:text-sm text-muted-foreground">
          {CATEGORIES.find(c => c.id === activeCategory)?.description}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={() => onSelectTemplate(template.id)}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-6 sm:py-8 text-muted-foreground text-sm">
            No templates found in this category.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { TEMPLATES, CATEGORIES };
