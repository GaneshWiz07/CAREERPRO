import jsPDF from 'jspdf';
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
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
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

  const addSectionHeader = (title: string) => {
    checkPageBreak(12);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor('#000000');
    pdf.text(title.toUpperCase(), margin, y);
    y += 4;
    pdf.setDrawColor(180, 180, 180);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 4;
  };

  const checkPageBreak = (neededSpace: number) => {
    if (y + neededSpace > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
  };

  // Get ordered sections based on resume.sections
  const allSections = [
    ...resume.sections.filter(s => s.type !== 'custom'),
    ...(resume.customSections || []).map(cs => ({
      id: cs.id,
      type: 'custom' as const,
      title: cs.title,
      order: cs.order,
      visible: cs.visible,
    })),
  ].sort((a, b) => a.order - b.order);

  // Render each section in order
  for (const section of allSections) {
    if (!section.visible) continue;

    switch (section.type) {
      case 'contact': {
        // Contact Header - centered
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor('#000000');
        if (resume.contact.fullName) {
          const nameWidth = pdf.getTextWidth(resume.contact.fullName);
          pdf.text(resume.contact.fullName, (pageWidth - nameWidth) / 2, y);
          y += 7;
        }
        
        const contactParts = [
          resume.contact.email,
          resume.contact.phone,
          resume.contact.location
        ].filter(Boolean);
        
        if (contactParts.length > 0) {
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor('#555555');
          const contactText = contactParts.join('  •  ');
          const contactWidth = pdf.getTextWidth(contactText);
          pdf.text(contactText, (pageWidth - contactWidth) / 2, y);
          y += 4;
        }
        
        const linkParts = [resume.contact.linkedin, resume.contact.website].filter(Boolean);
        if (linkParts.length > 0) {
          pdf.setFontSize(9);
          const linkText = linkParts.join('  •  ');
          const linkWidth = pdf.getTextWidth(linkText);
          pdf.text(linkText, (pageWidth - linkWidth) / 2, y);
          y += 4;
        }
        
        pdf.setDrawColor(180, 180, 180);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 5;
        break;
      }

      case 'summary': {
        if (!isEmptyContent(resume.summary)) {
          addSectionHeader('Professional Summary');
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor('#000000');
          const summaryText = stripHtml(resume.summary);
          const summaryLines = pdf.splitTextToSize(summaryText, contentWidth);
          for (const line of summaryLines) {
            checkPageBreak(4);
            pdf.text(line, margin, y);
            y += 3.5;
          }
          y += 4;
        }
        break;
      }

      case 'experience': {
        if (resume.experiences.length > 0) {
          addSectionHeader('Work Experience');
          
          resume.experiences.forEach((exp, index) => {
            checkPageBreak(15);
            
            // Title and dates on same line
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor('#000000');
            const titleText = exp.title || 'Position';
            pdf.text(titleText, margin, y);
            
            const dateText = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
            pdf.setFont('helvetica', 'bold');
            const dateWidth = pdf.getTextWidth(dateText);
            pdf.text(dateText, pageWidth - margin - dateWidth, y);
            y += 4;
            
            // Company and location
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor('#555555');
            const companyText = `${exp.company}${exp.location ? `, ${exp.location}` : ''}`;
            pdf.text(companyText, margin, y);
            y += 4;
            
            // Bullets
            pdf.setTextColor('#000000');
            exp.bullets.filter(b => !isEmptyContent(b)).forEach(bullet => {
              const bulletText = `• ${stripHtml(bullet)}`;
              const bulletLines = pdf.splitTextToSize(bulletText, contentWidth - 2);
              for (let i = 0; i < bulletLines.length; i++) {
                checkPageBreak(4);
                pdf.text(bulletLines[i], margin + (i > 0 ? 3 : 0), y);
                y += 3.5;
              }
            });
            
            if (index < resume.experiences.length - 1) y += 2;
          });
          y += 3;
        }
        break;
      }

      case 'education': {
        if (resume.education.length > 0) {
          addSectionHeader('Education');
          
          resume.education.forEach((edu, index) => {
            checkPageBreak(12);
            
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor('#000000');
            pdf.text(edu.degree || 'Degree', margin, y);
            
            const batch = edu.batchStart && edu.batchEnd ? `${edu.batchStart} - ${edu.batchEnd}` : edu.batchStart || edu.batchEnd || '';
            if (batch) {
              pdf.setFont('helvetica', 'bold');
              const batchWidth = pdf.getTextWidth(batch);
              pdf.text(batch, pageWidth - margin - batchWidth, y);
            }
            y += 4;
            
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor('#555555');
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
            
            if (index < resume.education.length - 1) y += 1;
          });
          y += 3;
        }
        break;
      }

      case 'skills': {
        if (resume.skills.length > 0) {
          addSectionHeader('Skills');
          
          const skillsByCategory = resume.skills.reduce((acc, skill) => {
            const category = skill.category || 'Other';
            if (!acc[category]) acc[category] = [];
            acc[category].push(skill.name);
            return acc;
          }, {} as Record<string, string[]>);
          
          Object.entries(skillsByCategory).forEach(([category, items]) => {
            checkPageBreak(6);
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
              y += 3.5;
              for (let i = 1; i < skillLines.length; i++) {
                checkPageBreak(4);
                pdf.text(skillLines[i], margin, y);
                y += 3.5;
              }
            } else {
              y += 3.5;
            }
          });
          y += 3;
        }
        break;
      }

      case 'certifications': {
        if (resume.certifications.length > 0) {
          addSectionHeader('Certifications');
          
          resume.certifications.forEach(cert => {
            checkPageBreak(6);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor('#000000');
            pdf.text(cert.name || 'Certification', margin, y);
            
            const dateText = `${cert.issuer} • ${cert.date}`;
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor('#555555');
            const dateWidth = pdf.getTextWidth(dateText);
            pdf.text(dateText, pageWidth - margin - dateWidth, y);
            y += 4;
          });
          y += 3;
        }
        break;
      }

      case 'custom': {
        const customSection = (resume.customSections || []).find(cs => cs.id === section.id);
        if (customSection && customSection.items.length > 0) {
          addSectionHeader(customSection.title);
          
          customSection.items.forEach((item, index) => {
            checkPageBreak(12);
            
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor('#000000');
            
            const titleText = item.title || 'Item';
            pdf.text(titleText, margin, y);
            
            // Add technologies in italic if present
            if (customSection.showTechnologies && item.technologies) {
              const titleWidth = pdf.getTextWidth(titleText + '    ');
              pdf.setFont('helvetica', 'italic');
              pdf.setTextColor('#555555');
              pdf.text(item.technologies, margin + titleWidth, y);
            }
            
            if (item.date) {
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor('#000000');
              const dateWidth = pdf.getTextWidth(item.date);
              pdf.text(item.date, pageWidth - margin - dateWidth, y);
            }
            y += 4;
            
            // Bullets
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor('#000000');
            item.bullets.filter(b => !isEmptyContent(b)).forEach(bullet => {
              const bulletText = `• ${stripHtml(bullet)}`;
              const bulletLines = pdf.splitTextToSize(bulletText, contentWidth - 2);
              for (let i = 0; i < bulletLines.length; i++) {
                checkPageBreak(4);
                pdf.text(bulletLines[i], margin + (i > 0 ? 3 : 0), y);
                y += 3.5;
              }
            });
            
            if (index < customSection.items.length - 1) y += 2;
          });
          y += 3;
        }
        break;
      }
    }
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
