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
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Sparkles,
  Loader2,
  Copy,
  Download,
  RefreshCw,
  Building2,
  User,
  Briefcase,
  CheckCircle2,
  Wand2,
  Mail
} from 'lucide-react';
import { invokeNetlifyFunction } from '@/lib/api';
import { toast } from 'sonner';
import { CardSpotlight } from '@/components/ui/aceternity/card-spotlight';
import { MovingBorderButton } from '@/components/ui/aceternity/moving-border';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import html2pdf from 'html2pdf.js';

interface CoverLetterResult {
  coverLetter: string;
  keyHighlights: string[];
  tone: string;
  wordCount: number;
}

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-appropriate' },
  { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and passionate' },
  { value: 'confident', label: 'Confident', description: 'Assertive and self-assured' },
  { value: 'conversational', label: 'Conversational', description: 'Friendly and approachable' },
];

const LENGTH_OPTIONS = [
  { value: 'short', label: 'Short', description: '200-250 words (3-4 paragraphs)' },
  { value: 'medium', label: 'Medium', description: '300-400 words (4-5 paragraphs)' },
  { value: 'long', label: 'Long', description: '450-550 words (5-6 paragraphs)' },
];

export default function CoverLetterPage() {
  const { resume } = useResume();
  const [yourName, setYourName] = useState(resume?.contactInfo?.fullName || '');
  const [yourEmail, setYourEmail] = useState(resume?.contactInfo?.email || '');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Update from resume if available
  React.useEffect(() => {
    if (resume?.contactInfo?.fullName && !yourName) {
      setYourName(resume.contactInfo.fullName);
    }
    if (resume?.contactInfo?.email && !yourEmail) {
      setYourEmail(resume.contactInfo.email);
    }
  }, [resume?.contactInfo]);

  const handleGenerate = async () => {
    if (!yourName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!jobTitle.trim() || !company.trim()) {
      toast.error('Please enter at least the job title and company name');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await invokeNetlifyFunction('generate-cover-letter', {
        jobTitle,
        company,
        hiringManager,
        jobDescription,
        tone,
        length,
        additionalInfo,
        resume: {
          contactInfo: {
            fullName: yourName,
            email: yourEmail,
            phone: resume?.contactInfo?.phone || '',
            location: resume?.contactInfo?.location || '',
          },
          summary: resume?.summary || '',
          experiences: resume?.experiences || [],
          skills: resume?.skills || [],
          education: resume?.education || [],
        },
      });

      if (error) throw error;
      setResult(data);
      toast.success('Cover letter generated!');
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast.error('Failed to generate cover letter');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (result?.coverLetter) {
      navigator.clipboard.writeText(result.coverLetter);
      toast.success('Copied to clipboard');
    }
  };

  const openDownloadDialog = () => {
    const defaultName = `Cover_Letter_${company.replace(/\s+/g, '_')}_${jobTitle.replace(/\s+/g, '_')}`;
    setFileName(defaultName);
    setShowDownloadDialog(true);
  };

  const handleDownloadPDF = async () => {
    if (!result?.coverLetter) return;

    setIsDownloading(true);
    try {
      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Process paragraphs - split by double newlines or single newlines
      const paragraphs = result.coverLetter
        .split(/\n\n+/)
        .filter(p => p.trim())
        .map(paragraph => {
          const trimmed = paragraph.trim().replace(/\n/g, ' ');
          return `<p style="margin: 0 0 12px 0; text-align: justify; line-height: 1.6;">${trimmed}</p>`;
        })
        .join('');

      // Simple, clean HTML structure
      const htmlContent = `
        <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #000000; background-color: #ffffff; padding: 20px;">
          <div style="margin-bottom: 24px;">
            <p style="margin: 0; font-size: 14pt; font-weight: bold;">${yourName}</p>
            ${yourEmail ? `<p style="margin: 0; font-size: 11pt; color: #444;">${yourEmail}</p>` : ''}
            ${resume?.contactInfo?.phone ? `<p style="margin: 0; font-size: 11pt; color: #444;">${resume.contactInfo.phone}</p>` : ''}
            ${resume?.contactInfo?.location ? `<p style="margin: 0; font-size: 11pt; color: #444;">${resume.contactInfo.location}</p>` : ''}
          </div>
          
          <p style="margin: 0 0 20px 0; font-size: 11pt; color: #444;">${today}</p>
          
          <div style="margin-bottom: 24px;">
            ${hiringManager ? `<p style="margin: 0;">${hiringManager}</p>` : ''}
            <p style="margin: 0;">${company}</p>
            <p style="margin: 0; font-weight: bold;">RE: ${jobTitle} Position</p>
          </div>
          
          <div>
            ${paragraphs}
          </div>
        </div>
      `;

      // Create container element - visible but off-screen
      const container = document.createElement('div');
      container.style.cssText = 'position: fixed; left: -10000px; top: 0; width: 8.5in; background: white; z-index: 1000;';
      container.innerHTML = htmlContent;
      document.body.appendChild(container);

      // Wait for fonts and render
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 800));

      // Simple PDF options
      const opt = {
        margin: 0.75,
        filename: `${fileName || 'Cover_Letter'}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: 'in',
          format: 'letter',
          orientation: 'portrait'
        }
      };

      const contentElement = container.firstElementChild as HTMLElement;
      if (contentElement) {
        await html2pdf().from(contentElement).set(opt).save();
      } else {
        await html2pdf().from(container).set(opt).save();
      }

      // Cleanup
      document.body.removeChild(container);
      setShowDownloadDialog(false);
      toast.success('Cover letter downloaded as PDF');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
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
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground flex items-center gap-2">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Cover Letter Generator
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Generate a personalized cover letter tailored to your target job
            </p>
          </div>
        </motion.header>

        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Your Information */}
              <CardSpotlight>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <User className="h-5 w-5 text-primary" />
                    Your Information
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Enter your details for the cover letter signature
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="yourName" className="text-sm">Your Name *</Label>
                      <Input
                        id="yourName"
                        value={yourName}
                        onChange={(e) => setYourName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yourEmail" className="text-sm">Your Email (optional)</Label>
                      <Input
                        id="yourEmail"
                        type="email"
                        value={yourEmail}
                        onChange={(e) => setYourEmail(e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </CardSpotlight>

              <CardSpotlight>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Job Details
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Enter information about the position you're applying for
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle" className="text-sm">Job Title *</Label>
                      <Input
                        id="jobTitle"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm">Company *</Label>
                      <Input
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Google"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hiringManager" className="text-sm">Hiring Manager (optional)</Label>
                    <Input
                      id="hiringManager"
                      value={hiringManager}
                      onChange={(e) => setHiringManager(e.target.value)}
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jd" className="text-sm">Job Description (optional)</Label>
                    <Textarea
                      id="jd"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description for better tailoring..."
                      className="min-h-[120px] text-sm"
                    />
                  </div>
                </CardContent>
              </CardSpotlight>

              <CardSpotlight>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Wand2 className="h-5 w-5 text-primary" />
                    Customization
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Adjust the tone and length of your cover letter
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm">Tone</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone">
                            {TONE_OPTIONS.find(t => t.value === tone)?.label}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {TONE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col items-start">
                                <span className="font-medium">{option.label}</span>
                                <span className="text-xs text-muted-foreground">{option.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Length</Label>
                      <Select value={length} onValueChange={setLength}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select length">
                            {LENGTH_OPTIONS.find(l => l.value === length)?.label}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {LENGTH_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col items-start">
                                <span className="font-medium">{option.label}</span>
                                <span className="text-xs text-muted-foreground">{option.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo" className="text-sm">Additional Information (optional)</Label>
                    <Textarea
                      id="additionalInfo"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Any specific points you want to highlight, why you're interested in this role, etc."
                      className="min-h-[80px] text-sm"
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
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Cover Letter
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
                  {/* Cover Letter Preview */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CardSpotlight>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                          <span className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Your Cover Letter
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleRegenerate}
                              disabled={isGenerating}
                              className="h-8 w-8 p-0"
                            >
                              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCopy}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={openDownloadDialog}
                              className="h-8 w-8 p-0"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {TONE_OPTIONS.find(t => t.value === tone)?.label || tone}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {LENGTH_OPTIONS.find(l => l.value === length)?.label || length}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {result.wordCount} words
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/30 rounded-lg p-4 sm:p-6 border border-border">
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                            {result.coverLetter}
                          </pre>
                        </div>
                      </CardContent>
                    </CardSpotlight>
                  </motion.div>

                  {/* Key Highlights */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <CardSpotlight>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          Key Highlights Used
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          Your strengths emphasized in this cover letter
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {result.keyHighlights.map((highlight, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + i * 0.1 }}
                              className="flex gap-2 text-sm"
                            >
                              <span className="text-primary shrink-0">•</span>
                              <span>{highlight}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </CardSpotlight>
                  </motion.div>

                  {/* Tips */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-4">
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          Pro Tips
                        </h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Review and personalize the letter before sending</li>
                          <li>• Add specific company achievements you admire</li>
                          <li>• Proofread for any errors or awkward phrasing</li>
                          <li>• Save different versions for different applications</li>
                        </ul>
                      </CardContent>
                    </Card>
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
                        <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      </motion.div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Ready to Generate
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Enter the job details and click "Generate Cover Letter" to create a personalized cover letter
                      </p>
                      <Separator className="my-6" />
                      <div className="text-left space-y-3">
                        <h4 className="text-sm font-medium text-foreground">What you'll get:</h4>
                        <ul className="text-xs text-muted-foreground space-y-2">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span>Personalized cover letter using your resume data</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span>Tailored to the specific job and company</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span>Multiple tone and length options</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span>Easy copy and download functionality</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </CardSpotlight>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Download Dialog */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Download Cover Letter
            </DialogTitle>
            <DialogDescription>
              Enter a name for your cover letter PDF file
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fileName">File Name</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="fileName"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Cover_Letter"
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">.pdf</span>
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <p className="font-medium mb-1">PDF will include:</p>
              <ul className="space-y-1">
                <li>• Your contact information</li>
                <li>• Today's date</li>
                <li>• Company and position details</li>
                <li>• Formatted cover letter content</li>
              </ul>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDownloadDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading || !fileName.trim()}
              className="w-full sm:w-auto"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

