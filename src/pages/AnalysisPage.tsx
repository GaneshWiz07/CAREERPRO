import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  FileText,
  Sparkles,
  Target,
  Zap,
  ArrowRight,
  Copy,
  Check,
  Loader2,
  TrendingUp,
  Award,
  Briefcase,
  Eye,
  ListChecks,
  User,
  GraduationCap,
  Wrench,
  Info
} from 'lucide-react';
import { invokeNetlifyFunction } from '@/lib/api';
import { toast } from 'sonner';
import { CardSpotlight } from '@/components/ui/aceternity/card-spotlight';
import { MovingBorderButton } from '@/components/ui/aceternity/moving-border';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AIAnalysisResult {
  score: number;
  breakdown: {
    keywordMatch: number;
    skillsAlignment: number;
    experienceRelevance: number;
    formatStructure: number;
    quantifiedAchievements: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    section: string;
    message: string;
    suggestion: string;
  }>;
  optimizedContent: {
    summary: string;
    experienceBullets: Array<{
      original: string;
      optimized: string;
    }>;
    additionalSkills: string[];
  };
  recommendations: string[];
}

export default function AnalysisPage() {
  const { resume, updateSummary, updateExperience, addSkill } = useResume();
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const [appliedItems, setAppliedItems] = useState<Set<string>>(new Set());

  const analyzeWithAI = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await invokeNetlifyFunction('analyze-ats', {
        resume, jobDescription
      });

      if (error) throw error;
      
      setAiAnalysis(data);
      setAppliedItems(new Set());
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Error analyzing:', error);
      toast.error('Failed to analyze. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedItems(prev => new Set(prev).add(id));
    toast.success('Copied to clipboard');
    setTimeout(() => {
      setCopiedItems(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 2000);
  };

  const applySummary = () => {
    if (aiAnalysis?.optimizedContent.summary) {
      updateSummary(aiAnalysis.optimizedContent.summary);
      setAppliedItems(prev => new Set(prev).add('summary'));
      toast.success('Summary updated!');
    }
  };

  const applyBullet = (expIndex: number, bulletIndex: number, optimized: string) => {
    const experience = resume.experiences[expIndex];
    if (experience) {
      const newBullets = [...experience.bullets];
      newBullets[bulletIndex] = optimized;
      updateExperience(experience.id, { bullets: newBullets });
      setAppliedItems(prev => new Set(prev).add(`bullet-${expIndex}-${bulletIndex}`));
      toast.success('Bullet point updated!');
    }
  };

  const applyAllOptimizations = () => {
    let count = 0;
    
    if (aiAnalysis?.optimizedContent.summary && !appliedItems.has('summary')) {
      updateSummary(aiAnalysis.optimizedContent.summary);
      setAppliedItems(prev => new Set(prev).add('summary'));
      count++;
    }

    aiAnalysis?.optimizedContent.experienceBullets.forEach((bullet) => {
      resume.experiences.forEach((exp, expIdx) => {
        const bulletIdx = exp.bullets.findIndex(b => b === bullet.original);
        if (bulletIdx !== -1 && !appliedItems.has(`bullet-${expIdx}-${bulletIdx}`)) {
          const newBullets = [...exp.bullets];
          newBullets[bulletIdx] = bullet.optimized;
          updateExperience(exp.id, { bullets: newBullets });
          setAppliedItems(prev => new Set(prev).add(`bullet-${expIdx}-${bulletIdx}`));
          count++;
        }
      });
    });

    aiAnalysis?.optimizedContent.additionalSkills.forEach(skill => {
      const exists = resume.skills.some(s => s.name.toLowerCase() === skill.toLowerCase());
      if (!exists && !appliedItems.has(`skill-${skill}`)) {
        addSkill({ name: skill, category: 'Technical' });
        setAppliedItems(prev => new Set(prev).add(`skill-${skill}`));
        count++;
      }
    });

    toast.success(`Applied ${count} optimizations!`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-yellow-600';
    return 'text-destructive';
  };

  // Get issues for a specific section
  const getIssuesForSection = (section: string) => {
    return aiAnalysis?.issues.filter(i => 
      i.section.toLowerCase().includes(section.toLowerCase())
    ) || [];
  };

  // Check if a keyword is missing
  const isMissingKeyword = (text: string) => {
    if (!aiAnalysis) return false;
    return aiAnalysis.missingKeywords.some(kw => 
      text.toLowerCase().includes(kw.toLowerCase())
    );
  };

  // Check if text contains matched keywords
  const getMatchedKeywordsInText = (text: string) => {
    if (!aiAnalysis) return [];
    return aiAnalysis.matchedKeywords.filter(kw => 
      text.toLowerCase().includes(kw.toLowerCase())
    );
  };

  // Highlight keywords in text
  const highlightText = (text: string) => {
    if (!aiAnalysis || !text) return text;
    
    let result = text;
    const allKeywords = [...aiAnalysis.matchedKeywords, ...aiAnalysis.missingKeywords];
    
    // This is for display only - we'll use CSS classes
    return result;
  };

  // Visual Resume Preview Component
  const ResumePreviewWithIssues = () => {
    const contactIssues = getIssuesForSection('contact');
    const summaryIssues = getIssuesForSection('summary');
    const experienceIssues = getIssuesForSection('experience');
    const educationIssues = getIssuesForSection('education');
    const skillsIssues = getIssuesForSection('skills');

    const SectionWrapper = ({ 
      children, 
      issues, 
      title, 
      icon: Icon 
    }: { 
      children: React.ReactNode; 
      issues: typeof aiAnalysis.issues; 
      title: string;
      icon: React.ElementType;
    }) => {
      const hasErrors = issues.some(i => i.type === 'error');
      const hasWarnings = issues.some(i => i.type === 'warning');
      
      return (
        <div className={cn(
          "relative p-4 rounded-lg border-2 transition-all",
          hasErrors ? "border-destructive/50 bg-destructive/5" :
          hasWarnings ? "border-yellow-500/50 bg-yellow-500/5" :
          "border-primary/20 bg-primary/5"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Icon className={cn(
                "h-4 w-4",
                hasErrors ? "text-destructive" :
                hasWarnings ? "text-yellow-600" :
                "text-primary"
              )} />
              <span className="text-sm font-medium">{title}</span>
            </div>
            {issues.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs cursor-help",
                        hasErrors ? "border-destructive text-destructive" :
                        hasWarnings ? "border-yellow-500 text-yellow-600" :
                        "border-primary text-primary"
                      )}
                    >
                      {hasErrors ? <XCircle className="h-3 w-3 mr-1" /> :
                       hasWarnings ? <AlertTriangle className="h-3 w-3 mr-1" /> :
                       <Info className="h-3 w-3 mr-1" />}
                      {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    <div className="space-y-2">
                      {issues.map((issue, i) => (
                        <div key={i} className="text-xs">
                          <p className="font-medium">{issue.message}</p>
                          {issue.suggestion && (
                            <p className="text-muted-foreground mt-0.5">{issue.suggestion}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {children}
          {issues.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
              {issues.map((issue, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex items-start gap-2 text-xs p-2 rounded",
                    issue.type === 'error' ? "bg-destructive/10 text-destructive" :
                    issue.type === 'warning' ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" :
                    "bg-primary/10 text-primary"
                  )}
                >
                  {issue.type === 'error' ? <XCircle className="h-3 w-3 mt-0.5 shrink-0" /> :
                   issue.type === 'warning' ? <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" /> :
                   <Info className="h-3 w-3 mt-0.5 shrink-0" />}
                  <div>
                    <p className="font-medium">{issue.message}</p>
                    {issue.suggestion && (
                      <p className="opacity-75 mt-0.5">💡 {issue.suggestion}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    const KeywordHighlight = ({ text, className }: { text: string; className?: string }) => {
      if (!aiAnalysis || !text) return <span className={className}>{text}</span>;
      
      // Find all keywords in the text
      const matchedInText = aiAnalysis.matchedKeywords.filter(kw => 
        text.toLowerCase().includes(kw.toLowerCase())
      );
      const missingInText = aiAnalysis.missingKeywords.filter(kw => 
        text.toLowerCase().includes(kw.toLowerCase())
      );

      if (matchedInText.length === 0 && missingInText.length === 0) {
        return <span className={className}>{text}</span>;
      }

      // Create a regex to match all keywords
      const allKeywords = [...matchedInText, ...missingInText];
      const regex = new RegExp(`(${allKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
      const parts = text.split(regex);

      return (
        <span className={className}>
          {parts.map((part, i) => {
            const isMatched = matchedInText.some(kw => kw.toLowerCase() === part.toLowerCase());
            const isMissing = missingInText.some(kw => kw.toLowerCase() === part.toLowerCase());
            
            if (isMatched) {
              return (
                <span key={i} className="bg-primary/20 text-primary px-0.5 rounded font-medium">
                  {part}
                </span>
              );
            }
            if (isMissing) {
              return (
                <span key={i} className="bg-destructive/20 text-destructive px-0.5 rounded">
                  {part}
                </span>
              );
            }
            return part;
          })}
        </span>
      );
    };

    return (
      <div className="space-y-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-3 p-3 bg-muted/50 rounded-lg text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-primary/20 border border-primary/50" />
            <span>Matched Keywords</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-destructive/20 border border-destructive/50" />
            <span>Missing Keywords</span>
          </div>
          <div className="flex items-center gap-1.5">
            <XCircle className="h-3 w-3 text-destructive" />
            <span>Error</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3 text-yellow-600" />
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-primary" />
            <span>Good</span>
          </div>
        </div>

        {/* Contact Section */}
        <SectionWrapper issues={contactIssues} title="Contact Information" icon={User}>
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-lg">{resume.contact.fullName || 'Your Name'}</p>
            <div className="flex flex-wrap gap-2 text-muted-foreground text-xs">
              {resume.contact.email && <span>{resume.contact.email}</span>}
              {resume.contact.phone && <span>• {resume.contact.phone}</span>}
              {resume.contact.location && <span>• {resume.contact.location}</span>}
            </div>
            {(resume.contact.linkedin || resume.contact.website) && (
              <div className="flex flex-wrap gap-2 text-xs text-primary">
                {resume.contact.linkedin && <span>{resume.contact.linkedin}</span>}
                {resume.contact.website && <span>{resume.contact.website}</span>}
              </div>
            )}
          </div>
        </SectionWrapper>

        {/* Summary Section */}
        <SectionWrapper issues={summaryIssues} title="Professional Summary" icon={FileText}>
          {resume.summary ? (
            <KeywordHighlight 
              text={resume.summary.replace(/<[^>]*>/g, '')} 
              className="text-sm text-muted-foreground"
            />
          ) : (
            <p className="text-sm text-muted-foreground italic">No summary provided</p>
          )}
        </SectionWrapper>

        {/* Experience Section */}
        <SectionWrapper issues={experienceIssues} title="Work Experience" icon={Briefcase}>
          {resume.experiences.length > 0 ? (
            <div className="space-y-4">
              {resume.experiences.map((exp, idx) => (
                <div key={exp.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <KeywordHighlight text={exp.title} className="font-medium text-sm" />
                      <p className="text-xs text-muted-foreground">
                        <KeywordHighlight text={exp.company} /> {exp.location && `• ${exp.location}`}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <ul className="space-y-1 ml-4">
                    {exp.bullets.filter(b => b.trim()).map((bullet, bIdx) => (
                      <li key={bIdx} className="text-xs text-muted-foreground list-disc">
                        <KeywordHighlight text={bullet} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No experience added</p>
          )}
        </SectionWrapper>

        {/* Education Section */}
        <SectionWrapper issues={educationIssues} title="Education" icon={GraduationCap}>
          {resume.education.length > 0 ? (
            <div className="space-y-2">
              {resume.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <KeywordHighlight text={edu.degree} className="font-medium text-sm" />
                    <p className="text-xs text-muted-foreground">
                      <KeywordHighlight text={edu.school} /> {edu.location && `• ${edu.location}`}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {edu.batchStart} - {edu.batchEnd}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No education added</p>
          )}
        </SectionWrapper>

        {/* Skills Section */}
        <SectionWrapper issues={skillsIssues} title="Skills" icon={Wrench}>
          {resume.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map((skill) => {
                const isMatched = aiAnalysis?.matchedKeywords.some(kw => 
                  skill.name.toLowerCase().includes(kw.toLowerCase())
                );
                const isMissing = aiAnalysis?.missingKeywords.some(kw => 
                  skill.name.toLowerCase().includes(kw.toLowerCase())
                );
                
                return (
                  <Badge 
                    key={skill.id} 
                    variant="outline"
                    className={cn(
                      "text-xs",
                      isMatched && "bg-primary/10 border-primary/50 text-primary",
                      isMissing && "bg-destructive/10 border-destructive/50 text-destructive"
                    )}
                  >
                    {skill.name}
                  </Badge>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No skills added</p>
          )}
          
          {/* Missing skills suggestion */}
          {aiAnalysis && aiAnalysis.optimizedContent.additionalSkills.length > 0 && (
            <div className="mt-3 pt-3 border-t border-dashed border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                💡 Suggested skills to add:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {aiAnalysis.optimizedContent.additionalSkills.slice(0, 8).map((skill, i) => {
                  const exists = resume.skills.some(s => 
                    s.name.toLowerCase() === skill.toLowerCase()
                  );
                  return (
                    <Badge 
                      key={i} 
                      variant="outline"
                      className={cn(
                        "text-xs cursor-pointer transition-colors",
                        exists 
                          ? "bg-primary/10 border-primary/50" 
                          : "border-dashed hover:bg-accent"
                      )}
                      onClick={() => {
                        if (!exists) {
                          addSkill({ name: skill, category: 'Technical' });
                          toast.success(`Added "${skill}" to skills`);
                        }
                      }}
                    >
                      {exists ? <Check className="h-3 w-3 mr-1" /> : <span className="mr-1">+</span>}
                      {skill}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </SectionWrapper>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border"
        >
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-foreground">ATS Analysis</h1>
            <p className="text-sm text-muted-foreground">
              AI-powered ATS scoring with auto-optimization
            </p>
          </div>
        </motion.header>

        <div className="p-6">
          <div className="space-y-6">
            {/* Job Description Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CardSpotlight>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Job Description
                  </CardTitle>
                  <CardDescription>
                    Paste the job description to get AI-powered ATS analysis and optimization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    className="min-h-[200px] resize-none"
                  />
                  <MovingBorderButton
                    borderRadius="0.5rem"
                    className="w-full px-4 py-2 text-sm font-medium gap-2"
                    containerClassName="h-12 w-full"
                    onClick={analyzeWithAI}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Analyze & Optimize
                      </>
                    )}
                  </MovingBorderButton>
                </CardContent>
              </CardSpotlight>
            </motion.div>

            {/* AI Analysis Results */}
            {aiAnalysis && (
              <Tabs defaultValue="visual" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="visual" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Visual Feedback
                  </TabsTrigger>
                  <TabsTrigger value="details" className="gap-2">
                    <ListChecks className="h-4 w-4" />
                    Detailed Analysis
                  </TabsTrigger>
                </TabsList>

                {/* Visual Feedback Tab */}
                <TabsContent value="visual" className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-3">
                    {/* Score Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="lg:col-span-1"
                    >
                      <Card className="h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">ATS Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col items-center">
                            <div className="relative mb-4">
                              <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 128 128">
                                <circle
                                  className="text-muted"
                                  strokeWidth="10"
                                  stroke="currentColor"
                                  fill="transparent"
                                  r="52"
                                  cx="64"
                                  cy="64"
                                />
                                <motion.circle
                                  initial={{ strokeDasharray: "0 327" }}
                                  animate={{ strokeDasharray: `${aiAnalysis.score * 3.27} 327` }}
                                  transition={{ delay: 0.3, duration: 1 }}
                                  className={getScoreColor(aiAnalysis.score)}
                                  strokeWidth="10"
                                  strokeLinecap="round"
                                  stroke="currentColor"
                                  fill="transparent"
                                  r="52"
                                  cx="64"
                                  cy="64"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-3xl font-bold ${getScoreColor(aiAnalysis.score)}`}>
                                  {aiAnalysis.score}%
                                </span>
                              </div>
                            </div>
                            <div className="w-full space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Keywords</span>
                                <span className="font-medium">{aiAnalysis.breakdown.keywordMatch}/40</span>
                              </div>
                              <Progress value={(aiAnalysis.breakdown.keywordMatch / 40) * 100} className="h-1.5" />
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Skills</span>
                                <span className="font-medium">{aiAnalysis.breakdown.skillsAlignment}/25</span>
                              </div>
                              <Progress value={(aiAnalysis.breakdown.skillsAlignment / 25) * 100} className="h-1.5" />
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Experience</span>
                                <span className="font-medium">{aiAnalysis.breakdown.experienceRelevance}/20</span>
                              </div>
                              <Progress value={(aiAnalysis.breakdown.experienceRelevance / 20) * 100} className="h-1.5" />
                            </div>
                            <div className="mt-4 pt-4 border-t w-full">
                              <div className="grid grid-cols-2 gap-2 text-center">
                                <div className="p-2 rounded bg-primary/10">
                                  <p className="text-lg font-bold text-primary">{aiAnalysis.matchedKeywords.length}</p>
                                  <p className="text-[10px] text-muted-foreground">Matched</p>
                                </div>
                                <div className="p-2 rounded bg-destructive/10">
                                  <p className="text-lg font-bold text-destructive">{aiAnalysis.missingKeywords.length}</p>
                                  <p className="text-[10px] text-muted-foreground">Missing</p>
                                </div>
                              </div>
                              <Button 
                                onClick={applyAllOptimizations} 
                                className="w-full mt-3 gap-2"
                                size="sm"
                              >
                                <Zap className="h-4 w-4" />
                                Apply All Fixes
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Visual Resume Preview */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="lg:col-span-2"
                    >
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Eye className="h-5 w-5 text-primary" />
                            Resume Issues Overview
                          </CardTitle>
                          <CardDescription>
                            Visual feedback showing issues and keyword matches in your resume
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[600px] pr-4">
                            <ResumePreviewWithIssues />
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Quick Recommendations */}
                  {aiAnalysis.recommendations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Target className="h-5 w-5 text-primary" />
                            Top Recommendations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {aiAnalysis.recommendations.slice(0, 6).map((rec, i) => (
                              <div 
                                key={i} 
                                className="flex items-start gap-2 p-3 rounded-lg bg-accent/50 border border-border"
                              >
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                  {i + 1}
                                </span>
                                <p className="text-xs">{rec}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </TabsContent>

                {/* Detailed Analysis Tab */}
                <TabsContent value="details" className="space-y-6">
                {/* Score Overview */}
                <div className="grid gap-6 md:grid-cols-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CardSpotlight>
                      <CardHeader>
                        <CardTitle>ATS Match Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                              <circle
                                className="text-muted"
                                strokeWidth="8"
                                stroke="currentColor"
                                fill="transparent"
                                r="56"
                                cx="64"
                                cy="64"
                              />
                              <motion.circle
                                initial={{ strokeDasharray: "0 352" }}
                                animate={{ strokeDasharray: `${aiAnalysis.score * 3.52} 352` }}
                                transition={{ delay: 0.5, duration: 1 }}
                                className={getScoreColor(aiAnalysis.score)}
                                strokeWidth="8"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="56"
                                cx="64"
                                cy="64"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-3xl font-bold ${getScoreColor(aiAnalysis.score)}`}>
                                {aiAnalysis.score}%
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Keywords</span>
                              <span className="font-medium">{aiAnalysis.breakdown.keywordMatch}/40</span>
                            </div>
                            <Progress value={(aiAnalysis.breakdown.keywordMatch / 40) * 100} className="h-2" />
                            <div className="flex justify-between text-sm">
                              <span>Skills</span>
                              <span className="font-medium">{aiAnalysis.breakdown.skillsAlignment}/25</span>
                            </div>
                            <Progress value={(aiAnalysis.breakdown.skillsAlignment / 25) * 100} className="h-2" />
                            <div className="flex justify-between text-sm">
                              <span>Experience</span>
                              <span className="font-medium">{aiAnalysis.breakdown.experienceRelevance}/20</span>
                            </div>
                            <Progress value={(aiAnalysis.breakdown.experienceRelevance / 20) * 100} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </CardSpotlight>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <CardSpotlight>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Quick Actions</CardTitle>
                        <Button onClick={applyAllOptimizations} size="sm" className="gap-2">
                          <Zap className="h-4 w-4" />
                          Apply All Fixes
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                              <span className="font-medium">Matched</span>
                            </div>
                            <p className="text-2xl font-bold text-primary">{aiAnalysis.matchedKeywords.length}</p>
                            <p className="text-xs text-muted-foreground">keywords found</p>
                          </div>
                          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                            <div className="flex items-center gap-2 mb-2">
                              <XCircle className="h-5 w-5 text-destructive" />
                              <span className="font-medium">Missing</span>
                            </div>
                            <p className="text-2xl font-bold text-destructive">{aiAnalysis.missingKeywords.length}</p>
                            <p className="text-xs text-muted-foreground">critical keywords</p>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-accent/50 border border-border">
                          <p className="text-sm font-medium mb-2">Potential Score Improvement</p>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            <span className="text-2xl font-bold text-primary">
                              +{Math.min(100 - aiAnalysis.score, aiAnalysis.optimizedContent.experienceBullets.length * 5 + 15)}%
                            </span>
                            <span className="text-sm text-muted-foreground">after optimizations</span>
                          </div>
                        </div>
                      </CardContent>
                    </CardSpotlight>
                  </motion.div>
                </div>

                {/* Keywords Analysis */}
                <div className="grid gap-6 md:grid-cols-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <CardSpotlight>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          Matched Keywords ({aiAnalysis.matchedKeywords.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {aiAnalysis.matchedKeywords.map((keyword, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 + i * 0.03 }}
                            >
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                {keyword}
                              </Badge>
                            </motion.div>
                          ))}
                          {aiAnalysis.matchedKeywords.length === 0 && (
                            <p className="text-sm text-muted-foreground">No matching keywords found</p>
                          )}
                        </div>
                      </CardContent>
                    </CardSpotlight>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <CardSpotlight>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <XCircle className="h-5 w-5 text-destructive" />
                          Missing Keywords ({aiAnalysis.missingKeywords.length})
                        </CardTitle>
                        <CardDescription>Add these to improve your score</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {aiAnalysis.missingKeywords.map((keyword, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + i * 0.03 }}
                            >
                              <Badge variant="outline" className="border-destructive/50 text-destructive">
                                {keyword}
                              </Badge>
                            </motion.div>
                          ))}
                          {aiAnalysis.missingKeywords.length === 0 && (
                            <p className="text-sm text-muted-foreground">All critical keywords covered!</p>
                          )}
                        </div>
                      </CardContent>
                    </CardSpotlight>
                  </motion.div>
                </div>

                {/* Optimized Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <CardSpotlight>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI-Optimized Content
                      </CardTitle>
                      <CardDescription>
                        Click "Apply" to update your resume with optimized content
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {aiAnalysis.optimizedContent.summary && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Professional Summary
                            </h4>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(aiAnalysis.optimizedContent.summary, 'summary-copy')}
                              >
                                {copiedItems.has('summary-copy') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                              <Button
                                size="sm"
                                onClick={applySummary}
                                disabled={appliedItems.has('summary')}
                              >
                                {appliedItems.has('summary') ? (
                                  <><Check className="h-4 w-4 mr-1" />Applied</>
                                ) : (
                                  <><ArrowRight className="h-4 w-4 mr-1" />Apply</>
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="p-4 rounded-lg bg-accent/50 border border-border">
                            <p className="text-sm">{aiAnalysis.optimizedContent.summary}</p>
                          </div>
                        </div>
                      )}

                      {aiAnalysis.optimizedContent.experienceBullets.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Experience Bullets
                          </h4>
                          <ScrollArea className="h-[300px]">
                            <div className="space-y-4 pr-4">
                              {aiAnalysis.optimizedContent.experienceBullets.map((bullet, idx) => {
                                const expIdx = resume.experiences.findIndex(exp => 
                                  exp.bullets.some(b => b === bullet.original)
                                );
                                const bulletIdx = expIdx !== -1 
                                  ? resume.experiences[expIdx].bullets.findIndex(b => b === bullet.original)
                                  : -1;
                                const itemKey = `bullet-${expIdx}-${bulletIdx}`;

                                return (
                                  <div key={idx} className="p-4 rounded-lg border border-border space-y-3">
                                    <div className="space-y-1">
                                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Original</p>
                                      <p className="text-sm line-through text-muted-foreground">{bullet.original}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-primary">
                                      <ArrowRight className="h-4 w-4" />
                                      <span className="text-xs font-medium">Optimized</span>
                                    </div>
                                    <p className="text-sm font-medium">{bullet.optimized}</p>
                                    <div className="flex gap-2 justify-end">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(bullet.optimized, `bullet-copy-${idx}`)}
                                      >
                                        {copiedItems.has(`bullet-copy-${idx}`) ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                      </Button>
                                      {expIdx !== -1 && bulletIdx !== -1 && (
                                        <Button
                                          size="sm"
                                          onClick={() => applyBullet(expIdx, bulletIdx, bullet.optimized)}
                                          disabled={appliedItems.has(itemKey)}
                                        >
                                          {appliedItems.has(itemKey) ? (
                                            <><Check className="h-4 w-4 mr-1" />Applied</>
                                          ) : (
                                            <><ArrowRight className="h-4 w-4 mr-1" />Apply</>
                                          )}
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </ScrollArea>
                        </div>
                      )}

                      {aiAnalysis.optimizedContent.additionalSkills.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Suggested Skills to Add
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {aiAnalysis.optimizedContent.additionalSkills.map((skill, i) => {
                              const exists = resume.skills.some(s => s.name.toLowerCase() === skill.toLowerCase());
                              return (
                                <Badge 
                                  key={i} 
                                  variant={exists ? "secondary" : "outline"}
                                  className={exists ? "bg-primary/10" : "cursor-pointer hover:bg-accent"}
                                  onClick={() => {
                                    if (!exists) {
                                      addSkill({ name: skill, category: 'Technical' });
                                      toast.success(`Added "${skill}" to skills`);
                                    }
                                  }}
                                >
                                  {exists ? <Check className="h-3 w-3 mr-1" /> : null}
                                  {skill}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </CardSpotlight>
                </motion.div>

                {/* Recommendations */}
                {aiAnalysis.recommendations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <CardSpotlight>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" />
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {aiAnalysis.recommendations.map((rec, i) => (
                            <motion.li 
                              key={i} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + i * 0.1 }}
                              className="flex items-start gap-3 p-3 rounded-lg bg-accent/50"
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                {i + 1}
                              </span>
                              <p className="text-sm">{rec}</p>
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </CardSpotlight>
                  </motion.div>
                )}

                {/* Issues */}
                {aiAnalysis.issues.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <CardSpotlight>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          Detected Issues ({aiAnalysis.issues.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {aiAnalysis.issues.map((issue, i) => (
                          <div 
                            key={i} 
                            className={`flex items-start gap-3 p-3 rounded-lg border ${
                              issue.type === 'error' 
                                ? 'bg-destructive/10 border-destructive/20' 
                                : issue.type === 'warning'
                                ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/20'
                                : 'bg-accent/50 border-border'
                            }`}
                          >
                            {issue.type === 'error' ? (
                              <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                            ) : issue.type === 'warning' ? (
                              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            ) : (
                              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{issue.message}</p>
                              {issue.suggestion && (
                                <p className="text-xs text-muted-foreground mt-1">{issue.suggestion}</p>
                              )}
                            </div>
                            <Badge variant="outline">{issue.section}</Badge>
                          </div>
                        ))}
                      </CardContent>
                    </CardSpotlight>
                  </motion.div>
                )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
