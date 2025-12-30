import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  Award,
  FileText,
  Clock,
  BarChart3,
  Hash
} from 'lucide-react';
import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';

interface ResumeStatsProps {
  resume: Resume;
  className?: string;
}

interface StatItem {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  description?: string;
}

export function ResumeStats({ resume, className }: ResumeStatsProps) {
  // Calculate word count
  const getWordCount = (text: string): number => {
    const stripped = text.replace(/<[^>]*>/g, '').trim();
    if (!stripped) return 0;
    return stripped.split(/\s+/).filter(word => word.length > 0).length;
  };

  const summaryWords = getWordCount(resume.summary);
  const experienceWords = resume.experiences.reduce((total, exp) => {
    return total + exp.bullets.reduce((sum, bullet) => sum + getWordCount(bullet), 0);
  }, 0);
  const totalWords = summaryWords + experienceWords;

  // Calculate total experience years
  const calculateExperienceYears = (): string => {
    let totalMonths = 0;
    resume.experiences.forEach(exp => {
      if (exp.startDate) {
        const start = new Date(exp.startDate);
        const end = exp.current ? new Date() : (exp.endDate ? new Date(exp.endDate) : new Date());
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        totalMonths += Math.max(0, months);
      }
    });
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    if (years === 0 && months === 0) return 'N/A';
    if (years === 0) return `${months}mo`;
    if (months === 0) return `${years}yr`;
    return `${years}yr ${months}mo`;
  };

  // Count bullet points
  const totalBullets = resume.experiences.reduce((total, exp) => {
    return total + exp.bullets.filter(b => b.trim()).length;
  }, 0);

  // Count skill categories
  const skillCategories = new Set(resume.skills.map(s => s.category)).size;

  const stats: StatItem[] = [
    {
      label: 'Experiences',
      value: resume.experiences.length,
      icon: Briefcase,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
      description: `${totalBullets} bullet points`,
    },
    {
      label: 'Education',
      value: resume.education.length,
      icon: GraduationCap,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Skills',
      value: resume.skills.length,
      icon: Wrench,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
      description: `${skillCategories} categories`,
    },
    {
      label: 'Certifications',
      value: resume.certifications.length,
      icon: Award,
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
    },
    {
      label: 'Total Years',
      value: calculateExperienceYears(),
      icon: Clock,
      color: 'text-teal-600 bg-teal-100 dark:bg-teal-900/30',
      description: 'of experience',
    },
    {
      label: 'Word Count',
      value: totalWords,
      icon: Hash,
      color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30',
      description: totalWords > 600 ? 'Consider trimming' : totalWords < 300 ? 'Add more detail' : 'Good length',
    },
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Resume Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label}
                className="p-2 sm:p-3 rounded-lg bg-muted/50 border border-border/50"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                  <div className={cn("p-1 sm:p-1.5 rounded-md", stat.color)}>
                    <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground truncate">{stat.label}</span>
                </div>
                <p className="text-base sm:text-xl font-bold">{stat.value}</p>
                {stat.description && (
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 truncate">{stat.description}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick insights */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1.5 sm:mb-2">Quick Insights</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {resume.experiences.length === 0 && (
              <Badge variant="outline" className="text-[10px] sm:text-xs text-amber-600 border-amber-300 px-1.5 sm:px-2">
                Add experience
              </Badge>
            )}
            {resume.skills.length < 5 && (
              <Badge variant="outline" className="text-[10px] sm:text-xs text-amber-600 border-amber-300 px-1.5 sm:px-2">
                Add skills
              </Badge>
            )}
            {totalWords > 700 && (
              <Badge variant="outline" className="text-[10px] sm:text-xs text-amber-600 border-amber-300 px-1.5 sm:px-2">
                Too long
              </Badge>
            )}
            {totalWords < 200 && resume.experiences.length > 0 && (
              <Badge variant="outline" className="text-[10px] sm:text-xs text-amber-600 border-amber-300 px-1.5 sm:px-2">
                Add details
              </Badge>
            )}
            {resume.experiences.length > 0 && totalBullets / resume.experiences.length < 2 && (
              <Badge variant="outline" className="text-[10px] sm:text-xs text-amber-600 border-amber-300 px-1.5 sm:px-2">
                Add bullets
              </Badge>
            )}
            {resume.experiences.length >= 2 && resume.skills.length >= 5 && totalWords >= 200 && totalWords <= 700 && (
              <Badge variant="secondary" className="text-[10px] sm:text-xs text-green-600 px-1.5 sm:px-2">
                ✓ Good
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

