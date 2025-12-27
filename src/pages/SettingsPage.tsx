import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Palette,
  Download,
  Trash2,
  Moon,
  Sun
} from 'lucide-react';
import { useResume } from '@/contexts/ResumeContext';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { resumes } = useResume();
  const [darkMode, setDarkMode] = React.useState(false);

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage your preferences and data
            </p>
          </div>
        </header>

        <div className="max-w-2xl mx-auto p-6 space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle dark theme</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Data Management
              </CardTitle>
              <CardDescription>
                Export or manage your saved data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-accent/30 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Saved Resumes</span>
                  <span className="text-sm text-muted-foreground">{resumes.length} resumes</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your data is stored locally in your browser
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button variant="outline" className="w-full gap-2" onClick={handleExportAll}>
                  <Download className="h-4 w-4" />
                  Export All Data
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full gap-2 text-destructive hover:text-destructive" 
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
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>CareerPro</strong> - Your AI-powered career companion for crafting 
                job-winning resumes that get past ATS and into the hands of recruiters.
              </p>
              <p className="text-sm text-muted-foreground">
                Version 1.0.0
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
