import React, { useState, useRef } from 'react';
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
  Download,
  Eye,
  Edit3,
  Loader2,
  Upload,
  Palette
} from 'lucide-react';
import { toast } from 'sonner';
import { exportToPDF } from '@/lib/export';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    saveResume();
    toast.success('Resume saved!');
  };

  const openExportDialog = () => {
    setExportFilename(resume.contact.fullName || 'resume');
    setExportDialogOpen(true);
  };

  const handleExport = async () => {
    setExportDialogOpen(false);
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
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border"
        >
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
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleImportClick}
                  disabled={isImporting}
                  size="sm"
                >
                  {isImporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">Import</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={isExporting}
                  onClick={openExportDialog}
                  size="sm"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">Export PDF</span>
                </Button>
              </motion.div>
              <MovingBorderButton
                borderRadius="0.5rem"
                className="px-4 py-2 text-sm font-medium gap-2"
                containerClassName="h-9 w-auto"
                onClick={handleSave}
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save</span>
              </MovingBorderButton>
            </div>
          </div>
        </motion.header>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview' | 'template')}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <TabsList className="mb-6">
                <TabsTrigger value="edit" className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  Edit
                </TabsTrigger>
                <TabsTrigger value="template" className="gap-2">
                  <Palette className="h-4 w-4" />
                  Template
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <TabsContent value="edit">
              <div className="max-w-4xl mx-auto space-y-6">
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
      </div>
    </DashboardLayout>
  );
}
