import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ContactSection } from '@/components/resume/ContactSection';
import { SummarySection } from '@/components/resume/SummarySection';
import { ExperienceSection } from '@/components/resume/ExperienceSection';
import { EducationSection } from '@/components/resume/EducationSection';
import { SkillsSection } from '@/components/resume/SkillsSection';
import { CertificationsSection } from '@/components/resume/CertificationsSection';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Save, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function EditorPage() {
  const { resume, saveResume } = useResume();

  const handleSave = () => {
    saveResume();
    toast.success('Resume saved!');
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
              <Button variant="outline" className="gap-2">
                <FileCheck className="h-4 w-4" />
                ATS Check
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <ContactSection />
          <SummarySection />
          <ExperienceSection />
          <EducationSection />
          <SkillsSection />
          <CertificationsSection />
        </div>
      </div>
    </DashboardLayout>
  );
}
