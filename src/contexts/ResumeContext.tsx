import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Resume, JobDescription, TailoredResume, CustomSection, CustomSectionItem } from '@/types/resume';

const DEFAULT_SECTIONS = [
  { id: 'contact', type: 'contact' as const, title: 'Contact Information', order: 0, visible: true },
  { id: 'summary', type: 'summary' as const, title: 'Professional Summary', order: 1, visible: true },
  { id: 'experience', type: 'experience' as const, title: 'Work Experience', order: 2, visible: true },
  { id: 'education', type: 'education' as const, title: 'Education', order: 3, visible: true },
  { id: 'skills', type: 'skills' as const, title: 'Skills', order: 4, visible: true },
  { id: 'certifications', type: 'certifications' as const, title: 'Certifications', order: 5, visible: true },
];

const createEmptyResume = (): Resume => ({
  id: crypto.randomUUID(),
  name: 'My Resume',
  contact: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  certifications: [],
  customSections: [],
  sections: DEFAULT_SECTIONS,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  templateId: 'classic',
});

interface ResumeContextType {
  resume: Resume;
  resumes: Resume[];
  jobDescriptions: JobDescription[];
  tailoredResumes: TailoredResume[];
  activeJobDescription: JobDescription | null;
  updateResume: (updates: Partial<Resume>) => void;
  updateContact: (contact: Partial<Resume['contact']>) => void;
  updateSummary: (summary: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, updates: Partial<Resume['experiences'][0]>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, updates: Partial<Resume['education'][0]>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skillData?: { name: string; category: string }) => void;
  updateSkill: (id: string, updates: Partial<Resume['skills'][0]>) => void;
  removeSkill: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, updates: Partial<Resume['certifications'][0]>) => void;
  removeCertification: (id: string) => void;
  reorderSections: (sections: Resume['sections']) => void;
  saveResume: () => void;
  loadResume: (id: string) => void;
  createNewResume: () => void;
  deleteResume: (id: string) => void;
  addJobDescription: (jd: Omit<JobDescription, 'id' | 'createdAt'>) => void;
  setActiveJobDescription: (jd: JobDescription | null) => void;
  addTailoredResume: (tr: Omit<TailoredResume, 'id' | 'createdAt'>) => void;
  importResumeData: (data: ImportedResumeData) => void;
}

interface ImportedResumeData {
  contact: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: Array<{
    id?: string;
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }>;
  education: Array<{
    id?: string;
    school: string;
    degree: string;
    field: string;
    location?: string;
    graduationDate: string;
    gpa: string;
    honors?: string;
  }>;
  skills: Array<{
    id?: string;
    category: string;
    items: string[];
  }>;
  certifications: Array<{
    id?: string;
    name: string;
    issuer: string;
    date: string;
    expirationDate?: string;
    credentialId?: string;
  }>;
  customSections?: Array<{
    title: string;
    type: 'custom';
    items: Array<{
      title: string;
      subtitle: string;
      description: string;
      bullets: string[];
    }>;
  }>;
  detectedFont?: string;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const STORAGE_KEY = 'adaptive-career-portfolio';

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [resume, setResume] = useState<Resume>(createEmptyResume);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [tailoredResumes, setTailoredResumes] = useState<TailoredResume[]>([]);
  const [activeJobDescription, setActiveJobDescription] = useState<JobDescription | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.resumes?.length > 0) {
          setResumes(data.resumes);
          setResume(data.resumes[0]);
        }
        if (data.jobDescriptions) {
          setJobDescriptions(data.jobDescriptions);
        }
        if (data.tailoredResumes) {
          setTailoredResumes(data.tailoredResumes);
        }
      } catch (e) {
        console.error('Failed to load stored data:', e);
      }
    }
  }, []);

  // Save to localStorage on changes
  const saveToStorage = useCallback(() => {
    const data = { resumes, jobDescriptions, tailoredResumes };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [resumes, jobDescriptions, tailoredResumes]);

  useEffect(() => {
    saveToStorage();
  }, [saveToStorage]);

  const updateResume = (updates: Partial<Resume>) => {
    setResume(prev => {
      const updated = { ...prev, ...updates, updatedAt: new Date().toISOString() };
      setResumes(list => list.map(r => r.id === updated.id ? updated : r));
      return updated;
    });
  };

  const updateContact = (contact: Partial<Resume['contact']>) => {
    updateResume({ contact: { ...resume.contact, ...contact } });
  };

  const updateSummary = (summary: string) => {
    updateResume({ summary });
  };

  const addExperience = () => {
    const newExp = {
      id: crypto.randomUUID(),
      company: '',
      title: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: [''],
    };
    updateResume({ experiences: [...resume.experiences, newExp] });
  };

  const updateExperience = (id: string, updates: Partial<Resume['experiences'][0]>) => {
    updateResume({
      experiences: resume.experiences.map(exp => exp.id === id ? { ...exp, ...updates } : exp),
    });
  };

  const removeExperience = (id: string) => {
    updateResume({ experiences: resume.experiences.filter(exp => exp.id !== id) });
  };

  const addEducation = () => {
    const newEdu = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      location: '',
      batchStart: '',
      batchEnd: '',
    };
    updateResume({ education: [...resume.education, newEdu] });
  };

  const updateEducation = (id: string, updates: Partial<Resume['education'][0]>) => {
    updateResume({
      education: resume.education.map(edu => edu.id === id ? { ...edu, ...updates } : edu),
    });
  };

  const removeEducation = (id: string) => {
    updateResume({ education: resume.education.filter(edu => edu.id !== id) });
  };

  const addSkill = (skillData?: { name: string; category: string }) => {
    const newSkill = {
      id: crypto.randomUUID(),
      name: skillData?.name || '',
      category: skillData?.category || 'Technical',
    };
    updateResume({ skills: [...resume.skills, newSkill] });
  };

  const updateSkill = (id: string, updates: Partial<Resume['skills'][0]>) => {
    updateResume({
      skills: resume.skills.map(skill => skill.id === id ? { ...skill, ...updates } : skill),
    });
  };

  const removeSkill = (id: string) => {
    updateResume({ skills: resume.skills.filter(skill => skill.id !== id) });
  };

  const addCertification = () => {
    const newCert = {
      id: crypto.randomUUID(),
      name: '',
      issuer: '',
      date: '',
    };
    updateResume({ certifications: [...resume.certifications, newCert] });
  };

  const updateCertification = (id: string, updates: Partial<Resume['certifications'][0]>) => {
    updateResume({
      certifications: resume.certifications.map(cert => cert.id === id ? { ...cert, ...updates } : cert),
    });
  };

  const removeCertification = (id: string) => {
    updateResume({ certifications: resume.certifications.filter(cert => cert.id !== id) });
  };

  const reorderSections = (sections: Resume['sections']) => {
    updateResume({ sections });
  };

  const saveResume = () => {
    setResumes(prev => {
      const exists = prev.find(r => r.id === resume.id);
      if (exists) {
        return prev.map(r => r.id === resume.id ? resume : r);
      }
      return [...prev, resume];
    });
  };

  const loadResume = (id: string) => {
    const found = resumes.find(r => r.id === id);
    if (found) {
      setResume(found);
    }
  };

  const createNewResume = () => {
    const newResume = createEmptyResume();
    setResume(newResume);
    setResumes(prev => [...prev, newResume]);
  };

  const deleteResume = (id: string) => {
    setResumes(prev => prev.filter(r => r.id !== id));
    if (resume.id === id) {
      const remaining = resumes.filter(r => r.id !== id);
      if (remaining.length > 0) {
        setResume(remaining[0]);
      } else {
        createNewResume();
      }
    }
  };

  const addJobDescription = (jd: Omit<JobDescription, 'id' | 'createdAt'>) => {
    const newJD = { ...jd, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setJobDescriptions(prev => [...prev, newJD]);
    return newJD;
  };

  const addTailoredResume = (tr: Omit<TailoredResume, 'id' | 'createdAt'>) => {
    const newTR = { ...tr, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setTailoredResumes(prev => [...prev, newTR]);
    return newTR;
  };

  const importResumeData = (data: ImportedResumeData) => {
    // Convert imported data to resume format
    const importedExperiences = (data.experience || []).map(exp => ({
      id: exp.id || crypto.randomUUID(),
      company: exp.company || '',
      title: exp.title || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: exp.current || false,
      bullets: exp.bullets?.length > 0 ? exp.bullets : [''],
    }));

    const importedEducation = (data.education || []).map(edu => ({
      id: edu.id || crypto.randomUUID(),
      institution: edu.school || '',
      degree: edu.degree || '',
      location: edu.location || '',
      batchStart: edu.graduationDate?.split('-')[0]?.trim() || edu.graduationDate?.split('–')[0]?.trim() || '',
      batchEnd: edu.graduationDate?.split('-')[1]?.trim() || edu.graduationDate?.split('–')[1]?.trim() || edu.graduationDate || '',
      gpa: edu.gpa || '',
      honors: edu.honors || '',
    }));

    // Flatten skills from categories
    const importedSkills = (data.skills || []).flatMap(skillGroup => 
      (skillGroup.items || []).map(item => ({
        id: crypto.randomUUID(),
        name: item,
        category: skillGroup.category || 'Technical',
      }))
    );

    const importedCertifications = (data.certifications || []).map(cert => ({
      id: cert.id || crypto.randomUUID(),
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      expirationDate: cert.expirationDate || '',
      credentialId: cert.credentialId || '',
    }));

    // Handle custom sections
    const importedCustomSections: CustomSection[] = (data.customSections || []).map((section, index) => ({
      id: crypto.randomUUID(),
      title: section.title,
      type: 'custom' as const,
      items: (section.items || []).map(item => ({
        id: crypto.randomUUID(),
        title: item.title || '',
        subtitle: item.subtitle || '',
        description: item.description || '',
        bullets: item.bullets || [],
      })),
      order: 6 + index,
      visible: true,
    }));

    // Update sections to include custom sections
    const updatedSections = [
      ...DEFAULT_SECTIONS,
      ...importedCustomSections.map((cs, index) => ({
        id: cs.id,
        type: 'custom' as const,
        title: cs.title,
        order: 6 + index,
        visible: true,
      })),
    ];

    updateResume({
      contact: {
        fullName: data.contact?.fullName || '',
        email: data.contact?.email || '',
        phone: data.contact?.phone || '',
        location: data.contact?.location || '',
        linkedin: data.contact?.linkedin || '',
        website: data.contact?.website || '',
      },
      summary: data.summary || '',
      experiences: importedExperiences.length > 0 ? importedExperiences : resume.experiences,
      education: importedEducation.length > 0 ? importedEducation : resume.education,
      skills: importedSkills.length > 0 ? importedSkills : resume.skills,
      certifications: importedCertifications.length > 0 ? importedCertifications : resume.certifications,
      customSections: importedCustomSections,
      sections: updatedSections,
    });
  };

  return (
    <ResumeContext.Provider
      value={{
        resume,
        resumes,
        jobDescriptions,
        tailoredResumes,
        activeJobDescription,
        updateResume,
        updateContact,
        updateSummary,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        addSkill,
        updateSkill,
        removeSkill,
        addCertification,
        updateCertification,
        removeCertification,
        reorderSections,
        saveResume,
        loadResume,
        createNewResume,
        deleteResume,
        addJobDescription,
        setActiveJobDescription,
        addTailoredResume,
        importResumeData,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
