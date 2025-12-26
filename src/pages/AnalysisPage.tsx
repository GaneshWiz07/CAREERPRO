import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  FileText,
  Type,
  Layout,
  ListChecks
} from 'lucide-react';
import { ATSValidation, ATSIssue } from '@/types/resume';

const ATS_SAFE_FONTS = ['Arial', 'Calibri', 'Georgia', 'Times New Roman', 'Helvetica', 'Verdana'];
const STANDARD_HEADERS = ['Work Experience', 'Experience', 'Education', 'Skills', 'Summary', 'Professional Summary', 'Certifications'];

export default function AnalysisPage() {
  const { resume } = useResume();

  // Perform ATS validation
  const validateATS = (): ATSValidation => {
    const issues: ATSIssue[] = [];
    let score = 100;

    // Check contact info
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

    // Check summary
    if (!resume.summary) {
      issues.push({ type: 'warning', message: 'Missing professional summary', section: 'Summary', suggestion: 'Add a 2-3 sentence summary' });
      score -= 10;
    } else if (resume.summary.length < 100) {
      issues.push({ type: 'info', message: 'Summary is quite short', section: 'Summary', suggestion: 'Aim for 150-300 characters' });
      score -= 3;
    }

    // Check experience
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
        // Check for metrics in bullets
        const hasMetrics = exp.bullets.some(b => /\d+%|\$\d+|\d+ (hours|days|weeks|months|years)/.test(b));
        if (!hasMetrics && exp.bullets.length > 0) {
          issues.push({ type: 'info', message: `Experience ${idx + 1}: No quantified achievements`, section: 'Experience', suggestion: 'Add metrics like percentages or dollar amounts' });
          score -= 3;
        }
      });
    }

    // Check education
    if (resume.education.length === 0) {
      issues.push({ type: 'warning', message: 'No education listed', section: 'Education', suggestion: 'Add your educational background' });
      score -= 5;
    }

    // Check skills
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

  const validation = validateATS();
  const errors = validation.issues.filter(i => i.type === 'error');
  const warnings = validation.issues.filter(i => i.type === 'warning');
  const info = validation.issues.filter(i => i.type === 'info');

  const getScoreColor = () => {
    if (validation.score >= 80) return 'text-primary';
    if (validation.score >= 60) return 'text-yellow-600';
    return 'text-destructive';
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-foreground">ATS Analysis</h1>
            <p className="text-sm text-muted-foreground">
              Check if your resume is optimized for Applicant Tracking Systems
            </p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Score Card */}
          <Card>
            <CardHeader>
              <CardTitle>ATS Compatibility Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <span className={`text-6xl font-bold ${getScoreColor()}`}>
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
      </div>
    </DashboardLayout>
  );
}
