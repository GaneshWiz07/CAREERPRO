import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useResume } from '@/contexts/ResumeContext';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Flame,
  Clock,
  Target,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';

export default function HeatmapPage() {
  const { resume } = useResume();
  const [showHeatmap, setShowHeatmap] = useState(true);

  const HEATMAP_ZONES = [
    { zone: 'Name & Contact', attention: 'Very High', time: '1.5s', color: 'bg-red-500', tip: 'Make your name prominent and contact info scannable' },
    { zone: 'Professional Summary', attention: 'High', time: '1.0s', color: 'bg-orange-500', tip: 'First 2-3 lines are critical - front-load key qualifications' },
    { zone: 'Recent Experience', attention: 'High', time: '2.0s', color: 'bg-yellow-500', tip: 'Most recent role gets the most attention - make it count' },
    { zone: 'Skills Section', attention: 'Medium', time: '1.0s', color: 'bg-blue-500', tip: 'Use keywords that match the job description' },
    { zone: 'Earlier Experience', attention: 'Low', time: '0.5s', color: 'bg-blue-300', tip: 'Keep older roles brief - focus on key achievements only' },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-foreground">Recruiter Heatmap</h1>
            <p className="text-sm text-muted-foreground">
              See where recruiters focus during the 6-second initial scan
            </p>
          </div>
        </header>

        <div className="p-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Preview */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      Resume Preview
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="heatmap"
                        checked={showHeatmap}
                        onCheckedChange={setShowHeatmap}
                      />
                      <Label htmlFor="heatmap" className="flex items-center gap-2">
                        <Flame className="h-4 w-4" />
                        Show Heatmap
                      </Label>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResumePreview resume={resume} showHeatmap={showHeatmap} />
                </CardContent>
              </Card>
            </div>

            {/* Insights */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    The 6-Second Scan
                  </CardTitle>
                  <CardDescription>
                    Recruiters spend an average of 6 seconds on initial resume screening
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20 mb-4">
                    <span className="text-4xl font-bold text-primary">6</span>
                    <p className="text-sm text-muted-foreground">seconds average</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    During this quick scan, recruiters look for key qualifications, 
                    relevant experience, and skills that match the job requirements.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Attention Zones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {HEATMAP_ZONES.map((zone, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                      <div className={`w-3 h-3 rounded-full ${zone.color} mt-1`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{zone.zone}</span>
                          <Badge variant="outline" className="text-xs">
                            ~{zone.time}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{zone.tip}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-accent/30 border border-border">
                    <p className="text-sm font-medium mb-1">F-Pattern Reading</p>
                    <p className="text-xs text-muted-foreground">
                      Recruiters scan in an F-pattern: across the top, then down the left side
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/30 border border-border">
                    <p className="text-sm font-medium mb-1">Top Third Matters Most</p>
                    <p className="text-xs text-muted-foreground">
                      60% of viewing time is spent on the top third of your resume
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/30 border border-border">
                    <p className="text-sm font-medium mb-1">Keywords Are King</p>
                    <p className="text-xs text-muted-foreground">
                      Recruiters scan for specific keywords matching the job description
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
