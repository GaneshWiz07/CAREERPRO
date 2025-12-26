import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Loader2, 
  ArrowRight,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function AchievementsPage() {
  const { resume, updateExperience } = useResume();
  const [inputBullet, setInputBullet] = useState('');
  const [transformedBullet, setTransformedBullet] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);

  const handleTransform = async () => {
    if (!inputBullet.trim()) {
      toast.error('Please enter a bullet point to transform');
      return;
    }

    setIsTransforming(true);
    try {
      const { data, error } = await supabase.functions.invoke('transform-achievement', {
        body: {
          bullet: inputBullet,
          role: 'Professional',
          company: 'Company',
        },
      });

      if (error) throw error;
      setTransformedBullet(data.transformedBullet);
      toast.success('Bullet transformed!');
    } catch (error) {
      console.error('Error transforming:', error);
      toast.error('Failed to transform bullet');
    } finally {
      setIsTransforming(false);
    }
  };

  const EXAMPLE_BEFORE_AFTER = [
    {
      before: 'Managed a team of developers',
      after: 'Led a cross-functional team of 8 engineers, delivering 12 product releases on time and reducing bug rates by 35%',
    },
    {
      before: 'Responsible for customer service',
      after: 'Resolved 150+ customer inquiries monthly, achieving a 98% satisfaction rating and reducing response time by 40%',
    },
    {
      before: 'Worked on sales activities',
      after: 'Generated $2.5M in new revenue by closing 45 enterprise deals, exceeding quarterly targets by 120%',
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-foreground">Achievement Transformer</h1>
            <p className="text-sm text-muted-foreground">
              Turn job duties into quantified achievements with AI
            </p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Transform Tool */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Transform Your Bullets
              </CardTitle>
              <CardDescription>
                Enter a basic duty or responsibility and get a powerful achievement statement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Original Bullet</Label>
                  <Textarea
                    value={inputBullet}
                    onChange={(e) => setInputBullet(e.target.value)}
                    placeholder="Enter a job duty or responsibility..."
                    className="min-h-[120px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Transformed Achievement</Label>
                  <Textarea
                    value={transformedBullet}
                    readOnly
                    placeholder="Your transformed achievement will appear here..."
                    className="min-h-[120px] bg-accent/30"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <Button 
                  onClick={handleTransform}
                  disabled={isTransforming}
                  className="gap-2"
                >
                  {isTransforming ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Transforming...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Transform
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Tips for Great Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-accent/30 border border-border">
                  <Badge variant="secondary" className="mb-2">Quantify</Badge>
                  <p className="text-sm text-muted-foreground">
                    Include numbers: percentages, dollar amounts, time saved, team size
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-accent/30 border border-border">
                  <Badge variant="secondary" className="mb-2">Action Verbs</Badge>
                  <p className="text-sm text-muted-foreground">
                    Start with strong verbs: Led, Implemented, Increased, Reduced, Developed
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-accent/30 border border-border">
                  <Badge variant="secondary" className="mb-2">Show Impact</Badge>
                  <p className="text-sm text-muted-foreground">
                    Focus on results and outcomes, not just tasks and responsibilities
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Before & After Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {EXAMPLE_BEFORE_AFTER.map((example, i) => (
                <div key={i} className="grid gap-4 md:grid-cols-2 p-4 rounded-lg border border-border">
                  <div>
                    <Badge variant="outline" className="mb-2 text-destructive border-destructive">Before</Badge>
                    <p className="text-sm text-muted-foreground">{example.before}</p>
                  </div>
                  <div>
                    <Badge className="mb-2 bg-primary">After</Badge>
                    <p className="text-sm">{example.after}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Transform from Resume */}
          {resume.experiences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Transform Bullets from Your Resume</CardTitle>
                <CardDescription>
                  Click on any bullet to transform it
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {resume.experiences.slice(0, 3).map((exp) => (
                  <div key={exp.id} className="space-y-2">
                    <p className="text-sm font-medium">{exp.title} at {exp.company}</p>
                    <div className="space-y-1">
                      {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                        <Button
                          key={idx}
                          variant="ghost"
                          className="w-full justify-start text-left h-auto py-2 px-3 text-sm"
                          onClick={() => setInputBullet(bullet)}
                        >
                          <span className="text-muted-foreground mr-2">•</span>
                          <span className="truncate">{bullet}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
