import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Resume } from '@/types/resume';

export async function exportToPDF(resume: Resume, filename?: string): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper to add text with word wrap
  const addText = (text: string, fontSize: number, isBold = false, color = '#000000') => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.setTextColor(color);
    const lines = pdf.splitTextToSize(text, contentWidth);
    pdf.text(lines, margin, y);
    y += lines.length * (fontSize * 0.4) + 2;
  };

  const addLine = () => {
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 4;
  };

  const checkPageBreak = (neededSpace: number) => {
    if (y + neededSpace > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage();
      y = margin;
    }
  };

  // Contact Header
  if (resume.contact.fullName) {
    addText(resume.contact.fullName, 18, true);
  }
  
  const contactParts = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location
  ].filter(Boolean);
  
  if (contactParts.length > 0) {
    addText(contactParts.join(' | '), 10, false, '#555555');
  }
  
  const linkParts = [resume.contact.linkedin, resume.contact.website].filter(Boolean);
  if (linkParts.length > 0) {
    addText(linkParts.join(' | '), 9, false, '#0066cc');
  }
  
  y += 4;

  // Summary
  if (resume.summary) {
    checkPageBreak(20);
    addText('PROFESSIONAL SUMMARY', 12, true);
    addLine();
    addText(resume.summary, 10);
    y += 4;
  }

  // Experience
  if (resume.experiences.length > 0) {
    checkPageBreak(20);
    addText('WORK EXPERIENCE', 12, true);
    addLine();
    
    resume.experiences.forEach((exp, index) => {
      checkPageBreak(30);
      if (exp.title || exp.company) {
        addText(`${exp.title}${exp.title && exp.company ? ' | ' : ''}${exp.company}`, 11, true);
      }
      
      const dateLocation = [
        exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}` : '',
        exp.location
      ].filter(Boolean).join(' | ');
      
      if (dateLocation) {
        addText(dateLocation, 9, false, '#666666');
      }
      
      exp.bullets.filter(b => b.trim()).forEach(bullet => {
        checkPageBreak(10);
        addText(`• ${bullet}`, 10);
      });
      
      if (index < resume.experiences.length - 1) y += 4;
    });
    y += 4;
  }

  // Education
  if (resume.education.length > 0) {
    checkPageBreak(20);
    addText('EDUCATION', 12, true);
    addLine();
    
    resume.education.forEach((edu, index) => {
      checkPageBreak(20);
      const degreeLine = `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`;
      if (degreeLine.trim()) addText(degreeLine, 11, true);
      
      const schoolLine = `${edu.institution}${edu.location ? `, ${edu.location}` : ''}${edu.graduationDate ? ` | ${edu.graduationDate}` : ''}`;
      if (schoolLine.trim()) addText(schoolLine, 10);
      
      if (edu.gpa) addText(`GPA: ${edu.gpa}`, 9, false, '#666666');
      if (edu.honors) addText(edu.honors, 9);
      
      if (index < resume.education.length - 1) y += 2;
    });
    y += 4;
  }

  // Skills
  if (resume.skills.length > 0) {
    checkPageBreak(20);
    addText('SKILLS', 12, true);
    addLine();
    
    const skillNames = resume.skills.map(s => s.name).filter(Boolean);
    if (skillNames.length > 0) {
      addText(skillNames.join(', '), 10);
    }
    y += 4;
  }

  // Certifications
  if (resume.certifications.length > 0) {
    checkPageBreak(20);
    addText('CERTIFICATIONS', 12, true);
    addLine();
    
    resume.certifications.forEach(cert => {
      checkPageBreak(10);
      const certLine = [cert.name, cert.issuer, cert.date].filter(Boolean).join(' - ');
      if (certLine) addText(certLine, 10);
    });
  }

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
