import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, 
  Sparkles, 
  Loader2,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { invokeNetlifyFunction } from '@/lib/api';
import { toast } from 'sonner';
import { CardSpotlight } from '@/components/ui/aceternity/card-spotlight';
import { MovingBorderButton } from '@/components/ui/aceternity/moving-border';

interface SalaryData {
  lowRange: number;
  midRange: number;
  highRange: number;
  currency: string;
  factors: string[];
  negotiationTips: string[];
  marketInsights: string;
}

export default function SalaryPage() {
  const { resume } = useResume();
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);

  const handleAnalyze = async () => {
    if (!jobTitle.trim()) {
      toast.error('Please enter a job title');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await invokeNetlifyFunction('salary-analysis', {
        jobTitle,
        location: location || 'United States',
        yearsExperience: parseInt(yearsExperience) || 5,
        skills: resume.skills.map(s => s.name),
      });

      if (error) throw error;
      setSalaryData(data);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Error analyzing salary:', error);
      toast.error('Failed to analyze salary data');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatSalary = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
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
            <h1 className="text-2xl font-semibold text-foreground">Salary Negotiation Assistant</h1>
            <p className="text-sm text-muted-foreground">
              Get market salary data and negotiation tips based on your skills
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
                  <Briefcase className="h-5 w-5 text-primary" />
                  Position Details
                </CardTitle>
                <CardDescription>
                  Enter the role you're negotiating for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
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
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      placeholder="e.g., 5"
                    />
                  </div>
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
                      Analyzing Market Data...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Get Salary Insights
                    </>
                  )}
                </MovingBorderButton>
              </CardContent>
            </CardSpotlight>
          </motion.div>

          {/* Results */}
          {salaryData && (
            <>
              {/* Salary Range Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CardSpotlight>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Estimated Salary Range
                    </CardTitle>
                    <CardDescription>
                      Based on your skills, experience, and location
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3 text-center">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="p-4 rounded-lg bg-accent/30 border border-border"
                      >
                        <p className="text-sm text-muted-foreground mb-1">Entry Level</p>
                        <p className="text-2xl font-bold text-foreground">
                          {formatSalary(salaryData.lowRange, salaryData.currency)}
                        </p>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="p-4 rounded-lg bg-primary/10 border-2 border-primary"
                      >
                        <p className="text-sm text-primary mb-1">Target</p>
                        <p className="text-3xl font-bold text-primary">
                          {formatSalary(salaryData.midRange, salaryData.currency)}
                        </p>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="p-4 rounded-lg bg-accent/30 border border-border"
                      >
                        <p className="text-sm text-muted-foreground mb-1">Senior Level</p>
                        <p className="text-2xl font-bold text-foreground">
                          {formatSalary(salaryData.highRange, salaryData.currency)}
                        </p>
                      </motion.div>
                    </div>

                    {/* Salary Bar */}
                    <div className="mt-6">
                      <div className="h-4 rounded-full bg-accent overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: 0.6, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-accent via-primary to-primary/60"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{formatSalary(salaryData.lowRange, salaryData.currency)}</span>
                        <span>{formatSalary(salaryData.highRange, salaryData.currency)}</span>
                      </div>
                    </div>
                  </CardContent>
                </CardSpotlight>
              </motion.div>

              {/* Factors */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <CardSpotlight>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Factors Affecting Your Salary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {salaryData.factors.map((factor, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + i * 0.05 }}
                        >
                          <Badge variant="secondary">{factor}</Badge>
                        </motion.div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <p className="text-sm text-muted-foreground">{salaryData.marketInsights}</p>
                  </CardContent>
                </CardSpotlight>
              </motion.div>

              {/* Negotiation Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CardSpotlight>
                  <CardHeader>
                    <CardTitle>Negotiation Tips</CardTitle>
                    <CardDescription>
                      Strategies to maximize your compensation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {salaryData.negotiationTips.map((tip, i) => (
                        <motion.li 
                          key={i} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex gap-3 p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors"
                        >
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                            {i + 1}
                          </span>
                          <p className="text-sm text-foreground">{tip}</p>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </CardSpotlight>
              </motion.div>
            </>
          )}

          {!salaryData && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardSpotlight className="text-center py-12">
                <CardContent>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <DollarSign className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Know Your Worth</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter a job title to get personalized salary insights
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
