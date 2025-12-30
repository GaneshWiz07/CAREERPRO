import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaginatedPreviewProps {
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
  layout: 'classic' | 'modern' | 'compact' | 'elegant' | 'flat' | 'spartan' | 'stackoverflow' | 'kendall' | 'paper' | 'macchiato' | 'crisp' | 'classy' | 'refined' | 'executive' | 'nordic' | 'tokyo' | 'fresh' | 'aurora' | 'berlin' | 'cambridge' | 'dubai' | 'ember' | 'fortune' | 'glacier' | 'harmony' | 'iconic' | 'jasper';
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
  // 10 New Templates
  aurora: {
    fontFamily: "'Outfit', sans-serif",
    headerStyle: "text-center border-b-2 border-violet-500 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-semibold uppercase tracking-wide text-violet-600 border-b border-violet-200 pb-1 mb-2",
    nameStyle: "text-2xl font-bold text-violet-800 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#7c3aed',
    layout: 'aurora',
  },
  berlin: {
    fontFamily: "'Oswald', sans-serif",
    headerStyle: "text-center border-b-4 border-gray-800 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-bold uppercase tracking-widest text-gray-800 bg-gray-100 px-2 py-1 mb-2",
    nameStyle: "text-3xl font-bold uppercase tracking-wide text-gray-900 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#1f2937',
    layout: 'berlin',
  },
  cambridge: {
    fontFamily: "'EB Garamond', serif",
    headerStyle: "text-center border-b-2 border-green-800 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-semibold uppercase tracking-wide text-green-800 border-b border-green-300 pb-1 mb-2",
    nameStyle: "text-2xl font-bold text-green-900 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#166534',
    layout: 'cambridge',
  },
  dubai: {
    fontFamily: "'Bodoni Moda', serif",
    headerStyle: "text-center border-b-2 border-yellow-500 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-semibold uppercase tracking-wide text-yellow-700 border-b border-yellow-300 pb-1 mb-2",
    nameStyle: "text-2xl font-bold text-gray-900 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#b45309',
    layout: 'dubai',
  },
  ember: {
    fontFamily: "'Rubik', sans-serif",
    headerStyle: "text-center border-b-2 border-rose-400 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-semibold uppercase tracking-wide text-rose-600 border-b border-rose-200 pb-1 mb-2",
    nameStyle: "text-2xl font-bold text-rose-700 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#e11d48',
    layout: 'ember',
  },
  fortune: {
    fontFamily: "'Crimson Pro', serif",
    headerStyle: "text-center border-b-2 border-rose-900 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-semibold uppercase tracking-wide text-rose-900 border-b border-rose-300 pb-1 mb-2",
    nameStyle: "text-2xl font-bold text-rose-900 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#881337',
    layout: 'fortune',
  },
  glacier: {
    fontFamily: "'Cabin', sans-serif",
    headerStyle: "text-center border-b-2 border-cyan-500 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-semibold uppercase tracking-wide text-cyan-700 border-b border-cyan-200 pb-1 mb-2",
    nameStyle: "text-2xl font-bold text-cyan-800 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#0891b2',
    layout: 'glacier',
  },
  harmony: {
    fontFamily: "'Karla', sans-serif",
    headerStyle: "text-center border-b border-purple-400 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-semibold uppercase tracking-wide text-purple-600 border-b border-purple-200 pb-1 mb-2",
    nameStyle: "text-2xl font-bold text-purple-800 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#9333ea',
    layout: 'harmony',
  },
  iconic: {
    fontFamily: "'Barlow', sans-serif",
    headerStyle: "text-center border-b-4 border-yellow-400 pb-4 mb-4 bg-gray-900 -mx-10 -mt-10 px-10 pt-10",
    sectionHeaderStyle: "text-sm font-bold uppercase tracking-widest text-gray-900 bg-yellow-400 px-2 py-1 mb-2 inline-block",
    nameStyle: "text-3xl font-black text-yellow-400 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#eab308',
    layout: 'iconic',
  },
  jasper: {
    fontFamily: "'Josefin Sans', sans-serif",
    headerStyle: "text-center border-b-2 border-orange-700 pb-4 mb-4",
    sectionHeaderStyle: "text-sm font-semibold uppercase tracking-wide text-orange-800 border-b border-orange-300 pb-1 mb-2",
    nameStyle: "text-2xl font-semibold text-orange-900 mb-1",
    bodyStyle: "text-sm leading-relaxed",
    accentColor: '#c2410c',
    layout: 'jasper',
  },
};

// Check if content is empty
const isEmptyContent = (content: string): boolean => {
  if (!content) return true;
  const stripped = content.replace(/<[^>]*>/g, '').trim();
  return !stripped || stripped === '';
};

// Render HTML content - handles lists and inline formatting
const RenderHtml = ({ html, className }: { html: string; className?: string }) => {
  const hasList = /<[uo]l>/.test(html);

  if (hasList) {
    return (
      <div
        className={cn("formatted-list", className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

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

// A4 dimensions in pixels at 96 DPI
const PAGE_HEIGHT = 1122; // ~297mm
const PAGE_WIDTH = 794; // ~210mm
const PADDING = 40; // Page padding
const CONTENT_HEIGHT = PAGE_HEIGHT - (PADDING * 2); // Usable content height per page

export function PaginatedPreview({ resume, showHeatmap = false, className }: PaginatedPreviewProps) {
  // Get template styles based on selected template
  const templateId = resume.templateId || 'classic';
  const styles = TEMPLATE_STYLES[templateId] || TEMPLATE_STYLES.classic;
  const { contact, summary, experiences, education, skills, certifications, customSections = [] } = resume;
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(0.7);
  const measureRef = useRef<HTMLDivElement>(null);

  // Adjust default zoom based on screen width
  useEffect(() => {
    const updateZoomForScreenSize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setZoom(0.4);
      } else if (width < 640) {
        setZoom(0.5);
      } else if (width < 768) {
        setZoom(0.55);
      } else {
        setZoom(0.7);
      }
    };
    updateZoomForScreenSize();
    window.addEventListener('resize', updateZoomForScreenSize);
    return () => window.removeEventListener('resize', updateZoomForScreenSize);
  }, []);

  // Calculate total pages based on content height
  const calculatePages = useCallback(() => {
    if (measureRef.current) {
      const contentHeight = measureRef.current.scrollHeight;
      const pages = Math.ceil(contentHeight / CONTENT_HEIGHT);
      setTotalPages(Math.max(1, pages));
    }
  }, []);

  useEffect(() => {
    // Use setTimeout to ensure DOM is rendered before measuring
    const timer = setTimeout(calculatePages, 100);
    return () => clearTimeout(timer);
  }, [resume, calculatePages]);

  useEffect(() => {
    window.addEventListener('resize', calculatePages);
    return () => window.removeEventListener('resize', calculatePages);
  }, [calculatePages]);

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

  const renderSection = (sectionType: string, sectionId?: string) => {
    switch (sectionType) {
      case 'contact':
        // Spartan style - dark banner header
        if (styles.layout === 'spartan') {
          return (
            <header key="contact" className={styles.headerStyle}>
              <div className="bg-gray-900 px-4 py-4 -mx-10 -mt-10 mb-4">
                {contact.profilePicture && (
                  <div className="flex justify-center mb-3">
                    <img
                      src={contact.profilePicture}
                      alt={contact.fullName || 'Profile'}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                    />
                  </div>
                )}
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

        // Compact/OnePage style - left-aligned with optional photo
        if (styles.layout === 'compact') {
          return (
            <header key="contact" className={styles.headerStyle}>
              <div className="flex items-center gap-3">
                {contact.profilePicture && (
                  <img
                    src={contact.profilePicture}
                    alt={contact.fullName || 'Profile'}
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                )}
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

        // Default centered style with template-specific colors
        return (
          <header key="contact" className={styles.headerStyle}>
            {contact.profilePicture && (
              <div className="flex justify-center mb-3">
                <img
                  src={contact.profilePicture}
                  alt={contact.fullName || 'Profile'}
                  className="w-20 h-20 rounded-full object-cover border-2"
                  style={{ borderColor: styles.accentColor || '#e5e7eb' }}
                />
              </div>
            )}
            <h1 className={styles.nameStyle} style={{ color: styles.accentColor || '#1f2937' }}>
              {contact.fullName || 'Your Name'}
            </h1>
            <div className="text-sm flex flex-wrap justify-center gap-2" style={{ color: styles.accentColor ? styles.accentColor : '#4b5563' }}>
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

  const resumeContentStyles = `
    .resume-content strong, .resume-content b { font-weight: bold; }
    .resume-content em, .resume-content i { font-style: italic; }
    .resume-content u { text-decoration: underline; }
    .resume-content s { text-decoration: line-through; }
    .resume-content a { color: inherit; text-decoration: underline; }
    .resume-content .formatted-list ul { list-style-type: disc; margin-left: 1rem; }
    .resume-content .formatted-list ol { list-style-type: decimal; margin-left: 1rem; }
    .resume-content .formatted-list li { margin: 0.125rem 0; }
    .resume-content .formatted-list p { margin: 0; display: inline; }
  `;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Preview Notice */}
      <Alert className="mb-3 sm:mb-4 mx-4 sm:mx-0 max-w-xl border-primary/30 bg-primary/5">
        <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
        <AlertDescription className="text-xs sm:text-sm">
          <strong>Preview Mode:</strong> <span className="hidden sm:inline">This is a visual preview. The exported PDF uses optimized formatting
          for ATS compatibility and may have slight layout differences.</span>
          <span className="sm:hidden">Visual preview only. PDF may differ slightly.</span>
        </AlertDescription>
      </Alert>

      {/* Controls */}
      <div className="sticky top-0 z-10 flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 bg-muted/80 backdrop-blur rounded-lg px-2 sm:px-4 py-1.5 sm:py-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}
            className="h-7 w-7 sm:h-8 sm:w-8"
          >
            <ZoomOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          <span className="text-xs sm:text-sm w-12 sm:w-16 text-center">{Math.round(zoom * 100)}%</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(Math.min(1.2, zoom + 0.1))}
            className="h-7 w-7 sm:h-8 sm:w-8"
          >
            <ZoomIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>

        <div className="h-5 sm:h-6 w-px bg-border" />

        <span className="text-xs sm:text-sm text-muted-foreground">
          {totalPages} {totalPages === 1 ? 'page' : 'pages'}
        </span>
      </div>

      {/* Hidden measurement container */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none"
        style={{
          width: PAGE_WIDTH - (PADDING * 2),
          left: '-9999px',
        }}
      >
        <div className="resume-content text-sm leading-relaxed" style={{ fontFamily: styles.fontFamily }}>
          <style>{resumeContentStyles}</style>
          {allSections.filter(s => s.visible).map((section) =>
            renderSection(section.type, section.id)
          )}
        </div>
      </div>

      {/* Scrollable Pages Container */}
      <div
        className="relative overflow-auto bg-muted/30 rounded-lg p-3 sm:p-6 md:p-8 w-full"
        style={{
          maxHeight: 'calc(100vh - 200px)',
        }}
      >
        {/* Stacked Pages View */}
        <div className="flex flex-col gap-4 sm:gap-6 items-center">
          {Array.from({ length: totalPages }, (_, pageIndex) => (
            <div
              key={pageIndex}
              className="relative bg-white shadow-xl sm:shadow-2xl rounded-sm mx-auto"
              style={{
                width: PAGE_WIDTH * zoom,
                height: PAGE_HEIGHT * zoom,
                transformOrigin: 'top center',
              }}
            >
              {/* Page number badge */}
              <div className="absolute -top-2.5 sm:-top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full z-10">
                Page {pageIndex + 1}
              </div>

              {/* Page wrapper with scaling */}
              <div
                style={{
                  width: PAGE_WIDTH,
                  height: PAGE_HEIGHT,
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Content area with padding - this creates the margin effect */}
                <div
                  id={pageIndex === 0 ? "resume-preview" : undefined}
                  className="resume-content text-sm leading-relaxed bg-white"
                  style={{
                    fontFamily: styles.fontFamily,
                    padding: `${PADDING}px`,
                    width: PAGE_WIDTH,
                    height: PAGE_HEIGHT,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <style>{resumeContentStyles}</style>

                  {/* Inner content container that scrolls/offsets for pagination */}
                  <div
                    style={{
                      position: 'relative',
                      marginTop: -(pageIndex * CONTENT_HEIGHT),
                    }}
                  >
                    {allSections.filter(s => s.visible).map((section) =>
                      renderSection(section.type, section.id)
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}