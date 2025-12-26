import React, { useState, useRef } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Save, 
  FileCheck, 
  Download, 
  FileText, 
  Eye, 
  Edit3,
  Loader2,
  FileDown,
  Upload
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { exportToPDF, downloadAsWord } from '@/lib/export';
import { parseResume } from '@/lib/resumeParser';

export default function EditorPage() {
  const { resume, saveResume, importResumeData } = useResume();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'word'>('pdf');
  const [exportFilename, setExportFilename] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    saveResume();
    toast.success('Resume saved!');
  };

  const openExportDialog = (type: 'pdf' | 'word') => {
    setExportType(type);
    setExportFilename(resume.contact.fullName || 'resume');
    setExportDialogOpen(true);
  };

  const handleExport = async () => {
    setExportDialogOpen(false);
    
    if (exportType === 'pdf') {
      setActiveTab('preview');
      setIsExporting(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        await exportToPDF(resume, exportFilename);
        toast.success('PDF downloaded!');
      } catch (error) {
        console.error('Export error:', error);
        toast.error('Failed to export PDF');
      } finally {
        setIsExporting(false);
      }
    } else {
      downloadAsWord(resume, exportFilename);
      toast.success('Word document downloaded!');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.pdf') && !fileName.endsWith('.docx') && !fileName.endsWith('.doc')) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    setIsImporting(true);
    setActiveTab('edit');
    try {
      const parsedData = await parseResume(file);
      importResumeData(parsedData);
      toast.success('Resume imported! Check the form fields below.');
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import resume. Please try a different file.');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={handleImportClick}
                disabled={isImporting}
              >
                {isImporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Import
              </Button>
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
                  <DropdownMenuItem onClick={() => openExportDialog('pdf')}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openExportDialog('word')}>
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

        <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Resume</DialogTitle>
              <DialogDescription>
                Enter a filename for your {exportType === 'pdf' ? 'PDF' : 'Word'} document.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="filename">Filename</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  id="filename"
                  value={exportFilename}
                  onChange={(e) => setExportFilename(e.target.value)}
                  placeholder="Enter filename"
                />
                <span className="text-muted-foreground">
                  .{exportType === 'pdf' ? 'pdf' : 'doc'}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={!exportFilename.trim()}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
