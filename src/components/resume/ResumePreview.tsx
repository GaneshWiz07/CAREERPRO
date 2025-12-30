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
  layout: 'classic' | 'modern' | 'compact' | 'elegant' | 'flat' | 'spartan' | 'stackoverflow' | 'kendall' | 'paper' | 'macchiato' | 'crisp' | 'classy' | 'refined' | 'executive' | 'nordic' | 'tokyo' | 'fresh';
}> = {
  classic: {
    fontFamily: "'Georgia', serif",
    headerStyle: "text-center border-b border-gray-400 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-bold uppercase tracking-wide border-b border-gray-400 pb-1 mb-2",
    nameStyle: "text-2xl font-bold mb-1",
    bodyStyle: "text-sm leading-relaxed",
    layout: 'classic',
  },
  modern: {
    fontFamily: "'Open Sans', sans-serif",
    headerStyle: "text-center border-b-2 border-blue-600 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-bold uppercase tracking-wider text-blue-700 border-b-2 border-blue-200 pb-1 mb-2",
    nameStyle: "text-2xl font-bold text-gray-900 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#2563eb',
    layout: 'modern',
  },
  elegant: {
    fontFamily: "'Playfair Display', 'Georgia', serif",
    headerStyle: "text-center border-b border-purple-300 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-semibold tracking-wide text-gray-700 border-b border-purple-200 pb-1 mb-2 flex items-center gap-2",
    nameStyle: "text-2xl font-bold mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#9333ea',
    layout: 'elegant',
  },
  flat: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
    headerStyle: "text-center mb-5",
    sectionHeaderStyle: "text-sm font-bold uppercase tracking-widest text-gray-900 mb-3",
    nameStyle: "text-3xl font-black mb-1",
    bodyStyle: "text-sm leading-relaxed",
    layout: 'flat',
  },
  onepage: {
    fontFamily: "'Inter', 'Arial', sans-serif",
    headerStyle: "flex justify-between items-start border-b border-gray-300 pb-2 mb-3",
    sectionHeaderStyle: "text-xs font-bold uppercase tracking-wider text-teal-700 mb-1",
    nameStyle: "text-xl font-bold",
    bodyStyle: "text-xs leading-tight",
    accentColor: '#0d9488',
    layout: 'compact',
  },
  spartan: {
    fontFamily: "'Montserrat', 'Arial Black', sans-serif",
    headerStyle: "mb-4",
    sectionHeaderStyle: "text-sm font-black uppercase tracking-widest text-gray-800 bg-gray-100 px-2 py-1 mb-2",
    nameStyle: "text-2xl font-black uppercase tracking-wider mb-1",
    bodyStyle: "text-sm leading-relaxed",
    layout: 'spartan',
  },
  stackoverflow: {
    fontFamily: "'Source Sans Pro', 'Arial', sans-serif",
    headerStyle: "text-center border-b-2 border-orange-500 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-bold uppercase tracking-wider text-orange-600 border-b border-orange-200 pb-1 mb-2",
    nameStyle: "text-2xl font-bold text-gray-900 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#ea580c',
    layout: 'stackoverflow',
  },
  // New templates
  kendall: {
    fontFamily: "'Lato', sans-serif",
    headerStyle: "text-center border-b border-slate-400 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-semibold uppercase tracking-wide text-slate-600 border-b border-slate-300 pb-1 mb-2",
    nameStyle: "text-2xl font-bold text-slate-800 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#475569',
    layout: 'kendall',
  },
  paper: {
    fontFamily: "'Merriweather', serif",
    headerStyle: "text-center border-b-2 border-gray-900 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-black uppercase tracking-wide text-gray-900 border-b border-gray-400 pb-1 mb-2",
    nameStyle: "text-3xl font-bold text-gray-900 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    layout: 'paper',
  },
  macchiato: {
    fontFamily: "'Nunito', sans-serif",
    headerStyle: "text-center border-b border-amber-600 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-bold uppercase tracking-wide text-amber-800 border-b border-amber-300 pb-1 mb-2",
    nameStyle: "text-2xl font-bold text-amber-900 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#92400e',
    layout: 'macchiato',
  },
  crisp: {
    fontFamily: "'Poppins', sans-serif",
    headerStyle: "text-center border-b-4 border-gray-900 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-bold uppercase tracking-widest text-gray-900 mb-2",
    nameStyle: "text-3xl font-extrabold text-gray-900 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    layout: 'crisp',
  },
  classy: {
    fontFamily: "'Cormorant Garamond', serif",
    headerStyle: "text-center border-b border-yellow-600 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-semibold uppercase tracking-wide text-yellow-700 border-b border-yellow-300 pb-1 mb-2",
    nameStyle: "text-2xl font-bold text-gray-800 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#ca8a04',
    layout: 'classy',
  },
  refined: {
    fontFamily: "'Quicksand', sans-serif",
    headerStyle: "text-center border-b border-emerald-400 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-semibold uppercase tracking-wide text-emerald-700 border-b border-emerald-200 pb-1 mb-2",
    nameStyle: "text-2xl font-bold text-gray-800 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#059669',
    layout: 'refined',
  },
  executive: {
    fontFamily: "'Libre Baskerville', serif",
    headerStyle: "text-center border-b-2 border-blue-900 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-bold uppercase tracking-wide text-blue-900 border-b border-blue-300 pb-1 mb-2",
    nameStyle: "text-2xl font-bold text-blue-900 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#1e3a8a',
    layout: 'executive',
  },
  nordic: {
    fontFamily: "'Work Sans', sans-serif",
    headerStyle: "text-center border-b border-teal-500 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-medium uppercase tracking-wide text-teal-700 border-b border-teal-200 pb-1 mb-2",
    nameStyle: "text-2xl font-semibold text-gray-800 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#0d9488',
    layout: 'nordic',
  },
  tokyo: {
    fontFamily: "'Noto Sans', sans-serif",
    headerStyle: "text-center border-b-2 border-red-600 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-bold uppercase tracking-wide text-red-600 border-b border-red-200 pb-1 mb-2",
    nameStyle: "text-2xl font-bold text-gray-900 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#dc2626',
    layout: 'tokyo',
  },
  fresh: {
    fontFamily: "'DM Sans', sans-serif",
    headerStyle: "text-center border-b-2 border-lime-500 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-semibold uppercase tracking-wide text-lime-700 border-b border-lime-300 pb-1 mb-2",
    nameStyle: "text-2xl font-bold text-gray-800 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#65a30d',
    layout: 'fresh',
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
        // OnePage/Compact style - left-aligned
        if (styles.layout === 'compact') {
          return (
            <header key="contact" className={styles.headerStyle}>
              <div>
                <h1 className={styles.nameStyle} style={{ color: styles.accentColor || '#1f2937' }}>
                  {contact.fullName || 'Your Name'}
                </h1>
              </div>
              <div className="text-right text-xs text-gray-600 space-y-0.5">
                {contact.email && <div>{contact.email}</div>}
                {contact.phone && <div>{contact.phone}</div>}
                {contact.location && <div>{contact.location}</div>}
              </div>
            </header>
          );
        }

        // Spartan style - dark banner header
        if (styles.layout === 'spartan') {
          return (
            <header key="contact" className={styles.headerStyle}>
              <div className="bg-gray-900 px-4 py-4 -mx-8 -mt-8 mb-4">
                <h1 className={cn(styles.nameStyle, "text-center text-white")}>
                  {contact.fullName || 'Your Name'}
                </h1>
                <div className="text-sm text-gray-300 flex flex-wrap justify-center gap-3 mt-2">
                  {contact.email && <span>{contact.email}</span>}
                  {contact.phone && <span>• {contact.phone}</span>}
                  {contact.location && <span>• {contact.location}</span>}
                </div>
              </div>
              <div className="text-sm text-gray-500 flex flex-wrap justify-center gap-2">
                {contact.linkedin && <span>{contact.linkedin}</span>}
                {contact.website && <span>• {contact.website}</span>}
              </div>
            </header>
          );
        }

        // Elegant style - purple accents
        if (styles.layout === 'elegant') {
          return (
            <header key="contact" className={styles.headerStyle}>
              <h1 className={styles.nameStyle} style={{ color: '#1f2937' }}>
                {contact.fullName || 'Your Name'}
              </h1>
              <div className="text-sm text-purple-600 flex flex-wrap justify-center gap-2" style={{ color: styles.accentColor }}>
                {contact.email && <span>{contact.email}</span>}
                {contact.phone && <span>• {contact.phone}</span>}
                {contact.location && <span>• {contact.location}</span>}
              </div>
              <div className="text-sm text-gray-500 flex flex-wrap justify-center gap-2 mt-1">
                {contact.linkedin && <span>{contact.linkedin}</span>}
                {contact.website && <span>• {contact.website}</span>}
              </div>
            </header>
          );
        }

        // Flat style - minimal, no decorations
        if (styles.layout === 'flat') {
          return (
            <header key="contact" className={styles.headerStyle}>
              <h1 className={styles.nameStyle} style={{ color: '#111827' }}>
                {contact.fullName || 'Your Name'}
              </h1>
              <div className="text-sm text-gray-600 flex flex-wrap justify-center gap-3 mt-1">
                {contact.email && <span>{contact.email}</span>}
                {contact.phone && <span>{contact.phone}</span>}
                {contact.location && <span>{contact.location}</span>}
              </div>
              <div className="text-sm text-gray-500 flex flex-wrap justify-center gap-3 mt-1">
                {contact.linkedin && <span>{contact.linkedin}</span>}
                {contact.website && <span>{contact.website}</span>}
              </div>
            </header>
          );
        }

        // StackOverflow style - orange accents
        if (styles.layout === 'stackoverflow') {
          return (
            <header key="contact" className={styles.headerStyle}>
              <h1 className={styles.nameStyle} style={{ color: '#1f2937' }}>
                {contact.fullName || 'Your Name'}
              </h1>
              <div className="text-sm flex flex-wrap justify-center gap-2" style={{ color: styles.accentColor }}>
                {contact.email && <span>{contact.email}</span>}
                {contact.phone && <span>• {contact.phone}</span>}
                {contact.location && <span>• {contact.location}</span>}
              </div>
              <div className="text-sm text-gray-500 flex flex-wrap justify-center gap-2 mt-1">
                {contact.linkedin && <span>{contact.linkedin}</span>}
                {contact.website && <span>• {contact.website}</span>}
              </div>
            </header>
          );
        }

        // Classic & Modern style - default centered
        return (
          <header key="contact" className={styles.headerStyle}>
            <h1 className={styles.nameStyle} style={{ color: styles.accentColor || '#1f2937' }}>
              {contact.fullName || 'Your Name'}
            </h1>
            <div className="text-sm text-gray-600 flex flex-wrap justify-center gap-2">
              {contact.email && <span>{contact.email}</span>}
              {contact.phone && <span>• {contact.phone}</span>}
              {contact.location && <span>• {contact.location}</span>}
            </div>
            <div className="text-sm text-gray-500 flex flex-wrap justify-center gap-2 mt-1">
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
              {styles.layout === 'elegant' && <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />}
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
              {styles.layout === 'elegant' && <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />}
              Work Experience
            </h2>
            {experiences.map((exp) => (
              <div key={exp.id} className={styles.layout === 'compact' ? 'mb-2' : 'mb-3'}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={cn(styles.bodyStyle, "font-bold")} style={{ color: styles.accentColor || '#1f2937' }}>
                      {exp.title || 'Position'}
                    </h3>
                    <p className={cn(styles.bodyStyle, "text-gray-600")}>{exp.company}{exp.location && `, ${exp.location}`}</p>
                  </div>
                  <span className={cn(styles.bodyStyle, "text-gray-500 whitespace-nowrap font-semibold")}>
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
              {styles.layout === 'elegant' && <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />}
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className={styles.layout === 'compact' ? 'mb-1' : 'mb-2'}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={cn(styles.bodyStyle, "font-bold")} style={{ color: styles.accentColor || '#1f2937' }}>
                      {edu.degree}
                    </h3>
                    <p className={cn(styles.bodyStyle, "text-gray-600")}>{edu.institution}{edu.location && `, ${edu.location}`}</p>
                  </div>
                  <span className={cn(styles.bodyStyle, "text-gray-500 font-semibold")}>
                    {edu.batchStart && edu.batchEnd ? `${edu.batchStart} - ${edu.batchEnd}` : edu.batchStart || edu.batchEnd}
                  </span>
                </div>
                {(edu.gpa || (edu.honors && !isEmptyContent(edu.honors))) && (
                  <div className={cn(styles.bodyStyle, "text-gray-500 mt-0.5")}>
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
              {styles.layout === 'elegant' && <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />}
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
              {styles.layout === 'elegant' && <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />}
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
              {styles.layout === 'elegant' && <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />}
              {customSection.title}
            </h2>
            {customSection.items.map((item) => (
              <div key={item.id} className={styles.layout === 'compact' ? 'mb-1' : 'mb-2'}>
                <div className="flex justify-between items-start">
                  <h3 className={cn(styles.bodyStyle, "font-bold")} style={{ color: styles.accentColor || '#1f2937' }}>{item.title}</h3>
                  {item.date && (
                    <span className={cn(styles.bodyStyle, "text-gray-500 whitespace-nowrap font-semibold")}>{item.date}</span>
                  )}
                </div>
                {customSection.showTechnologies && item.technologies && (
                  <p className={cn(styles.bodyStyle, "text-gray-500 italic mt-0.5")}>{item.technologies}</p>
                )}
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
