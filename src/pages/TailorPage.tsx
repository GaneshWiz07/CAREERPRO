import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Target, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Copy,
  FileText
} from 'lucide-react';
import { invokeNetlifyFunction } from '@/lib/api';
import { toast } from 'sonner';
import { CardSpotlight } from '@/components/ui/aceternity/card-spotlight';
import { MovingBorderButton } from '@/components/ui/aceternity/moving-border';

interface TailorResult {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  tailoredSummary: string;
  suggestions: string[];
}

export default function TailorPage() {
  const { resume } = useResume();
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<TailorResult | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description');
      return;
    }

    if (!resume.summary && resume.experiences.length === 0) {
      toast.error('Please add some content to your resume first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await invokeNetlifyFunction('tailor-resume', {
        jobDescription,
        jobTitle,
        company,
        resume: {
          summary: resume.summary,
          experiences: resume.experiences,
          skills: resume.skills,
          education: resume.education,
        },
      });

      if (error) throw error;
      setResult(data);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Error analyzing JD:', error);
      toast.error('Failed to analyze job description');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-yellow-600';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Needs Improvement';
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 md:top-0 z-10 bg-background border-b border-border"
        >
          <div className="px-4 sm:px-6 py-4">
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Job Tailoring</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Paste a job description to get AI-powered tailoring suggestions
            </p>
          </div>
        </motion.header>

        <div className="max-w-6xl mx-auto p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <CardSpotlight>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Job Description
                  </CardTitle>
                  <CardDescription>
                    Paste the full job description to analyze keyword match
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Senior Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Tech Corp"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jd">Job Description</Label>
                    <Textarea
                      id="jd"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the full job description here..."
                      className="min-h-[300px]"
                    />
                  </div>
                  <MovingBorderButton
                    borderRadius="0.5rem"
                    className="w-full px-4 py-2 text-sm font-medium gap-2"
                    containerClassName="h-12 w-full"
                    onClick={handleAnalyze}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Analyze & Tailor
                      </>
                    )}
                  </MovingBorderButton>
                </CardContent>
              </CardSpotlight>
            </motion.div>

            {/* Results Section */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* Match Score */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CardSpotlight>
                      <CardHeader>
                        <CardTitle>Match Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center mb-4">
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.3 }}
                            className={`text-5xl font-bold ${getScoreColor(result.matchScore)}`}
                          >
                            {result.matchScore}%
                          </motion.span>
                          <p className={`text-sm mt-1 ${getScoreColor(result.matchScore)}`}>
                            {getScoreLabel(result.matchScore)}
                          </p>
                        </div>
                        <Progress value={result.matchScore} className="h-3" />
                      </CardContent>
                    </CardSpotlight>
                  </motion.div>

                  {/* Keywords */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <CardSpotlight>
                      <CardHeader>
                        <CardTitle>Keyword Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Matched Keywords ({result.matchedKeywords.length})</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {result.matchedKeywords.map((kw, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.05 }}
                              >
                                <Badge variant="secondary" className="bg-primary/10 text-primary">
                                  {kw}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <XCircle className="h-4 w-4 text-destructive" />
                            <span className="text-sm font-medium">Missing Keywords ({result.missingKeywords.length})</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {result.missingKeywords.map((kw, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + i * 0.05 }}
                              >
                                <Badge variant="outline" className="border-destructive text-destructive">
                                  {kw}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </CardSpotlight>
                  </motion.div>

                  {/* Tailored Summary */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <CardSpotlight>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Tailored Summary
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(result.tailoredSummary);
                              toast.success('Copied to clipboard');
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">{result.tailoredSummary}</p>
                      </CardContent>
                    </CardSpotlight>
                  </motion.div>

                  {/* Suggestions */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <CardSpotlight>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-primary" />
                          Improvement Suggestions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {result.suggestions.map((suggestion, i) => (
                            <motion.li 
                              key={i} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + i * 0.1 }}
                              className="flex gap-2 text-sm"
                            >
                              <span className="text-primary">•</span>
                              {suggestion}
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </CardSpotlight>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardSpotlight className="h-full flex items-center justify-center min-h-[400px]">
                    <CardContent className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      </motion.div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Ready to Tailor
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-xs">
                        Paste a job description and click "Analyze & Tailor" to see how well your resume matches
                      </p>
                    </CardContent>
                  </CardSpotlight>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
