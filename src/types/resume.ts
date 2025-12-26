export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expirationDate?: string;
  credentialId?: string;
}

export interface ResumeSection {
  id: string;
  type: 'contact' | 'summary' | 'experience' | 'education' | 'skills' | 'certifications';
  title: string;
  order: number;
  visible: boolean;
}

export interface Resume {
  id: string;
  name: string;
  contact: ContactInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  sections: ResumeSection[];
  createdAt: string;
  updatedAt: string;
  templateId: string;
}

export interface ATSTemplate {
  id: string;
  name: string;
  description: string;
  font: 'Arial' | 'Calibri' | 'Georgia' | 'Times New Roman';
  layout: 'single-column';
  preview: string;
}

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  rawText: string;
  extractedKeywords: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experienceLevel: string;
  createdAt: string;
}

export interface TailoredResume {
  id: string;
  baseResumeId: string;
  jobDescriptionId: string;
  tailoredSummary: string;
  tailoredExperiences: Experience[];
  matchScore: number;
  keywordMatches: string[];
  missingKeywords: string[];
  createdAt: string;
}

export interface ATSValidation {
  isValid: boolean;
  score: number;
  issues: ATSIssue[];
}

export interface ATSIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  section?: string;
  suggestion?: string;
}
