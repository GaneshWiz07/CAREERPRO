import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Resume } from '@/types/resume';

export async function exportToPDF(resume: Resume, filename?: string): Promise<void> {
  const element = document.getElementById('resume-preview');
  if (!element) {
    throw new Error('Resume preview element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  const imgY = 0;

  pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
  const exportFilename = filename || resume.contact.fullName || 'resume';
  pdf.save(`${exportFilename}.pdf`);
}

export function exportToText(resume: Resume): string {
  const lines: string[] = [];
  
  // Header
  lines.push(resume.contact.fullName || 'Your Name');
  const contactLine = [resume.contact.email, resume.contact.phone, resume.contact.location].filter(Boolean).join(' | ');
  if (contactLine) lines.push(contactLine);
  if (resume.contact.linkedin) lines.push(resume.contact.linkedin);
  if (resume.contact.website) lines.push(resume.contact.website);
  lines.push('');

  // Summary
  if (resume.summary) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('-'.repeat(40));
    lines.push(resume.summary);
    lines.push('');
  }

  // Experience
  if (resume.experiences.length > 0) {
    lines.push('WORK EXPERIENCE');
    lines.push('-'.repeat(40));
    resume.experiences.forEach(exp => {
      lines.push(`${exp.title} | ${exp.company}`);
      lines.push(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}${exp.location ? ` | ${exp.location}` : ''}`);
      exp.bullets.filter(b => b.trim()).forEach(bullet => {
        lines.push(`  • ${bullet}`);
      });
      lines.push('');
    });
  }

  // Education
  if (resume.education.length > 0) {
    lines.push('EDUCATION');
    lines.push('-'.repeat(40));
    resume.education.forEach(edu => {
      lines.push(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`);
      lines.push(`${edu.institution}${edu.location ? `, ${edu.location}` : ''} | ${edu.graduationDate}`);
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
      if (edu.honors) lines.push(edu.honors);
      lines.push('');
    });
  }

  // Skills
  if (resume.skills.length > 0) {
    lines.push('SKILLS');
    lines.push('-'.repeat(40));
    lines.push(resume.skills.map(s => s.name).filter(Boolean).join(', '));
    lines.push('');
  }

  // Certifications
  if (resume.certifications.length > 0) {
    lines.push('CERTIFICATIONS');
    lines.push('-'.repeat(40));
    resume.certifications.forEach(cert => {
      lines.push(`${cert.name} - ${cert.issuer} (${cert.date})`);
    });
  }

  return lines.join('\n');
}

export function downloadAsWord(resume: Resume, filename?: string): void {
  const content = exportToText(resume);
  const blob = new Blob([content], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const exportFilename = filename || resume.contact.fullName || 'resume';
  a.download = `${exportFilename}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
