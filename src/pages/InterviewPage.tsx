import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Sparkles, 
  Loader2, 
  Copy,
  Lightbulb,
  Target,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      const { data, error } = await supabase.functions.invoke('generate-interview-questions', {
        body: {
          jobTitle,
          jobDescription,
          resume: {
            summary: resume.summary,
            experiences: resume.experiences,
            skills: resume.skills,
          },
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
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-foreground">AI Interview Coach</h1>
            <p className="text-sm text-muted-foreground">
              Generate likely interview questions based on your resume and target job
            </p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Input Section */}
          <Card>
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
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full gap-2"
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
              </Button>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Interview Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-accent/30 border border-border">
                  <Badge className="mb-2">STAR Method</Badge>
                  <p className="text-sm text-muted-foreground">
                    Structure answers: Situation, Task, Action, Result
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-accent/30 border border-border">
                  <Badge className="mb-2">Quantify</Badge>
                  <p className="text-sm text-muted-foreground">
                    Use specific numbers and metrics in your examples
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-accent/30 border border-border">
                  <Badge className="mb-2">Practice</Badge>
                  <p className="text-sm text-muted-foreground">
                    Rehearse answers aloud, aim for 1-2 minutes per response
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Questions */}
          {questions.length > 0 && (
            <Card>
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
                  <div key={i} className="p-4 rounded-lg border border-border">
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
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {questions.length === 0 && !isGenerating && (
            <Card className="text-center py-12">
              <CardContent>
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-2">Ready to Practice?</h3>
                <p className="text-sm text-muted-foreground">
                  Enter a job title above to generate tailored interview questions
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
