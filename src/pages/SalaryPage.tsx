import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DollarSign, 
  Sparkles, 
  Loader2,
  TrendingUp,
  Briefcase,
  Globe,
  Coins,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { invokeNetlifyFunction } from '@/lib/api';
import { toast } from 'sonner';
import { CardSpotlight } from '@/components/ui/aceternity/card-spotlight';
import { MovingBorderButton } from '@/components/ui/aceternity/moving-border';

// Currency options with symbols and country info
const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', country: 'United States' },
  { code: 'EUR', symbol: '€', name: 'Euro', country: 'European Union' },
  { code: 'GBP', symbol: '£', name: 'British Pound', country: 'United Kingdom' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', country: 'India' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', country: 'Canada' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', country: 'Australia' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', country: 'Japan' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', country: 'China' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', country: 'Singapore' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', country: 'United Arab Emirates' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', country: 'Switzerland' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', country: 'Sweden' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', country: 'New Zealand' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', country: 'South Africa' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', country: 'Brazil' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', country: 'Mexico' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', country: 'South Korea' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', country: 'Poland' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', country: 'Philippines' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', country: 'Indonesia' },
];

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
  const [currency, setCurrency] = useState('USD');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDetectingCurrency, setIsDetectingCurrency] = useState(false);
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [autoDetectedCurrency, setAutoDetectedCurrency] = useState<string | null>(null);
  const [manualCurrencyOverride, setManualCurrencyOverride] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  // Auto-detect currency based on location using Groq
  const detectCurrencyFromLocation = useCallback(async (locationText: string) => {
    if (!locationText.trim() || locationText.length < 2) {
      setAutoDetectedCurrency(null);
      return;
    }

    setIsDetectingCurrency(true);
    try {
      const { data, error } = await invokeNetlifyFunction('detect-currency', {
        location: locationText,
        availableCurrencies: CURRENCIES.map(c => ({ code: c.code, country: c.country })),
      });

      if (error) throw error;
      
      if (data?.currencyCode) {
        const detectedCurr = CURRENCIES.find(c => c.code === data.currencyCode);
        if (detectedCurr) {
          setAutoDetectedCurrency(data.currencyCode);
          // Only auto-switch if user hasn't manually overridden
          if (!manualCurrencyOverride) {
            setCurrency(data.currencyCode);
          }
        }
      }
    } catch (error) {
      console.error('Error detecting currency:', error);
      // Silently fail - currency detection is optional
    } finally {
      setIsDetectingCurrency(false);
    }
  }, [manualCurrencyOverride]);

  // Debounced location change handler
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (location.trim().length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        detectCurrencyFromLocation(location);
      }, 800); // Wait 800ms after user stops typing
    } else {
      setAutoDetectedCurrency(null);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [location, detectCurrencyFromLocation]);

  // Handle manual currency change
  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    setManualCurrencyOverride(true);
  };

  // Reset manual override when location changes significantly
  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    // Reset manual override if location is cleared or changed significantly
    if (!newLocation.trim()) {
      setManualCurrencyOverride(false);
    }
  };

  const handleAnalyze = async () => {
    if (!jobTitle.trim()) {
      toast.error('Please enter a job title');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await invokeNetlifyFunction('salary-analysis', {
        jobTitle,
        location: location || selectedCurrency.country,
        yearsExperience: parseInt(yearsExperience) || 5,
        skills: resume.skills.map(s => s.name),
        currency: currency,
        currencyName: selectedCurrency.name,
        country: selectedCurrency.country,
      });

      if (error) throw error;
      setSalaryData({ ...data, currency: currency });
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Error analyzing salary:', error);
      toast.error('Failed to analyze salary data');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Format salary with LPA/Lakhs for INR, Crores for very large INR amounts
  const formatSalary = (amount: number, currencyCode: string = 'USD') => {
    const currencyInfo = CURRENCIES.find(c => c.code === currencyCode);
    const symbol = currencyInfo?.symbol || currencyCode;
    
    // Special formatting for INR (Indian Rupees) - show in LPA
    if (currencyCode === 'INR') {
      const lakhs = amount / 100000;
      if (lakhs >= 100) {
        // Show in Crores if >= 1 Crore
        const crores = lakhs / 100;
        return `${symbol}${crores.toFixed(2)} Cr`;
      }
      return `${symbol}${lakhs.toFixed(1)} LPA`;
    }
    
    // Special formatting for JPY and KRW (no decimal currencies with large values)
    if (currencyCode === 'JPY' || currencyCode === 'KRW') {
      if (amount >= 10000000) {
        return `${symbol}${(amount / 10000000).toFixed(1)}M`;
      } else if (amount >= 10000) {
        return `${symbol}${(amount / 10000).toFixed(0)}万`;
      }
    }
    
    // Special formatting for IDR (Indonesian Rupiah) - show in millions
    if (currencyCode === 'IDR') {
      const millions = amount / 1000000;
      return `${symbol}${millions.toFixed(0)} Juta`;
    }
    
    // Default formatting for other currencies
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Get the salary format label based on currency
  const getSalaryFormatLabel = (currencyCode: string) => {
    switch (currencyCode) {
      case 'INR':
        return 'CTC per annum (LPA)';
      case 'JPY':
      case 'KRW':
        return 'Annual Salary';
      case 'IDR':
        return 'Monthly Salary (Juta)';
      default:
        return 'Annual Salary';
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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="jobTitle" className="h-5 flex items-center">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="location" className="h-5 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      Location
                      {isDetectingCurrency && (
                        <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground ml-1" />
                      )}
                    </Label>
                    <div className="relative">
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => handleLocationChange(e.target.value)}
                        placeholder="e.g., Bangalore, Mumbai, New York"
                        className={autoDetectedCurrency && !manualCurrencyOverride ? 'pr-16' : ''}
                      />
                      {autoDetectedCurrency && !manualCurrencyOverride && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                            {autoDetectedCurrency}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="experience" className="h-5 flex items-center">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      placeholder="e.g., 5"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="currency" className="h-5 flex items-center gap-1.5">
                      <Coins className="h-3.5 w-3.5" />
                      Currency
                      {autoDetectedCurrency && !manualCurrencyOverride && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 ml-1 text-green-600 border-green-600">
                          Auto
                        </Badge>
                      )}
                    </Label>
                    <Select value={currency} onValueChange={handleCurrencyChange}>
                      <SelectTrigger id="currency" className="h-10">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {CURRENCIES.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            <div className="flex items-center gap-2 w-full">
                              <span className="font-mono text-sm w-10 shrink-0">{curr.code}</span>
                              <span className="text-muted-foreground truncate">
                                {curr.symbol} - {curr.name}
                              </span>
                              {curr.code === autoDetectedCurrency && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0 ml-auto">
                                  Detected
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Currency Info Badge */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>
                    Showing salary estimates in <strong className="text-foreground">{selectedCurrency.name} ({selectedCurrency.symbol})</strong> 
                    {!location && <span> for <strong className="text-foreground">{selectedCurrency.country}</strong></span>}
                  </span>
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
                    <CardDescription className="flex items-center justify-between">
                      <span>Based on your skills, experience, and location</span>
                      <Badge variant="outline" className="ml-2">
                        {getSalaryFormatLabel(salaryData.currency)}
                      </Badge>
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
                        {salaryData.currency === 'INR' && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ₹{(salaryData.lowRange / 12).toLocaleString('en-IN', { maximumFractionDigits: 0 })}/month
                          </p>
                        )}
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="p-4 rounded-lg bg-primary/10 border-2 border-primary"
                      >
                        <p className="text-sm text-primary mb-1">Target CTC</p>
                        <p className="text-3xl font-bold text-primary">
                          {formatSalary(salaryData.midRange, salaryData.currency)}
                        </p>
                        {salaryData.currency === 'INR' && (
                          <p className="text-xs text-primary/70 mt-1">
                            ₹{(salaryData.midRange / 12).toLocaleString('en-IN', { maximumFractionDigits: 0 })}/month
                          </p>
                        )}
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
                        {salaryData.currency === 'INR' && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ₹{(salaryData.highRange / 12).toLocaleString('en-IN', { maximumFractionDigits: 0 })}/month
                          </p>
                        )}
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
