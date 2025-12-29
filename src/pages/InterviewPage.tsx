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
import { 
  MessageSquare, 
  Sparkles, 
  Loader2, 
  Copy,
  Lightbulb,
  Target,
  Clock
} from 'lucide-react';
import { invokeNetlifyFunction } from '@/lib/api';
import { toast } from 'sonner';
import { CardSpotlight } from '@/components/ui/aceternity/card-spotlight';
import { MovingBorderButton } from '@/components/ui/aceternity/moving-border';

interface InterviewQuestion {
  question: string;
  type: 'behavioral' | 'technical' | 'situational';
  tip: string;
}

export default function InterviewPage() {
  const { resume } = useResume();
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);

  const handleGenerate = async () => {
    if (!jobDescription.trim() && !jobTitle.trim()) {
      toast.error('Please enter a job title or description');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await invokeNetlifyFunction('generate-interview-questions', {
        jobTitle,
        jobDescription,
        resume: {
          summary: resume.summary,
          experiences: resume.experiences,
          skills: resume.skills,
        },
      });

      if (error) throw error;
      setQuestions(data.questions || []);
      toast.success('Questions generated!');
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate questions');
    } finally {
      setIsGenerating(false);
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'behavioral': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'technical': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'situational': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return '';
    }
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
            <h1 className="text-2xl font-semibold text-foreground">AI Interview Coach</h1>
            <p className="text-sm text-muted-foreground">
              Generate likely interview questions based on your resume and target job
            </p>
          </div>
        </motion.header>

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CardSpotlight>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Target Position
                </CardTitle>
                <CardDescription>
                  Enter the job you're interviewing for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jd">Job Description (Optional)</Label>
                  <Textarea
                    id="jd"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description for more targeted questions..."
                    className="min-h-[120px]"
                  />
                </div>
                <MovingBorderButton
                  borderRadius="0.5rem"
                  className="w-full px-4 py-2 text-sm font-medium gap-2"
                  containerClassName="h-12 w-full"
                  onClick={handleGenerate}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Interview Questions
                    </>
                  )}
                </MovingBorderButton>
              </CardContent>
            </CardSpotlight>
          </motion.div>

          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardSpotlight>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Interview Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { badge: 'STAR Method', tip: 'Structure answers: Situation, Task, Action, Result' },
                    { badge: 'Quantify', tip: 'Use specific numbers and metrics in your examples' },
                    { badge: 'Practice', tip: 'Rehearse answers aloud, aim for 1-2 minutes per response' },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="p-4 rounded-lg bg-accent/30 border border-border"
                    >
                      <Badge className="mb-2">{item.badge}</Badge>
                      <p className="text-sm text-muted-foreground">{item.tip}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </CardSpotlight>
          </motion.div>

          {/* Generated Questions */}
          {questions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardSpotlight>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Interview Questions ({questions.length})
                  </CardTitle>
                  <CardDescription>
                    Practice these likely questions for your interview
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {questions.map((q, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="p-4 rounded-lg border border-border hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className={getTypeBadgeColor(q.type)}>
                              {q.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              ~2 min answer
                            </span>
                          </div>
                          <p className="font-medium text-foreground mb-2">{q.question}</p>
                          <p className="text-sm text-muted-foreground">
                            <Lightbulb className="h-3 w-3 inline mr-1" />
                            {q.tip}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            navigator.clipboard.writeText(q.question);
                            toast.success('Question copied!');
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </CardSpotlight>
            </motion.div>
          )}

          {questions.length === 0 && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardSpotlight className="text-center py-12">
                <CardContent>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Ready to Practice?</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter a job title above to generate tailored interview questions
                  </p>
                </CardContent>
              </CardSpotlight>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
