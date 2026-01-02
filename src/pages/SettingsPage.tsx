import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Palette,
  Download,
  Trash2,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { useResume } from '@/contexts/ResumeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { resumes } = useResume();
  const { theme, setTheme, isDark } = useTheme();

  const handleExportAll = () => {
    const data = JSON.stringify({ resumes }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'career-portfolio-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Data exported!');
  };

  const handleClearData = () => {
    if (confirm('Are you sure? This will delete all your resumes and data.')) {
      localStorage.removeItem('adaptive-career-portfolio');
      window.location.reload();
    }
  };

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <header className="sticky top-0 md:top-0 z-10 bg-background border-b border-border">
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Settings</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage your preferences and data
            </p>
          </div>
        </header>

        <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Appearance
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Choose your preferred theme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Theme</Label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = theme === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setTheme(option.value);
                          toast.success(`Theme set to ${option.label}`);
                        }}
                        className={cn(
                          "flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-accent/50"
                        )}
                      >
                        <Icon className={cn(
                          "h-5 w-5 sm:h-6 sm:w-6",
                          isSelected ? "text-primary" : "text-muted-foreground"
                        )} />
                        <span className={cn(
                          "text-xs sm:text-sm font-medium",
                          isSelected ? "text-primary" : "text-muted-foreground"
                        )}>
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                  {theme === 'system' 
                    ? `Currently using ${isDark ? 'dark' : 'light'} mode based on your system settings`
                    : `Using ${theme} mode`
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Download className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Data Management
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Export or manage your saved data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 rounded-lg bg-accent/30 border border-border">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className="font-medium text-sm sm:text-base">Saved Resumes</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{resumes.length} resumes</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Your data is stored locally in your browser
                </p>
              </div>

              <Separator />

              <div className="space-y-2 sm:space-y-3">
                <Button variant="outline" className="w-full gap-2 h-9 sm:h-10 text-sm" onClick={handleExportAll}>
                  <Download className="h-4 w-4" />
                  Export All Data
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full gap-2 h-9 sm:h-10 text-sm text-destructive hover:text-destructive" 
                  onClick={handleClearData}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                <strong>CareerPro</strong> - Your AI-powered career companion for crafting 
                job-winning resumes that get past ATS and into the hands of recruiters.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Version 1.0.0
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
