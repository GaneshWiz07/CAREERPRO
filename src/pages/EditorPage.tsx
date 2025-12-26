import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ContactSection } from '@/components/resume/ContactSection';
import { SummarySection } from '@/components/resume/SummarySection';
import { ExperienceSection } from '@/components/resume/ExperienceSection';
import { EducationSection } from '@/components/resume/EducationSection';
import { SkillsSection } from '@/components/resume/SkillsSection';
import { CertificationsSection } from '@/components/resume/CertificationsSection';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  FileCheck, 
  Download, 
  FileText, 
  Eye, 
  Edit3,
  Loader2,
  FileDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { exportToPDF, downloadAsWord } from '@/lib/export';

export default function EditorPage() {
  const { resume, saveResume } = useResume();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isExporting, setIsExporting] = useState(false);

  const handleSave = () => {
    saveResume();
    toast.success('Resume saved!');
  };

  const handleExportPDF = async () => {
    setActiveTab('preview');
    setIsExporting(true);
    try {
      // Wait for preview to render
      await new Promise(resolve => setTimeout(resolve, 500));
      await exportToPDF(resume);
      toast.success('PDF downloaded!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWord = () => {
    downloadAsWord(resume);
    toast.success('Word document downloaded!');
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{resume.name}</h1>
              <p className="text-sm text-muted-foreground">Edit your master resume</p>
            </div>
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2" disabled={isExporting}>
                    {isExporting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleExportPDF}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportWord}>
                    <FileText className="h-4 w-4 mr-2" />
                    Download Word
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')}>
            <TabsList className="mb-6">
              <TabsTrigger value="edit" className="gap-2">
                <Edit3 className="h-4 w-4" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit">
              <div className="max-w-4xl mx-auto space-y-6">
                <ContactSection />
                <SummarySection />
                <ExperienceSection />
                <EducationSection />
                <SkillsSection />
                <CertificationsSection />
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="max-w-3xl mx-auto">
                <ResumePreview resume={resume} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
