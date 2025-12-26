import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
    field: string;
    graduationDate: string;
    gpa: string;
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
  }>;
  detectedFont?: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function extractContactInfo(text: string): ParsedResume['contact'] {
  const lines = text.split('\n').filter(line => line.trim());
  
  // Extract email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const email = emailMatch ? emailMatch[0] : '';
  
  // Extract phone
  const phoneMatch = text.match(/(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';
  
  // Extract LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  const linkedin = linkedinMatch ? `https://${linkedinMatch[0]}` : '';
  
  // Extract website
  const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?(?!linkedin)[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?/i);
  const website = websiteMatch && !websiteMatch[0].includes('linkedin') ? websiteMatch[0] : '';
  
  // First line is usually the name
  const fullName = lines[0] || '';
  
  // Try to find location (City, State pattern)
  const locationMatch = text.match(/([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}(?:\s*\d{5})?)/);
  const location = locationMatch ? locationMatch[1] : '';
  
  return { fullName, email, phone, location, linkedin, website };
}

function extractSummary(text: string): string {
  const summaryPatterns = [
    /(?:summary|profile|objective|about\s*me)[\s:]*\n([\s\S]*?)(?=\n(?:experience|education|skills|work|employment|professional|technical|projects|certifications)|\n\n\n)/i,
    /(?:professional\s+summary|career\s+summary|executive\s+summary)[\s:]*\n([\s\S]*?)(?=\n(?:experience|education|skills|work))/i,
  ];
  
  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/\n+/g, ' ').substring(0, 500);
    }
  }
  
  return '';
}

function extractExperience(text: string): ParsedResume['experience'] {
  const experiences: ParsedResume['experience'] = [];
  
  // Find experience section
  const expSectionMatch = text.match(/(?:experience|work\s*history|employment|professional\s*experience)[\s:]*\n([\s\S]*?)(?=\n(?:education|skills|certifications|projects|awards|references)|\n*$)/i);
  
  if (!expSectionMatch) return experiences;
  
  const expSection = expSectionMatch[1];
  
  // Split by company/job entries (look for date patterns)
  const datePattern = /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*\d{4}\s*[-–—to]+\s*(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?\s*\d{4}|Present|Current)/gi;
  
  const entries = expSection.split(/\n(?=[A-Z][^a-z\n]*\n)/);
  
  for (const entry of entries) {
    if (entry.trim().length < 20) continue;
    
    const lines = entry.split('\n').filter(l => l.trim());
    if (lines.length < 2) continue;
    
    const dateMatch = entry.match(datePattern);
    const dates = dateMatch ? dateMatch[0] : '';
    
    // Parse dates
    const dateParts = dates.split(/[-–—to]+/i);
    const startDate = dateParts[0]?.trim() || '';
    const endDateRaw = dateParts[1]?.trim() || '';
    const current = /present|current/i.test(endDateRaw);
    const endDate = current ? '' : endDateRaw;
    
    // First line is usually title or company
    const title = lines[0]?.replace(datePattern, '').trim() || '';
    const company = lines[1]?.replace(datePattern, '').trim() || '';
    
    // Extract bullets
    const bullets = lines.slice(2)
      .filter(l => l.match(/^[\s]*[•\-\*\u2022\u2023\u25E6\u2043\u2219]/) || l.match(/^\d+\./))
      .map(l => l.replace(/^[\s]*[•\-\*\u2022\u2023\u25E6\u2043\u2219\d+\.]\s*/, '').trim())
      .filter(b => b.length > 10);
    
    if (title || company) {
      experiences.push({
        id: generateId(),
        company: company || title,
        title: company ? title : '',
        location: '',
        startDate,
        endDate,
        current,
        bullets: bullets.length > 0 ? bullets : ['']
      });
    }
  }
  
  return experiences.length > 0 ? experiences : [{
    id: generateId(),
    company: '',
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    bullets: ['']
  }];
}

function extractEducation(text: string): ParsedResume['education'] {
  const education: ParsedResume['education'] = [];
  
  const eduSectionMatch = text.match(/(?:education|academic|qualifications)[\s:]*\n([\s\S]*?)(?=\n(?:experience|skills|certifications|projects|work|awards|references)|\n*$)/i);
  
  if (!eduSectionMatch) return education;
  
  const eduSection = eduSectionMatch[1];
  const entries = eduSection.split(/\n(?=[A-Z])/);
  
  for (const entry of entries) {
    if (entry.trim().length < 10) continue;
    
    const lines = entry.split('\n').filter(l => l.trim());
    
    // Look for degree patterns
    const degreeMatch = entry.match(/(?:Bachelor|Master|PhD|Ph\.D|B\.S\.|B\.A\.|M\.S\.|M\.A\.|MBA|Associate|Diploma)[^,\n]*/i);
    const degree = degreeMatch ? degreeMatch[0].trim() : '';
    
    // Look for graduation year
    const yearMatch = entry.match(/(?:20|19)\d{2}/);
    const graduationDate = yearMatch ? yearMatch[0] : '';
    
    // Look for GPA
    const gpaMatch = entry.match(/(?:GPA|Grade)[:\s]*(\d+\.?\d*)/i);
    const gpa = gpaMatch ? gpaMatch[1] : '';
    
    const school = lines[0]?.replace(/(?:20|19)\d{2}/, '').trim() || '';
    
    if (school || degree) {
      education.push({
        id: generateId(),
        school,
        degree,
        field: '',
        graduationDate,
        gpa
      });
    }
  }
  
  return education.length > 0 ? education : [{
    id: generateId(),
    school: '',
    degree: '',
    field: '',
    graduationDate: '',
    gpa: ''
  }];
}

function extractSkills(text: string): ParsedResume['skills'] {
  const skills: ParsedResume['skills'] = [];
  
  const skillsSectionMatch = text.match(/(?:skills|technical\s*skills|core\s*competencies|expertise|technologies)[\s:]*\n([\s\S]*?)(?=\n(?:experience|education|certifications|projects|work|awards|references)|\n*$)/i);
  
  if (!skillsSectionMatch) {
    return [{ id: generateId(), category: 'Skills', items: [] }];
  }
  
  const skillsSection = skillsSectionMatch[1];
  const lines = skillsSection.split('\n').filter(l => l.trim());
  
  const allSkills: string[] = [];
  
  for (const line of lines) {
    // Split by common separators
    const items = line.split(/[,;|•\u2022\u2023]/)
      .map(s => s.trim())
      .filter(s => s.length > 1 && s.length < 50);
    allSkills.push(...items);
  }
  
  // Group skills by detecting categories
  const technicalKeywords = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker', 'git', 'html', 'css', 'typescript', 'angular', 'vue'];
  const softKeywords = ['leadership', 'communication', 'teamwork', 'problem', 'analytical', 'creative', 'management'];
  
  const technical: string[] = [];
  const soft: string[] = [];
  const other: string[] = [];
  
  for (const skill of allSkills) {
    const lower = skill.toLowerCase();
    if (technicalKeywords.some(k => lower.includes(k))) {
      technical.push(skill);
    } else if (softKeywords.some(k => lower.includes(k))) {
      soft.push(skill);
    } else {
      other.push(skill);
    }
  }
  
  if (technical.length > 0) {
    skills.push({ id: generateId(), category: 'Technical Skills', items: technical });
  }
  if (soft.length > 0) {
    skills.push({ id: generateId(), category: 'Soft Skills', items: soft });
  }
  if (other.length > 0) {
    skills.push({ id: generateId(), category: 'Other Skills', items: other });
  }
  
  return skills.length > 0 ? skills : [{ id: generateId(), category: 'Skills', items: [] }];
}

function extractCertifications(text: string): ParsedResume['certifications'] {
  const certifications: ParsedResume['certifications'] = [];
  
  const certSectionMatch = text.match(/(?:certifications?|licenses?|credentials?)[\s:]*\n([\s\S]*?)(?=\n(?:experience|education|skills|projects|work|awards|references)|\n*$)/i);
  
  if (!certSectionMatch) return certifications;
  
  const certSection = certSectionMatch[1];
  const lines = certSection.split('\n').filter(l => l.trim());
  
  for (const line of lines) {
    if (line.trim().length < 5) continue;
    
    const yearMatch = line.match(/(?:20|19)\d{2}/);
    const date = yearMatch ? yearMatch[0] : '';
    
    const name = line.replace(/(?:20|19)\d{2}/g, '').replace(/[-–—|]/g, ' ').trim();
    
    if (name) {
      certifications.push({
        id: generateId(),
        name,
        issuer: '',
        date,
        expirationDate: ''
      });
    }
  }
  
  return certifications;
}

export async function parsePDF(file: File): Promise<ParsedResume> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  let detectedFont = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Try to detect font from first page
    if (i === 1 && textContent.items.length > 0) {
      const firstItem = textContent.items[0] as any;
      if (firstItem.fontName) {
        detectedFont = firstItem.fontName.replace(/^[A-Z]{6}\+/, '');
      }
    }
    
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return parseResumeText(fullText, detectedFont);
}

export async function parseWord(file: File): Promise<ParsedResume> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return parseResumeText(result.value);
}

function parseResumeText(text: string, detectedFont?: string): ParsedResume {
  return {
    contact: extractContactInfo(text),
    summary: extractSummary(text),
    experience: extractExperience(text),
    education: extractEducation(text),
    skills: extractSkills(text),
    certifications: extractCertifications(text),
    detectedFont
  };
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
