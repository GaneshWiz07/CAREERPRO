import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ContactSection } from '@/components/resume/ContactSection';
import { SummarySection } from '@/components/resume/SummarySection';
import { ExperienceSection } from '@/components/resume/ExperienceSection';
import { EducationSection } from '@/components/resume/EducationSection';
import { SkillsSection } from '@/components/resume/SkillsSection';
import { CertificationsSection } from '@/components/resume/CertificationsSection';
import { CustomSectionsSection } from '@/components/resume/CustomSectionsSection';
import { SectionReorder } from '@/components/resume/SectionReorder';
import { PaginatedPreview } from '@/components/resume/PaginatedPreview';
import { TemplateSelector } from '@/components/resume/TemplateSelector';
import { ResumeCompleteness } from '@/components/resume/ResumeCompleteness';
import { ResumeStats } from '@/components/resume/ResumeStats';
import { AutoSaveIndicator } from '@/components/resume/AutoSaveIndicator';
import { QuickActions } from '@/components/resume/QuickActions';
import { useResume } from '@/contexts/ResumeContext';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useKeyboardShortcuts, createEditorShortcuts } from '@/hooks/useKeyboardShortcuts';
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
  Download,
  Eye,
  Edit3,
  Loader2,
  Upload,
  Palette,
  Keyboard
} from 'lucide-react';
import { toast } from 'sonner';
import { exportToPDF, exportToText } from '@/lib/export';
import { parseResume } from '@/lib/resumeParser';
import { CardSpotlight } from '@/components/ui/aceternity/card-spotlight';
import { MovingBorderButton } from '@/components/ui/aceternity/moving-border';

export default function EditorPage() {
  const { resume, updateResume, saveResume, importResumeData } = useResume();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'template'>('edit');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFilename, setExportFilename] = useState('');
  const [shortcutsDialogOpen, setShortcutsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = useCallback(() => {
    saveResume();
    toast.success('Resume saved!');
  }, [saveResume]);

  // Auto-save functionality
  const autoSaveStatus = useAutoSave({
    data: resume,
    onSave: saveResume,
    interval: 30000, // 30 seconds
    debounce: 3000, // 3 seconds after last change
  });

  // Keyboard shortcuts
  const shortcuts = createEditorShortcuts({
    onSave: handleSave,
    onExport: () => openExportDialog(),
    onPreview: () => setActiveTab(activeTab === 'preview' ? 'edit' : 'preview'),
  });
  useKeyboardShortcuts({ shortcuts });

  // Export to text
  const handleExportText = useCallback(() => {
    const text = exportToText(resume);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.contact.fullName || 'resume'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Text file downloaded!');
  }, [resume]);

  const openExportDialog = () => {
    setExportFilename(resume.contact.fullName || 'resume');
    setExportDialogOpen(true);
  };

  const handleExport = async () => {
    setExportDialogOpen(false);
    setIsExporting(true);
    try {
      await exportToPDF(resume, exportFilename);
      toast.success('PDF downloaded!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
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
      console.log('Starting resume parse for:', file.name);
      const parsedData = await parseResume(file);
      console.log('Parsed data:', parsedData);
      importResumeData(parsedData);
      toast.success('Resume imported! Check the form fields below.');
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(`Failed to import: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Get sections in order for rendering
  const allSections = [
    ...resume.sections.filter(s => s.type !== 'custom'),
    ...resume.customSections.map(cs => ({
      id: cs.id,
      type: 'custom' as const,
      title: cs.title,
      order: cs.order,
      visible: cs.visible,
    })),
  ].sort((a, b) => a.order - b.order);

  const renderEditSection = (sectionType: string) => {
    switch (sectionType) {
      case 'contact': return <ContactSection key="contact" />;
      case 'summary': return <SummarySection key="summary" />;
      case 'experience': return <ExperienceSection key="experience" />;
      case 'education': return <EducationSection key="education" />;
      case 'skills': return <SkillsSection key="skills" />;
      case 'certifications': return <CertificationsSection key="certifications" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 md:top-0 z-10 bg-background border-b border-border"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 gap-3">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-semibold text-foreground truncate">{resume.name}</h1>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <p className="text-xs sm:text-sm text-muted-foreground">Edit your master resume</p>
                <AutoSaveIndicator {...autoSaveStatus} className="hidden xs:flex" />
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Keyboard Shortcuts Button - hidden on mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 hidden sm:flex"
                onClick={() => setShortcutsDialogOpen(true)}
                title="Keyboard Shortcuts"
              >
                <Keyboard className="h-4 w-4" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <Button
                variant="outline"
                className="gap-1.5 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
                onClick={handleImportClick}
                disabled={isImporting}
                size="sm"
              >
                {isImporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span className="hidden sm:inline text-xs sm:text-sm">Import</span>
              </Button>
              <Button
                variant="outline"
                className="gap-1.5 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
                disabled={isExporting}
                onClick={openExportDialog}
                size="sm"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span className="hidden sm:inline text-xs sm:text-sm">Export</span>
              </Button>
              <Button
                className="gap-1.5 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
                onClick={handleSave}
                size="sm"
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">Save</span>
              </Button>
            </div>
          </div>
        </motion.header>

        <div className="p-3 sm:p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview' | 'template')}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <TabsList className="mb-4 sm:mb-6 w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
                <TabsTrigger value="edit" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Edit</span>
                </TabsTrigger>
                <TabsTrigger value="template" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <Palette className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Template</span>
                  <span className="xs:hidden">Style</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Preview</span>
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <TabsContent value="edit">
              <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                {/* Resume Completeness & Stats Row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="grid gap-3 sm:gap-4 lg:grid-cols-2"
                >
                  <ResumeCompleteness resume={resume} />
                  <ResumeStats resume={resume} />
                </motion.div>

                {/* Section Reorder Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <CardSpotlight className="p-0">
                    <SectionReorder />
                  </CardSpotlight>
                </motion.div>

                {/* Render sections in order, excluding custom */}
                {allSections
                  .filter(s => s.visible && s.type !== 'custom')
                  .map((section, index) => (
                    <motion.div
                      key={section.type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      {renderEditSection(section.type)}
                    </motion.div>
                  ))}

                {/* Custom sections */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <CustomSectionsSection />
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="template">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
              >
                <TemplateSelector
                  selectedTemplate={resume.templateId || 'classic'}
                  onSelectTemplate={(templateId) => {
                    updateResume({ templateId });
                    toast.success('Template updated!');
                  }}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="preview">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <PaginatedPreview resume={resume} />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Resume</DialogTitle>
              <DialogDescription>
                Enter a filename for your PDF document.
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
                <span className="text-muted-foreground">.pdf</span>
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

        {/* Keyboard Shortcuts Dialog */}
        <Dialog open={shortcutsDialogOpen} onOpenChange={setShortcutsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Keyboard Shortcuts
              </DialogTitle>
              <DialogDescription>
                Use these shortcuts to work faster
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              {[
                { keys: ['Ctrl', 'S'], action: 'Save resume' },
                { keys: ['Ctrl', 'E'], action: 'Export PDF' },
                { keys: ['Ctrl', 'Shift', 'P'], action: 'Toggle preview' },
              ].map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{shortcut.action}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, j) => (
                      <React.Fragment key={j}>
                        <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded border">
                          {key}
                        </kbd>
                        {j < shortcut.keys.length - 1 && (
                          <span className="text-muted-foreground">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShortcutsDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
