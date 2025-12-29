import React from 'react';
import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';

interface ResumePreviewProps {
  resume: Resume;
  showHeatmap?: boolean;
  className?: string;
}

// Template style configurations
const TEMPLATE_STYLES: Record<string, {
  fontFamily: string;
  headerStyle: string;
  sectionHeaderStyle: string;
  nameStyle: string;
  bodyStyle: string;
  accentColor?: string;
  layout: 'classic' | 'modern' | 'compact';
}> = {
  classic: {
    fontFamily: "'Georgia', serif",
    headerStyle: "text-center border-b border-gray-400 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-bold uppercase tracking-wide border-b border-gray-400 pb-1 mb-2",
    nameStyle: "text-2xl font-bold mb-1",
    bodyStyle: "text-xs leading-relaxed",
    layout: 'classic',
  },
  modern: {
    fontFamily: "'Open Sans', sans-serif",
    headerStyle: "text-center border-b-2 border-blue-600 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-bold uppercase tracking-wider text-blue-700 border-b-2 border-blue-200 pb-1 mb-2",
    nameStyle: "text-2xl font-bold text-gray-900 mb-1",
    bodyStyle: "text-xs leading-relaxed",
    accentColor: '#2563eb',
    layout: 'modern',
  },
  executive: {
    fontFamily: "'Merriweather', serif",
    headerStyle: "text-center border-b-2 border-gray-800 pb-4 mb-5",
    sectionHeaderStyle: "text-xs font-bold uppercase tracking-[0.2em] border-b-2 border-gray-800 pb-1 mb-3",
    nameStyle: "text-3xl font-bold tracking-wide mb-2",
    bodyStyle: "text-xs leading-relaxed",
    layout: 'classic',
  },
};

// Check if content is empty (handles both plain text and HTML)
const isEmptyContent = (content: string): boolean => {
  if (!content) return true;
  const stripped = content.replace(/<[^>]*>/g, '').trim();
  return !stripped || stripped === '';
};

// Render HTML content - handles lists and inline formatting
const RenderHtml = ({ html, className }: { html: string; className?: string }) => {
  // Check if content contains list elements
  const hasList = /<[uo]l>/.test(html);
  
  if (hasList) {
    // Render lists properly
    return (
      <div 
        className={cn("formatted-list", className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  
  // Convert block elements to inline for non-list content
  const inlineHtml = html
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '')
    .replace(/<br\s*\/?>/g, ' ');
  
  return (
    <span 
      className={className}
      dangerouslySetInnerHTML={{ __html: inlineHtml }}
    />
  );
};

export function ResumePreview({ resume, showHeatmap = false, className }: ResumePreviewProps) {
  const { contact, summary, experiences, education, skills, certifications, customSections = [] } = resume;
  const templateId = resume.templateId || 'classic';
  const styles = TEMPLATE_STYLES[templateId] || TEMPLATE_STYLES.classic;

  // Get ordered sections
  const allSections = [
    ...resume.sections.filter(s => s.type !== 'custom'),
    ...customSections.map(cs => ({
      id: cs.id,
      type: 'custom' as const,
      title: cs.title,
      order: cs.order,
      visible: cs.visible,
    })),
  ].sort((a, b) => a.order - b.order);

  // Heatmap zones - based on recruiter eye-tracking studies
  const getHeatmapOverlay = () => {
    if (!showHeatmap) return null;
    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Name & Contact - High attention */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-red-500/30 border-2 border-red-500 rounded-t" />
        {/* Summary - Medium-High attention */}
        <div className="absolute top-20 left-0 right-0 h-16 bg-orange-500/25" />
        {/* First Experience - High attention */}
        <div className="absolute top-36 left-0 right-0 h-28 bg-yellow-500/20" />
        {/* Rest - Lower attention */}
        <div className="absolute top-64 left-0 right-0 bottom-0 bg-blue-500/10" />
      </div>
    );
  };

  const renderSection = (sectionType: string, sectionId?: string) => {
    switch (sectionType) {
      case 'contact':
        if (styles.layout === 'compact') {
          return (
            <header key="contact" className={styles.headerStyle}>
              <div>
                <h1 className={styles.nameStyle} style={{ color: '#1f2937' }}>
                  {contact.fullName || 'Your Name'}
                </h1>
              </div>
              <div className="text-right text-[10px] text-gray-600 space-y-0.5">
                {contact.email && <div>{contact.email}</div>}
                {contact.phone && <div>{contact.phone}</div>}
                {contact.location && <div>{contact.location}</div>}
              </div>
            </header>
          );
        }
        
        return (
          <header key="contact" className={styles.headerStyle}>
            <h1 className={styles.nameStyle} style={{ color: styles.accentColor || '#1f2937' }}>
              {contact.fullName || 'Your Name'}
            </h1>
            <div className="text-xs text-gray-600 flex flex-wrap justify-center gap-2">
              {contact.email && <span>{contact.email}</span>}
              {contact.phone && <span>• {contact.phone}</span>}
              {contact.location && <span>• {contact.location}</span>}
            </div>
            <div className="text-xs text-gray-500 flex flex-wrap justify-center gap-2 mt-1">
              {contact.linkedin && <span>{contact.linkedin}</span>}
              {contact.website && <span>• {contact.website}</span>}
            </div>
          </header>
        );

      case 'summary':
        if (isEmptyContent(summary)) return null;
        return (
          <section key="summary" className={styles.layout === 'compact' ? 'mb-2' : 'mb-4'}>
            <h2 className={styles.sectionHeaderStyle}>
              Professional Summary
            </h2>
            <div className={styles.bodyStyle} style={{ color: '#374151' }}>
              <RenderHtml html={summary} />
            </div>
          </section>
        );

      case 'experience':
        if (experiences.length === 0) return null;
        return (
          <section key="experience" className={styles.layout === 'compact' ? 'mb-2' : 'mb-4'}>
            <h2 className={styles.sectionHeaderStyle}>
              Work Experience
            </h2>
            {experiences.map((exp) => (
              <div key={exp.id} className={styles.layout === 'compact' ? 'mb-2' : 'mb-3'}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold" style={{ color: styles.accentColor || '#1f2937' }}>
                      {exp.title || 'Position'}
                    </h3>
                    <p className="text-xs text-gray-600">{exp.company}{exp.location && `, ${exp.location}`}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap font-semibold">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bullets.filter(b => !isEmptyContent(b)).length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.bullets.filter(b => !isEmptyContent(b)).map((bullet, idx) => (
                      <li key={idx} className={cn(styles.bodyStyle, "flex")} style={{ color: '#374151' }}>
                        <span className="mr-2">•</span>
                        <RenderHtml html={bullet} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        );

      case 'education':
        if (education.length === 0) return null;
        return (
          <section key="education" className={styles.layout === 'compact' ? 'mb-2' : 'mb-4'}>
            <h2 className={styles.sectionHeaderStyle}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className={styles.layout === 'compact' ? 'mb-1' : 'mb-2'}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold" style={{ color: styles.accentColor || '#1f2937' }}>
                      {edu.degree}
                    </h3>
                    <p className="text-xs text-gray-600">{edu.institution}{edu.location && `, ${edu.location}`}</p>
                  </div>
                  <span className="text-xs text-gray-500 font-semibold">
                    {edu.batchStart && edu.batchEnd ? `${edu.batchStart} - ${edu.batchEnd}` : edu.batchStart || edu.batchEnd}
                  </span>
                </div>
                {(edu.gpa || (edu.honors && !isEmptyContent(edu.honors))) && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    {edu.gpa && edu.honors && !isEmptyContent(edu.honors) && <span> | </span>}
                    {edu.honors && !isEmptyContent(edu.honors) && <RenderHtml html={edu.honors} />}
                  </div>
                )}
              </div>
            ))}
          </section>
        );

      case 'skills':
        if (skills.length === 0) return null;
        return (
          <section key="skills" className={styles.layout === 'compact' ? 'mb-2' : 'mb-4'}>
            <h2 className={styles.sectionHeaderStyle}>
              Skills
            </h2>
            <div className="space-y-1">
              {Object.entries(
                skills.reduce((acc, skill) => {
                  const category = skill.category || 'Other';
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(skill.name);
                  return acc;
                }, {} as Record<string, string[]>)
              ).map(([category, items]) => (
                <p key={category} className={styles.bodyStyle} style={{ color: '#374151' }}>
                  <span className="font-semibold" style={{ color: styles.accentColor || '#1f2937' }}>{category}:</span>{' '}
                  {items.filter(Boolean).join(', ')}
                </p>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        if (certifications.length === 0) return null;
        return (
          <section key="certifications" className={styles.layout === 'compact' ? 'mb-2' : 'mb-4'}>
            <h2 className={styles.sectionHeaderStyle}>
              Certifications
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className={cn("flex justify-between", styles.bodyStyle, styles.layout === 'compact' ? 'mb-0.5' : 'mb-1')}>
                <span className="font-medium" style={{ color: styles.accentColor || '#1f2937' }}>{cert.name}</span>
                <span className="text-gray-500">{cert.issuer} • {cert.date}</span>
              </div>
            ))}
          </section>
        );

      case 'custom':
        const customSection = customSections.find(cs => cs.id === sectionId);
        if (!customSection || customSection.items.length === 0) return null;
        return (
          <section key={customSection.id} className={styles.layout === 'compact' ? 'mb-2' : 'mb-4'}>
            <h2 className={styles.sectionHeaderStyle}>
              {customSection.title}
            </h2>
            {customSection.items.map((item) => (
              <div key={item.id} className={styles.layout === 'compact' ? 'mb-1' : 'mb-2'}>
                <div className="flex justify-between items-start">
                  <div className="flex items-baseline gap-4 flex-1">
                    <h3 className="text-xs font-bold" style={{ color: styles.accentColor || '#1f2937' }}>{item.title}</h3>
                    {customSection.showTechnologies && item.technologies && (
                      <span className="text-xs text-gray-500 italic">{item.technologies}</span>
                    )}
                  </div>
                  {item.date && (
                    <span className="text-xs text-gray-500 whitespace-nowrap font-semibold">{item.date}</span>
                  )}
                </div>
                {item.bullets.filter(b => !isEmptyContent(b)).length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {item.bullets.filter(b => !isEmptyContent(b)).map((bullet, idx) => (
                      <li key={idx} className={cn(styles.bodyStyle, "flex")} style={{ color: '#374151' }}>
                        <span className="mr-2">•</span>
                        <RenderHtml html={bullet} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("relative bg-white border border-gray-200 rounded-lg shadow-sm", className)}>
      {getHeatmapOverlay()}
      
      {/* Add styles for formatted content */}
      <style>{`
        .resume-content strong, .resume-content b { font-weight: bold; }
        .resume-content em, .resume-content i { font-style: italic; }
        .resume-content u { text-decoration: underline; }
        .resume-content s { text-decoration: line-through; }
        .resume-content a { color: inherit; text-decoration: underline; }
        .resume-content .formatted-list ul { list-style-type: disc; margin-left: 1rem; }
        .resume-content .formatted-list ol { list-style-type: decimal; margin-left: 1rem; }
        .resume-content .formatted-list li { margin: 0.125rem 0; }
        .resume-content .formatted-list p { margin: 0; display: inline; }
      `}</style>
      
      <div 
        id="resume-preview" 
        className={cn(
          "p-8 text-sm leading-relaxed resume-content",
          styles.layout === 'compact' && "p-6"
        )}
        style={{ fontFamily: styles.fontFamily }}
      >
        {/* Render sections in order */}
        {allSections.filter(s => s.visible).map((section) => 
          renderSection(section.type, section.id)
        )}
      </div>
    </div>
  );
}
