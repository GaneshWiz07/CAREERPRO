import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  FileText,
  Type,
  Layout,
  ListChecks,
  Sparkles,
  Target,
  Zap,
  ArrowRight,
  Copy,
  Check,
  Loader2,
  TrendingUp,
  Award,
  Briefcase
} from 'lucide-react';
import { ATSValidation, ATSIssue } from '@/types/resume';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  // Perform basic ATS validation (existing logic)
  const validateATS = (): ATSValidation => {
    const issues: ATSIssue[] = [];
    let score = 100;

    if (!resume.contact.fullName) {
      issues.push({ type: 'error', message: 'Missing full name', section: 'Contact', suggestion: 'Add your full name' });
      score -= 15;
    }
    if (!resume.contact.email) {
      issues.push({ type: 'error', message: 'Missing email address', section: 'Contact', suggestion: 'Add a professional email' });
      score -= 10;
    }
    if (!resume.contact.phone) {
      issues.push({ type: 'warning', message: 'Missing phone number', section: 'Contact', suggestion: 'Add a phone number' });
      score -= 5;
    }

    if (!resume.summary) {
      issues.push({ type: 'warning', message: 'Missing professional summary', section: 'Summary', suggestion: 'Add a 2-3 sentence summary' });
      score -= 10;
    } else if (resume.summary.length < 100) {
      issues.push({ type: 'info', message: 'Summary is quite short', section: 'Summary', suggestion: 'Aim for 150-300 characters' });
      score -= 3;
    }

    if (resume.experiences.length === 0) {
      issues.push({ type: 'error', message: 'No work experience listed', section: 'Experience', suggestion: 'Add at least one work experience' });
      score -= 20;
    } else {
      resume.experiences.forEach((exp, idx) => {
        if (!exp.title) {
          issues.push({ type: 'error', message: `Experience ${idx + 1}: Missing job title`, section: 'Experience' });
          score -= 5;
        }
        if (!exp.company) {
          issues.push({ type: 'error', message: `Experience ${idx + 1}: Missing company name`, section: 'Experience' });
          score -= 5;
        }
        if (exp.bullets.filter(b => b.trim()).length === 0) {
          issues.push({ type: 'warning', message: `Experience ${idx + 1}: No bullet points`, section: 'Experience', suggestion: 'Add 3-5 achievement bullets' });
          score -= 5;
        }
        const hasMetrics = exp.bullets.some(b => /\d+%|\$\d+|\d+ (hours|days|weeks|months|years)/.test(b));
        if (!hasMetrics && exp.bullets.length > 0) {
          issues.push({ type: 'info', message: `Experience ${idx + 1}: No quantified achievements`, section: 'Experience', suggestion: 'Add metrics like percentages or dollar amounts' });
          score -= 3;
        }
      });
    }

    if (resume.education.length === 0) {
      issues.push({ type: 'warning', message: 'No education listed', section: 'Education', suggestion: 'Add your educational background' });
      score -= 5;
    }

    if (resume.skills.length === 0) {
      issues.push({ type: 'warning', message: 'No skills listed', section: 'Skills', suggestion: 'Add relevant technical and soft skills' });
      score -= 10;
    } else if (resume.skills.length < 5) {
      issues.push({ type: 'info', message: 'Few skills listed', section: 'Skills', suggestion: 'Consider adding more relevant skills' });
      score -= 3;
    }

    return {
      isValid: issues.filter(i => i.type === 'error').length === 0,
      score: Math.max(0, score),
      issues,
    };
  };

  const analyzeWithAI = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-ats', {
        body: { resume, jobDescription }
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
    
    // Apply summary
    if (aiAnalysis?.optimizedContent.summary && !appliedItems.has('summary')) {
      updateSummary(aiAnalysis.optimizedContent.summary);
      setAppliedItems(prev => new Set(prev).add('summary'));
      count++;
    }

    // Apply all bullets
    aiAnalysis?.optimizedContent.experienceBullets.forEach((bullet, idx) => {
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

    // Add missing skills
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

  const validation = validateATS();
  const errors = validation.issues.filter(i => i.type === 'error');
  const warnings = validation.issues.filter(i => i.type === 'warning');
  const info = validation.issues.filter(i => i.type === 'info');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-yellow-600';
    return 'text-destructive';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-primary';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-destructive';
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-foreground">ATS Analysis</h1>
            <p className="text-sm text-muted-foreground">
              AI-powered ATS scoring with auto-optimization
            </p>
          </div>
        </header>

        <div className="p-6">
          <Tabs defaultValue="ai-analysis" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="ai-analysis" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Analysis
              </TabsTrigger>
              <TabsTrigger value="basic-check" className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                Basic Check
              </TabsTrigger>
            </TabsList>

            {/* AI Analysis Tab */}
            <TabsContent value="ai-analysis" className="space-y-6">
              {/* Job Description Input */}
              <Card>
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
                  <Button 
                    onClick={analyzeWithAI} 
                    disabled={isAnalyzing || !jobDescription.trim()}
                    className="w-full"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyze & Optimize
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* AI Analysis Results */}
              {aiAnalysis && (
                <>
                  {/* Score Overview */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
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
                              <circle
                                className={getScoreColor(aiAnalysis.score)}
                                strokeWidth="8"
                                strokeDasharray={`${aiAnalysis.score * 3.52} 352`}
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
                    </Card>

                    <Card>
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
                    </Card>
                  </div>

                  {/* Keywords Analysis */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          Matched Keywords ({aiAnalysis.matchedKeywords.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {aiAnalysis.matchedKeywords.map((keyword, i) => (
                            <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                              {keyword}
                            </Badge>
                          ))}
                          {aiAnalysis.matchedKeywords.length === 0 && (
                            <p className="text-sm text-muted-foreground">No matching keywords found</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
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
                            <Badge key={i} variant="outline" className="border-destructive/50 text-destructive">
                              {keyword}
                            </Badge>
                          ))}
                          {aiAnalysis.missingKeywords.length === 0 && (
                            <p className="text-sm text-muted-foreground">All critical keywords covered!</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Optimized Content */}
                  <Card>
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
                      {/* Optimized Summary */}
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
                                {copiedItems.has('summary-copy') ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                onClick={applySummary}
                                disabled={appliedItems.has('summary')}
                              >
                                {appliedItems.has('summary') ? (
                                  <>
                                    <Check className="h-4 w-4 mr-1" />
                                    Applied
                                  </>
                                ) : (
                                  <>
                                    <ArrowRight className="h-4 w-4 mr-1" />
                                    Apply
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="p-4 rounded-lg bg-accent/50 border border-border">
                            <p className="text-sm">{aiAnalysis.optimizedContent.summary}</p>
                          </div>
                        </div>
                      )}

                      {/* Optimized Bullets */}
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
                                        {copiedItems.has(`bullet-copy-${idx}`) ? (
                                          <Check className="h-4 w-4" />
                                        ) : (
                                          <Copy className="h-4 w-4" />
                                        )}
                                      </Button>
                                      {expIdx !== -1 && bulletIdx !== -1 && (
                                        <Button
                                          size="sm"
                                          onClick={() => applyBullet(expIdx, bulletIdx, bullet.optimized)}
                                          disabled={appliedItems.has(itemKey)}
                                        >
                                          {appliedItems.has(itemKey) ? (
                                            <>
                                              <Check className="h-4 w-4 mr-1" />
                                              Applied
                                            </>
                                          ) : (
                                            <>
                                              <ArrowRight className="h-4 w-4 mr-1" />
                                              Apply
                                            </>
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

                      {/* Additional Skills */}
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
                  </Card>

                  {/* Recommendations */}
                  {aiAnalysis.recommendations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" />
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {aiAnalysis.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                {i + 1}
                              </span>
                              <p className="text-sm">{rec}</p>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* AI-detected Issues */}
                  {aiAnalysis.issues.length > 0 && (
                    <Card>
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
                    </Card>
                  )}
                </>
              )}
            </TabsContent>

            {/* Basic Check Tab */}
            <TabsContent value="basic-check" className="space-y-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Score Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>ATS Compatibility Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <span className={`text-6xl font-bold ${getScoreColor(validation.score)}`}>
                          {validation.score}
                        </span>
                        <p className="text-sm text-muted-foreground mt-1">out of 100</p>
                      </div>
                      <div className="flex-1 space-y-3">
                        <Progress value={validation.score} className="h-4" />
                        <div className="flex gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <XCircle className="h-4 w-4 text-destructive" />
                            {errors.length} Errors
                          </span>
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            {warnings.length} Warnings
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            {info.length} Suggestions
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Checks */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Type className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Font</p>
                          <p className="text-xs text-muted-foreground">ATS-Safe</p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Layout className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Layout</p>
                          <p className="text-xs text-muted-foreground">Single Column</p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Headers</p>
                          <p className="text-xs text-muted-foreground">Standard</p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <ListChecks className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Format</p>
                          <p className="text-xs text-muted-foreground">Clean Text</p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Issues List */}
                {errors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-destructive">
                        <XCircle className="h-5 w-5" />
                        Critical Issues ({errors.length})
                      </CardTitle>
                      <CardDescription>These must be fixed for ATS compatibility</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {errors.map((issue, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                          <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">{issue.message}</p>
                            {issue.suggestion && (
                              <p className="text-xs text-muted-foreground mt-1">{issue.suggestion}</p>
                            )}
                          </div>
                          {issue.section && (
                            <Badge variant="outline" className="ml-auto">{issue.section}</Badge>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {warnings.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-600">
                        <AlertTriangle className="h-5 w-5" />
                        Warnings ({warnings.length})
                      </CardTitle>
                      <CardDescription>Recommended improvements</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {warnings.map((issue, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">{issue.message}</p>
                            {issue.suggestion && (
                              <p className="text-xs text-muted-foreground mt-1">{issue.suggestion}</p>
                            )}
                          </div>
                          {issue.section && (
                            <Badge variant="outline" className="ml-auto">{issue.section}</Badge>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {info.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <CheckCircle2 className="h-5 w-5" />
                        Suggestions ({info.length})
                      </CardTitle>
                      <CardDescription>Optional improvements</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {info.map((issue, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-accent/50 border border-border">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">{issue.message}</p>
                            {issue.suggestion && (
                              <p className="text-xs text-muted-foreground mt-1">{issue.suggestion}</p>
                            )}
                          </div>
                          {issue.section && (
                            <Badge variant="outline" className="ml-auto">{issue.section}</Badge>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {validation.issues.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-primary" />
                      <h3 className="text-xl font-semibold mb-2">Perfect Score!</h3>
                      <p className="text-muted-foreground">Your resume is fully optimized for ATS systems.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
