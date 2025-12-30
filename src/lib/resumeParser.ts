import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

import { invokeNetlifyFunction } from '@/lib/api';

// Use the bundled worker from pdfjs-dist
// @ts-ignore - worker import
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface ParsedResume {
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
    id: string;
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    location?: string;
    batchStart: string;
    batchEnd: string;
    gpa: string;
    honors?: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expirationDate: string;
    credentialId?: string;
  }>;
  customSections?: Array<{
    title: string;
    type: 'custom';
    items: Array<{
      title: string;
      technologies: string;
      date: string;
      bullets: string[];
    }>;
  }>;
  detectedFont?: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

async function parseWithGroq(text: string): Promise<ParsedResume> {
  console.log('Sending resume text to Groq for parsing...');
  
  const { data, error } = await invokeNetlifyFunction('parse-resume', {
    resumeText: text
  });

  if (error) {
    console.error('Groq parsing error:', error);
    throw new Error(`AI parsing failed: ${error.message}`);
  }

  console.log('Groq parsed result:', data);

  // Add IDs to all items
  const result: ParsedResume = {
    contact: {
      fullName: data.contact?.fullName || '',
      email: data.contact?.email || '',
      phone: data.contact?.phone || '',
      location: data.contact?.location || '',
      linkedin: data.contact?.linkedin || '',
      website: data.contact?.website || '',
    },
    summary: data.summary || '',
    experience: (data.experience || []).map((exp: any) => ({
      id: generateId(),
      company: exp.company || '',
      title: exp.title || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: exp.current || exp.endDate?.toLowerCase() === 'present' || false,
      bullets: exp.bullets || [''],
    })),
    education: (data.education || []).map((edu: any) => ({
      id: generateId(),
      school: edu.school || '',
      degree: edu.degree || '',
      location: edu.location || '',
      batchStart: edu.batchStart || '',
      batchEnd: edu.batchEnd || '',
      gpa: edu.gpa || '',
      honors: edu.honors || '',
    })),
    skills: (data.skills || []).map((skill: any) => ({
      id: generateId(),
      category: skill.category || 'Technical',
      items: skill.items || [],
    })),
    certifications: (data.certifications || []).map((cert: any) => ({
      id: generateId(),
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      expirationDate: cert.expirationDate || '',
      credentialId: cert.credentialId || '',
    })),
    customSections: (data.customSections || []).map((section: any) => ({
      title: section.title || '',
      type: 'custom' as const,
      items: (section.items || []).map((item: any) => ({
        title: item.title || '',
        technologies: item.technologies || '',
        date: item.date || '',
        bullets: item.bullets || [],
      })),
    })),
  };

  return result;
}

async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  
  console.log('Loading PDF document...');
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  
  const pdf = await loadingTask.promise;
  console.log('PDF loaded, pages:', pdf.numPages);
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Better text extraction - preserve structure
    const pageText = textContent.items
      .map((item: any) => {
        if (item.hasEOL) {
          return item.str + '\n';
        }
        return item.str + ' ';
      })
      .join('');
    fullText += pageText + '\n';
  }
  
  console.log('Extracted PDF text (first 500 chars):', fullText.substring(0, 500));
  
  if (!fullText.trim()) {
    throw new Error('No text could be extracted from this PDF. It may be scanned or image-based.');
  }
  
  return fullText;
}

async function extractTextFromWord(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export async function parsePDF(file: File): Promise<ParsedResume> {
  try {
    const text = await extractTextFromPDF(file);
    return await parseWithGroq(text);
  } catch (error: any) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to parse PDF: ${error.message || 'Unknown error'}`);
  }
}

export async function parseWord(file: File): Promise<ParsedResume> {
  try {
    const text = await extractTextFromWord(file);
    return await parseWithGroq(text);
  } catch (error: any) {
    console.error('Word parsing error:', error);
    throw new Error(`Failed to parse Word document: ${error.message || 'Unknown error'}`);
  }
}

export async function parseResume(file: File): Promise<ParsedResume> {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.pdf')) {
    return parsePDF(file);
  } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    return parseWord(file);
  }
  
  throw new Error('Unsupported file format. Please upload a PDF or Word document.');
}
