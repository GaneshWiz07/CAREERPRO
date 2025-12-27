import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Resume } from '@/types/resume';

// Helper to strip HTML tags
const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

// Check if content is empty
const isEmptyContent = (content: string): boolean => {
  if (!content) return true;
  return !stripHtml(content);
};

export async function exportToPDF(resume: Resume, filename?: string): Promise<void> {
  // Try to capture the preview element first
  const previewElement = document.getElementById('resume-preview');
  
  if (previewElement) {
    // Clone the element to avoid modifying the original
    const clone = previewElement.cloneNode(true) as HTMLElement;
    clone.style.width = '210mm';
    clone.style.padding = '15mm';
    clone.style.backgroundColor = 'white';
    clone.style.color = 'black';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    
    // Ensure all text is black for PDF
    clone.querySelectorAll('*').forEach((el) => {
      const element = el as HTMLElement;
      element.style.color = 'black';
    });
    
    document.body.appendChild(clone);
    
    try {
      const canvas = await html2canvas(clone, {
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
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const exportFilename = filename || resume.contact.fullName || 'resume';
      pdf.save(`${exportFilename}.pdf`);
    } finally {
      document.body.removeChild(clone);
    }
    return;
  }
  
  // Fallback to programmatic generation if preview element not found
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
    const cleanText = stripHtml(text);
    if (!cleanText) return;
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.setTextColor(color);
    const lines = pdf.splitTextToSize(cleanText, contentWidth);
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

  // Contact Header - centered
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  if (resume.contact.fullName) {
    const nameWidth = pdf.getTextWidth(resume.contact.fullName);
    pdf.text(resume.contact.fullName, (pageWidth - nameWidth) / 2, y);
    y += 8;
  }
  
  const contactParts = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location
  ].filter(Boolean);
  
  if (contactParts.length > 0) {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor('#666666');
    const contactText = contactParts.join(' • ');
    const contactWidth = pdf.getTextWidth(contactText);
    pdf.text(contactText, (pageWidth - contactWidth) / 2, y);
    y += 5;
  }
  
  const linkParts = [resume.contact.linkedin, resume.contact.website].filter(Boolean);
  if (linkParts.length > 0) {
    pdf.setFontSize(9);
    const linkText = linkParts.join(' • ');
    const linkWidth = pdf.getTextWidth(linkText);
    pdf.text(linkText, (pageWidth - linkWidth) / 2, y);
    y += 5;
  }
  
  addLine();
  y += 2;

  // Summary
  if (!isEmptyContent(resume.summary)) {
    checkPageBreak(20);
    addText('PROFESSIONAL SUMMARY', 10, true);
    addLine();
    addText(resume.summary, 9);
    y += 4;
  }

  // Experience
  if (resume.experiences.length > 0) {
    checkPageBreak(20);
    addText('WORK EXPERIENCE', 10, true);
    addLine();
    
    resume.experiences.forEach((exp, index) => {
      checkPageBreak(30);
      
      // Title and company on left, dates on right
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor('#000000');
      const titleText = exp.title || 'Position';
      pdf.text(titleText, margin, y);
      
      const dateText = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
      const dateWidth = pdf.getTextWidth(dateText);
      pdf.text(dateText, pageWidth - margin - dateWidth, y);
      y += 4;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor('#666666');
      pdf.setFontSize(9);
      const companyText = `${exp.company}${exp.location ? `, ${exp.location}` : ''}`;
      pdf.text(companyText, margin, y);
      y += 5;
      
      pdf.setTextColor('#000000');
      exp.bullets.filter(b => !isEmptyContent(b)).forEach(bullet => {
        checkPageBreak(10);
        const bulletText = `• ${stripHtml(bullet)}`;
        const bulletLines = pdf.splitTextToSize(bulletText, contentWidth);
        pdf.text(bulletLines, margin, y);
        y += bulletLines.length * 3.5 + 1;
      });
      
      if (index < resume.experiences.length - 1) y += 3;
    });
    y += 4;
  }

  // Education
  if (resume.education.length > 0) {
    checkPageBreak(20);
    addText('EDUCATION', 10, true);
    addLine();
    
    resume.education.forEach((edu, index) => {
      checkPageBreak(20);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor('#000000');
      pdf.text(edu.degree || 'Degree', margin, y);
      
      const batch = edu.batchStart && edu.batchEnd ? `${edu.batchStart} - ${edu.batchEnd}` : edu.batchStart || edu.batchEnd || '';
      if (batch) {
        const batchWidth = pdf.getTextWidth(batch);
        pdf.text(batch, pageWidth - margin - batchWidth, y);
      }
      y += 4;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor('#666666');
      const schoolText = `${edu.institution}${edu.location ? `, ${edu.location}` : ''}`;
      pdf.text(schoolText, margin, y);
      y += 4;
      
      if (edu.gpa || !isEmptyContent(edu.honors || '')) {
        const extras = [];
        if (edu.gpa) extras.push(`GPA: ${edu.gpa}`);
        if (!isEmptyContent(edu.honors || '')) extras.push(stripHtml(edu.honors || ''));
        pdf.text(extras.join(' | '), margin, y);
        y += 4;
      }
      
      if (index < resume.education.length - 1) y += 2;
    });
    y += 4;
  }

  // Skills - grouped by category
  if (resume.skills.length > 0) {
    checkPageBreak(20);
    addText('SKILLS', 10, true);
    addLine();
    
    const skillsByCategory = resume.skills.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill.name);
      return acc;
    }, {} as Record<string, string[]>);
    
    Object.entries(skillsByCategory).forEach(([category, items]) => {
      checkPageBreak(10);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor('#000000');
      const categoryText = `${category}: `;
      pdf.text(categoryText, margin, y);
      const categoryWidth = pdf.getTextWidth(categoryText);
      pdf.setFont('helvetica', 'normal');
      const skillsText = items.filter(Boolean).join(', ');
      const skillLines = pdf.splitTextToSize(skillsText, contentWidth - categoryWidth);
      pdf.text(skillLines[0], margin + categoryWidth, y);
      if (skillLines.length > 1) {
        y += 4;
        for (let i = 1; i < skillLines.length; i++) {
          pdf.text(skillLines[i], margin, y);
          y += 4;
        }
      } else {
        y += 4;
      }
    });
    y += 4;
  }

  // Certifications
  if (resume.certifications.length > 0) {
    checkPageBreak(20);
    addText('CERTIFICATIONS', 10, true);
    addLine();
    
    resume.certifications.forEach(cert => {
      checkPageBreak(10);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor('#000000');
      pdf.text(cert.name || 'Certification', margin, y);
      
      const dateText = `${cert.issuer} • ${cert.date}`;
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor('#666666');
      const dateWidth = pdf.getTextWidth(dateText);
      pdf.text(dateText, pageWidth - margin - dateWidth, y);
      y += 5;
    });
  }

  // Custom Sections
  if (resume.customSections && resume.customSections.length > 0) {
    resume.customSections.forEach(section => {
      checkPageBreak(20);
      addText(section.title.toUpperCase(), 10, true);
      addLine();
      
      section.items.forEach((item, index) => {
        checkPageBreak(20);
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor('#000000');
        
        let titleLine = item.title || 'Item';
        if (section.showTechnologies && item.technologies) {
          pdf.text(titleLine, margin, y);
          const titleWidth = pdf.getTextWidth(titleLine + '  ');
          pdf.setFont('helvetica', 'italic');
          pdf.setTextColor('#666666');
          pdf.text(item.technologies, margin + titleWidth, y);
        } else {
          pdf.text(titleLine, margin, y);
        }
        
        if (item.date) {
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor('#000000');
          const dateWidth = pdf.getTextWidth(item.date);
          pdf.text(item.date, pageWidth - margin - dateWidth, y);
        }
        y += 5;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor('#000000');
        item.bullets.filter(b => !isEmptyContent(b)).forEach(bullet => {
          checkPageBreak(10);
          const bulletText = `• ${stripHtml(bullet)}`;
          const bulletLines = pdf.splitTextToSize(bulletText, contentWidth);
          pdf.text(bulletLines, margin, y);
          y += bulletLines.length * 3.5 + 1;
        });
        
        if (index < section.items.length - 1) y += 2;
      });
      y += 4;
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
  if (!isEmptyContent(resume.summary)) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('-'.repeat(40));
    lines.push(stripHtml(resume.summary));
    lines.push('');
  }

  // Experience
  if (resume.experiences.length > 0) {
    lines.push('WORK EXPERIENCE');
    lines.push('-'.repeat(40));
    resume.experiences.forEach(exp => {
      lines.push(`${exp.title} | ${exp.company}`);
      lines.push(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}${exp.location ? ` | ${exp.location}` : ''}`);
      exp.bullets.filter(b => !isEmptyContent(b)).forEach(bullet => {
        lines.push(`  • ${stripHtml(bullet)}`);
      });
      lines.push('');
    });
  }

  // Education
  if (resume.education.length > 0) {
    lines.push('EDUCATION');
    lines.push('-'.repeat(40));
    resume.education.forEach(edu => {
      lines.push(edu.degree);
      const batch = edu.batchStart && edu.batchEnd ? `${edu.batchStart} - ${edu.batchEnd}` : edu.batchStart || edu.batchEnd || '';
      lines.push(`${edu.institution}${edu.location ? `, ${edu.location}` : ''}${batch ? ` | ${batch}` : ''}`);
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
      if (!isEmptyContent(edu.honors || '')) lines.push(stripHtml(edu.honors || ''));
      lines.push('');
    });
  }

  // Skills - grouped by category
  if (resume.skills.length > 0) {
    lines.push('SKILLS');
    lines.push('-'.repeat(40));
    const skillsByCategory = resume.skills.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill.name);
      return acc;
    }, {} as Record<string, string[]>);
    
    Object.entries(skillsByCategory).forEach(([category, items]) => {
      lines.push(`${category}: ${items.filter(Boolean).join(', ')}`);
    });
    lines.push('');
  }

  // Certifications
  if (resume.certifications.length > 0) {
    lines.push('CERTIFICATIONS');
    lines.push('-'.repeat(40));
    resume.certifications.forEach(cert => {
      lines.push(`${cert.name} - ${cert.issuer} (${cert.date})`);
    });
    lines.push('');
  }

  // Custom Sections
  if (resume.customSections && resume.customSections.length > 0) {
    resume.customSections.forEach(section => {
      lines.push(section.title.toUpperCase());
      lines.push('-'.repeat(40));
      section.items.forEach(item => {
        let titleLine = item.title;
        if (section.showTechnologies && item.technologies) {
          titleLine += ` (${item.technologies})`;
        }
        if (item.date) titleLine += ` | ${item.date}`;
        lines.push(titleLine);
        item.bullets.filter(b => !isEmptyContent(b)).forEach(bullet => {
          lines.push(`  • ${stripHtml(bullet)}`);
        });
        lines.push('');
      });
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
