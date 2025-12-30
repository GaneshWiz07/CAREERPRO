import jsPDF from 'jspdf';
import { Resume } from '@/types/resume';

// Template font mapping
const TEMPLATE_FONTS: Record<string, string> = {
  'classic': 'times',
  'modern': 'helvetica',
  'executive': 'times',
  'technical': 'helvetica',
  'elegant': 'times',
  'flat': 'helvetica',
  'onepage': 'helvetica',
  'spartan': 'helvetica',
  'stackoverflow': 'helvetica',
  // New templates
  'kendall': 'helvetica',
  'paper': 'times',
  'macchiato': 'helvetica',
  'crisp': 'helvetica',
  'classy': 'times',
  'refined': 'helvetica',
  'nordic': 'helvetica',
  'tokyo': 'helvetica',
  'fresh': 'helvetica',
};

// Template style configurations for PDF export
interface TemplateStyle {
  accentColor: string;
  headerLineColor: string;
  sectionHeaderColor: string;
  nameColor: string;
  bodyColor: string;
  headerStyle: 'centered' | 'left' | 'spartan';
  sectionStyle: 'underline' | 'background' | 'minimal' | 'accent-line';
  compactMode: boolean;
}

const TEMPLATE_STYLES: Record<string, TemplateStyle> = {
  classic: {
    accentColor: '#000000',
    headerLineColor: '#b4b4b4',
    sectionHeaderColor: '#000000',
    nameColor: '#000000',
    bodyColor: '#000000',
    headerStyle: 'centered',
    sectionStyle: 'underline',
    compactMode: false,
  },
  modern: {
    accentColor: '#2563eb',
    headerLineColor: '#2563eb',
    sectionHeaderColor: '#2563eb',
    nameColor: '#1f2937',
    bodyColor: '#000000',
    headerStyle: 'centered',
    sectionStyle: 'accent-line',
    compactMode: false,
  },
  elegant: {
    accentColor: '#9333ea',
    headerLineColor: '#d8b4fe',
    sectionHeaderColor: '#374151',
    nameColor: '#1f2937',
    bodyColor: '#000000',
    headerStyle: 'centered',
    sectionStyle: 'underline',
    compactMode: false,
  },
  flat: {
    accentColor: '#111827',
    headerLineColor: '#ffffff',
    sectionHeaderColor: '#111827',
    nameColor: '#111827',
    bodyColor: '#000000',
    headerStyle: 'centered',
    sectionStyle: 'minimal',
    compactMode: false,
  },
  onepage: {
    accentColor: '#0d9488',
    headerLineColor: '#d1d5db',
    sectionHeaderColor: '#0d9488',
    nameColor: '#1f2937',
    bodyColor: '#000000',
    headerStyle: 'left',
    sectionStyle: 'minimal',
    compactMode: true,
  },
  spartan: {
    accentColor: '#1f2937',
    headerLineColor: '#1f2937',
    sectionHeaderColor: '#1f2937',
    nameColor: '#ffffff',
    bodyColor: '#000000',
    headerStyle: 'spartan',
    sectionStyle: 'background',
    compactMode: false,
  },
  stackoverflow: {
    accentColor: '#ea580c',
    headerLineColor: '#ea580c',
    sectionHeaderColor: '#ea580c',
    nameColor: '#1f2937',
    bodyColor: '#000000',
    headerStyle: 'centered',
    sectionStyle: 'accent-line',
    compactMode: false,
  },
  // New templates
  kendall: {
    accentColor: '#475569',
    headerLineColor: '#94a3b8',
    sectionHeaderColor: '#475569',
    nameColor: '#1e293b',
    bodyColor: '#000000',
    headerStyle: 'centered',
    sectionStyle: 'underline',
    compactMode: false,
  },
  paper: {
    accentColor: '#111827',
    headerLineColor: '#111827',
    sectionHeaderColor: '#111827',
    nameColor: '#111827',
    bodyColor: '#000000',
    headerStyle: 'centered',
    sectionStyle: 'underline',
    compactMode: false,
  },
  macchiato: {
    accentColor: '#92400e',
    headerLineColor: '#d97706',
    sectionHeaderColor: '#92400e',
    nameColor: '#78350f',
    bodyColor: '#000000',
    headerStyle: 'centered',
    sectionStyle: 'underline',
    compactMode: false,
  },
  crisp: {
    accentColor: '#111827',
    headerLineColor: '#111827',
    sectionHeaderColor: '#111827',
    nameColor: '#111827',
    bodyColor: '#000000',
    headerStyle: 'centered',
    sectionStyle: 'minimal',
    compactMode: false,
  },
  classy: {
    accentColor: '#ca8a04',
    headerLineColor: '#ca8a04',
    sectionHeaderColor: '#ca8a04',
    nameColor: '#1f2937',
    bodyColor: '#000000',
    headerStyle: 'centered',
    sectionStyle: 'underline',
    compactMode: false,
  },
  refined: {
    accentColor: '#059669',
    headerLineColor: '#34d399',
    sectionHeaderColor: '#059669',
    nameColor: '#1f2937',
    bodyColor: '#000000',
    headerStyle: 'centered',
    sectionStyle: 'underline',
    compactMode: false,
  },
  executive: {
    accentColor: '#1e3a8a',
    headerLineColor: '#1e3a8a',
    sectionHeaderColor: '#1e3a8a',
    nameColor: '#1e3a8a',
    bodyColor: '#000000',
    headerStyle: 'centered',
    sectionStyle: 'underline',
    compactMode: false,
  },
  nordic: {
    accentColor: '#0d9488',
    headerLineColor: '#14b8a6',
    sectionHeaderColor: '#0d9488',
    nameColor: '#1f2937',
    bodyColor: '#000000',
    headerStyle: 'centered',
    sectionStyle: 'underline',
    compactMode: false,
  },
  tokyo: {
    accentColor: '#dc2626',
    headerLineColor: '#dc2626',
    sectionHeaderColor: '#dc2626',
    nameColor: '#111827',
    bodyColor: '#000000',
    headerStyle: 'centered',
    sectionStyle: 'accent-line',
    compactMode: false,
  },
  fresh: {
    accentColor: '#65a30d',
    headerLineColor: '#84cc16',
    sectionHeaderColor: '#65a30d',
    nameColor: '#1f2937',
    bodyColor: '#000000',
    headerStyle: 'centered',
    sectionStyle: 'accent-line',
    compactMode: false,
  },
};

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

  // Get font and style based on selected template
  const fontFamily = TEMPLATE_FONTS[resume.templateId] || 'helvetica';
  const templateStyle = TEMPLATE_STYLES[resume.templateId] || TEMPLATE_STYLES.classic;

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = templateStyle.compactMode ? 12 : 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper to set font
  const setFont = (isBold = false, isItalic = false) => {
    let style = 'normal';
    if (isBold && isItalic) style = 'bolditalic';
    else if (isBold) style = 'bold';
    else if (isItalic) style = 'italic';
    pdf.setFont(fontFamily, style);
  };

  // Helper to add text with word wrap
  const addText = (text: string, fontSize: number, isBold = false, color = '#000000') => {
    const cleanText = stripHtml(text);
    if (!cleanText) return;
    pdf.setFontSize(fontSize);
    setFont(isBold);
    pdf.setTextColor(color);
    const lines = pdf.splitTextToSize(cleanText, contentWidth);
    pdf.text(lines, margin, y);
    y += lines.length * (fontSize * 0.4) + 2;
  };

  const addSectionHeader = (title: string) => {
    const spacing = templateStyle.compactMode ? 10 : 14;
    checkPageBreak(spacing);

    switch (templateStyle.sectionStyle) {
      case 'background':
        // Spartan style - dark background
        pdf.setFillColor(templateStyle.sectionHeaderColor);
        pdf.rect(margin, y - 3, contentWidth, 8, 'F');
        pdf.setFontSize(templateStyle.compactMode ? 10 : 11);
        setFont(true);
        pdf.setTextColor('#ffffff');
        pdf.text(title.toUpperCase(), margin + 2, y + 1.5);
        y += 10;
        break;

      case 'accent-line':
        // Modern/StackOverflow style - colored text with accent line
        pdf.setFontSize(templateStyle.compactMode ? 10 : 11);
        setFont(true);
        pdf.setTextColor(templateStyle.sectionHeaderColor);
        pdf.text(title.toUpperCase(), margin, y);
        y += 4;
        pdf.setDrawColor(templateStyle.headerLineColor);
        pdf.setLineWidth(0.5);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 5;
        break;

      case 'minimal':
        // Flat/OnePage style - bold text, no line
        pdf.setFontSize(templateStyle.compactMode ? 10 : 11);
        setFont(true);
        pdf.setTextColor(templateStyle.sectionHeaderColor);
        pdf.text(title.toUpperCase(), margin, y);
        y += templateStyle.compactMode ? 5 : 7;
        break;

      case 'underline':
      default:
        // Classic/Elegant style - standard underline
        pdf.setFontSize(templateStyle.compactMode ? 10 : 11);
        setFont(true);
        pdf.setTextColor(templateStyle.sectionHeaderColor);
        pdf.text(title.toUpperCase(), margin, y);
        y += 4;
        pdf.setDrawColor(templateStyle.headerLineColor);
        pdf.setLineWidth(0.2);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 5;
        break;
    }
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
        // Contact Header - style based on template
        const fontSize = templateStyle.compactMode ? 14 : 18;

        if (templateStyle.headerStyle === 'spartan') {
          // Spartan style - dark banner with white text
          pdf.setFillColor(templateStyle.accentColor);
          pdf.rect(0, 0, pageWidth, 25, 'F');

          pdf.setFontSize(fontSize);
          setFont(true);
          pdf.setTextColor(templateStyle.nameColor);
          if (resume.contact.fullName) {
            const nameWidth = pdf.getTextWidth(resume.contact.fullName.toUpperCase());
            pdf.text(resume.contact.fullName.toUpperCase(), (pageWidth - nameWidth) / 2, 12);
          }

          const contactParts = [
            resume.contact.email,
            resume.contact.phone,
            resume.contact.location
          ].filter(Boolean);

          if (contactParts.length > 0) {
            pdf.setFontSize(10);
            setFont(false);
            pdf.setTextColor('#cccccc');
            const contactText = contactParts.join('  •  ');
            const contactWidth = pdf.getTextWidth(contactText);
            pdf.text(contactText, (pageWidth - contactWidth) / 2, 19);
          }

          y = 30;

          const linkParts = [resume.contact.linkedin, resume.contact.website].filter(Boolean);
          if (linkParts.length > 0) {
            pdf.setFontSize(10);
            setFont(false);
            pdf.setTextColor('#555555');
            const linkText = linkParts.join('  •  ');
            const linkWidth = pdf.getTextWidth(linkText);
            pdf.text(linkText, (pageWidth - linkWidth) / 2, y);
            y += 5;
          }

        } else if (templateStyle.headerStyle === 'left') {
          // OnePage style - left-aligned compact header
          pdf.setFontSize(fontSize);
          setFont(true);
          pdf.setTextColor(templateStyle.nameColor);
          if (resume.contact.fullName) {
            pdf.text(resume.contact.fullName, margin, y);
          }

          // Contact info on the right
          const contactParts = [
            resume.contact.email,
            resume.contact.phone,
            resume.contact.location
          ].filter(Boolean);

          if (contactParts.length > 0) {
            pdf.setFontSize(9);
            setFont(false);
            pdf.setTextColor('#555555');
            let contactY = y - 4;
            contactParts.forEach(part => {
              const textWidth = pdf.getTextWidth(part as string);
              pdf.text(part as string, pageWidth - margin - textWidth, contactY);
              contactY += 3;
            });
          }

          y += 5;

          const linkParts = [resume.contact.linkedin, resume.contact.website].filter(Boolean);
          if (linkParts.length > 0) {
            pdf.setFontSize(9);
            const linkText = linkParts.join('  |  ');
            pdf.text(linkText, margin, y);
            y += 4;
          }

          pdf.setDrawColor(templateStyle.headerLineColor);
          pdf.setLineWidth(0.3);
          pdf.line(margin, y, pageWidth - margin, y);
          y += 4;

        } else {
          // Centered style (classic, modern, elegant, flat, stackoverflow)
          pdf.setFontSize(fontSize);
          setFont(true);
          pdf.setTextColor(templateStyle.nameColor);
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
            pdf.setFontSize(10);
            setFont(false);
            pdf.setTextColor('#555555');
            const contactText = contactParts.join('  •  ');
            const contactWidth = pdf.getTextWidth(contactText);
            pdf.text(contactText, (pageWidth - contactWidth) / 2, y);
            y += 4;
          }

          const linkParts = [resume.contact.linkedin, resume.contact.website].filter(Boolean);
          if (linkParts.length > 0) {
            pdf.setFontSize(10);
            pdf.setTextColor(templateStyle.accentColor);
            const linkText = linkParts.join('  •  ');
            const linkWidth = pdf.getTextWidth(linkText);
            pdf.text(linkText, (pageWidth - linkWidth) / 2, y);
            y += 4;
          }

          // Draw header line based on template
          if (templateStyle.sectionStyle !== 'minimal') {
            pdf.setDrawColor(templateStyle.headerLineColor);
            pdf.setLineWidth(templateStyle.sectionStyle === 'accent-line' ? 0.5 : 0.2);
            pdf.line(margin, y, pageWidth - margin, y);
          }
          y += 5;
        }
        break;
      }

      case 'summary': {
        if (!isEmptyContent(resume.summary)) {
          addSectionHeader('Professional Summary');
          const bodyFontSize = templateStyle.compactMode ? 10 : 11;
          const lineHeight = templateStyle.compactMode ? 4 : 4.5;
          pdf.setFontSize(bodyFontSize);
          setFont(false);
          pdf.setTextColor(templateStyle.bodyColor);
          const summaryText = stripHtml(resume.summary);
          const summaryLines = pdf.splitTextToSize(summaryText, contentWidth);
          for (const line of summaryLines) {
            checkPageBreak(4);
            pdf.text(line, margin, y);
            y += lineHeight;
          }
          y += templateStyle.compactMode ? 2 : 4;
        }
        break;
      }

      case 'experience': {
        if (resume.experiences.length > 0) {
          addSectionHeader('Work Experience');

          const bodyFontSize = templateStyle.compactMode ? 10 : 11;
          const lineHeight = templateStyle.compactMode ? 4 : 4.5;

          resume.experiences.forEach((exp, index) => {
            checkPageBreak(15);

            // Title and dates on same line
            pdf.setFontSize(bodyFontSize);
            setFont(true);
            pdf.setTextColor(templateStyle.accentColor);
            const titleText = exp.title || 'Position';
            pdf.text(titleText, margin, y);

            const dateText = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
            setFont(true);
            pdf.setTextColor(templateStyle.bodyColor);
            const dateWidth = pdf.getTextWidth(dateText);
            pdf.text(dateText, pageWidth - margin - dateWidth, y);
            y += templateStyle.compactMode ? 3 : 4;

            // Company and location
            setFont(false);
            pdf.setTextColor('#555555');
            const companyText = `${exp.company}${exp.location ? `, ${exp.location}` : ''}`;
            pdf.text(companyText, margin, y);
            y += templateStyle.compactMode ? 3 : 4;

            // Bullets
            pdf.setTextColor(templateStyle.bodyColor);
            exp.bullets.filter(b => !isEmptyContent(b)).forEach(bullet => {
              const bulletText = `• ${stripHtml(bullet)}`;
              const bulletLines = pdf.splitTextToSize(bulletText, contentWidth - 2);
              for (let i = 0; i < bulletLines.length; i++) {
                checkPageBreak(4);
                pdf.text(bulletLines[i], margin + (i > 0 ? 3 : 0), y);
                y += lineHeight;
              }
            });

            if (index < resume.experiences.length - 1) y += (templateStyle.compactMode ? 1 : 2);
          });
          y += templateStyle.compactMode ? 2 : 3;
        }
        break;
      }

      case 'education': {
        if (resume.education.length > 0) {
          addSectionHeader('Education');

          const bodyFontSize = templateStyle.compactMode ? 10 : 11;
          const spacing = templateStyle.compactMode ? 3 : 4;

          resume.education.forEach((edu, index) => {
            checkPageBreak(12);

            pdf.setFontSize(bodyFontSize);
            setFont(true);
            pdf.setTextColor(templateStyle.accentColor);
            pdf.text(edu.degree || 'Degree', margin, y);

            const batch = edu.batchStart && edu.batchEnd ? `${edu.batchStart} - ${edu.batchEnd}` : edu.batchStart || edu.batchEnd || '';
            if (batch) {
              setFont(true);
              pdf.setTextColor(templateStyle.bodyColor);
              const batchWidth = pdf.getTextWidth(batch);
              pdf.text(batch, pageWidth - margin - batchWidth, y);
            }
            y += spacing;

            setFont(false);
            pdf.setTextColor('#555555');
            const schoolText = `${edu.institution}${edu.location ? `, ${edu.location}` : ''}`;
            pdf.text(schoolText, margin, y);
            y += spacing;

            if (edu.gpa || !isEmptyContent(edu.honors || '')) {
              const extras = [];
              if (edu.gpa) extras.push(`GPA: ${edu.gpa}`);
              if (!isEmptyContent(edu.honors || '')) extras.push(stripHtml(edu.honors || ''));
              pdf.text(extras.join(' | '), margin, y);
              y += spacing;
            }

            if (index < resume.education.length - 1) y += (templateStyle.compactMode ? 0.5 : 1);
          });
          y += templateStyle.compactMode ? 2 : 3;
        }
        break;
      }

      case 'skills': {
        if (resume.skills.length > 0) {
          addSectionHeader('Skills');

          const bodyFontSize = templateStyle.compactMode ? 10 : 11;
          const lineHeight = templateStyle.compactMode ? 4 : 4.5;

          const skillsByCategory = resume.skills.reduce((acc, skill) => {
            const category = skill.category || 'Other';
            if (!acc[category]) acc[category] = [];
            acc[category].push(skill.name);
            return acc;
          }, {} as Record<string, string[]>);

          Object.entries(skillsByCategory).forEach(([category, items]) => {
            checkPageBreak(6);
            pdf.setFontSize(bodyFontSize);
            setFont(true);
            pdf.setTextColor(templateStyle.accentColor);
            const categoryText = `${category}: `;
            pdf.text(categoryText, margin, y);
            const categoryWidth = pdf.getTextWidth(categoryText);
            setFont(false);
            pdf.setTextColor(templateStyle.bodyColor);
            const skillsText = items.filter(Boolean).join(', ');
            const skillLines = pdf.splitTextToSize(skillsText, contentWidth - categoryWidth);
            pdf.text(skillLines[0], margin + categoryWidth, y);
            if (skillLines.length > 1) {
              y += lineHeight;
              for (let i = 1; i < skillLines.length; i++) {
                checkPageBreak(4);
                pdf.text(skillLines[i], margin, y);
                y += lineHeight;
              }
            } else {
              y += lineHeight;
            }
          });
          y += templateStyle.compactMode ? 2 : 3;
        }
        break;
      }

      case 'certifications': {
        if (resume.certifications.length > 0) {
          addSectionHeader('Certifications');

          const bodyFontSize = templateStyle.compactMode ? 10 : 11;
          const spacing = templateStyle.compactMode ? 3 : 4;

          resume.certifications.forEach(cert => {
            checkPageBreak(6);
            pdf.setFontSize(bodyFontSize);
            setFont(true);
            pdf.setTextColor(templateStyle.accentColor);
            pdf.text(cert.name || 'Certification', margin, y);

            const dateText = `${cert.issuer} • ${cert.date}`;
            setFont(false);
            pdf.setTextColor('#555555');
            const dateWidth = pdf.getTextWidth(dateText);
            pdf.text(dateText, pageWidth - margin - dateWidth, y);
            y += spacing;
          });
          y += 3;
        }
        break;
      }

      case 'custom': {
        const customSection = (resume.customSections || []).find(cs => cs.id === section.id);
        if (customSection && customSection.items.length > 0) {
          addSectionHeader(customSection.title);

          const bodyFontSize = templateStyle.compactMode ? 10 : 11;
          const lineHeight = templateStyle.compactMode ? 4 : 4.5;
          const spacing = templateStyle.compactMode ? 3 : 4;

          customSection.items.forEach((item, index) => {
            checkPageBreak(12);

            pdf.setFontSize(bodyFontSize);
            setFont(true);
            pdf.setTextColor(templateStyle.accentColor);

            const titleText = item.title || 'Item';
            pdf.text(titleText, margin, y);

            // Date on the right side of title
            if (item.date) {
              setFont(true);
              pdf.setTextColor(templateStyle.bodyColor);
              const dateWidth = pdf.getTextWidth(item.date);
              pdf.text(item.date, pageWidth - margin - dateWidth, y);
            }
            y += spacing;

            // Add technologies in italic on a separate line if present
            if (customSection.showTechnologies && item.technologies) {
              setFont(false, true);
              pdf.setTextColor('#555555');
              pdf.text(item.technologies, margin, y);
              y += spacing;
            }

            // Bullets
            setFont(false);
            pdf.setTextColor(templateStyle.bodyColor);
            item.bullets.filter(b => !isEmptyContent(b)).forEach(bullet => {
              const bulletText = `• ${stripHtml(bullet)}`;
              const bulletLines = pdf.splitTextToSize(bulletText, contentWidth - 2);
              for (let i = 0; i < bulletLines.length; i++) {
                checkPageBreak(4);
                pdf.text(bulletLines[i], margin + (i > 0 ? 3 : 0), y);
                y += lineHeight;
              }
            });

            if (index < customSection.items.length - 1) y += (templateStyle.compactMode ? 1 : 2);
          });
          y += templateStyle.compactMode ? 2 : 3;
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
