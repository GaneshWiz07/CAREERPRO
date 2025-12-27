import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface PaginatedPreviewProps {
  resume: Resume;
  showHeatmap?: boolean;
  className?: string;
}

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
  const { contact, summary, experiences, education, skills, certifications, customSections = [] } = resume;
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(0.7);
  const measureRef = useRef<HTMLDivElement>(null);

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
        return (
          <header key="contact" className="text-center border-b border-gray-300 pb-4 mb-4">
            <h1 className="text-2xl font-bold text-black mb-1">
              {contact.fullName || 'Your Name'}
            </h1>
            <div className="text-xs text-gray-600 flex flex-wrap justify-center gap-2">
              {contact.email && <span>{contact.email}</span>}
              {contact.phone && <span>• {contact.phone}</span>}
              {contact.location && <span>• {contact.location}</span>}
            </div>
            <div className="text-xs text-gray-600 flex flex-wrap justify-center gap-2 mt-1">
              {contact.linkedin && <span>{contact.linkedin}</span>}
              {contact.website && <span>• {contact.website}</span>}
            </div>
          </header>
        );

      case 'summary':
        if (isEmptyContent(summary)) return null;
        return (
          <section key="summary" className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-black border-b border-gray-300 pb-1 mb-2">
              Professional Summary
            </h2>
            <div className="text-xs text-black leading-relaxed">
              <RenderHtml html={summary} />
            </div>
          </section>
        );

      case 'experience':
        if (experiences.length === 0) return null;
        return (
          <section key="experience" className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-black border-b border-gray-300 pb-1 mb-2">
              Work Experience
            </h2>
            {experiences.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-black">{exp.title || 'Position'}</h3>
                    <p className="text-xs text-gray-600">{exp.company}{exp.location && `, ${exp.location}`}</p>
                  </div>
                  <span className="text-xs text-gray-600 whitespace-nowrap font-bold">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bullets.filter(b => !isEmptyContent(b)).length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.bullets.filter(b => !isEmptyContent(b)).map((bullet, idx) => (
                      <li key={idx} className="text-xs text-black flex">
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
          <section key="education" className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-black border-b border-gray-300 pb-1 mb-2">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-black">{edu.degree}</h3>
                    <p className="text-xs text-gray-600">{edu.institution}{edu.location && `, ${edu.location}`}</p>
                  </div>
                  <span className="text-xs text-gray-600 font-bold">
                    {edu.batchStart && edu.batchEnd ? `${edu.batchStart} - ${edu.batchEnd}` : edu.batchStart || edu.batchEnd}
                  </span>
                </div>
                {(edu.gpa || (edu.honors && !isEmptyContent(edu.honors))) && (
                  <div className="text-xs text-gray-600 mt-0.5">
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
          <section key="skills" className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-black border-b border-gray-300 pb-1 mb-2">
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
                <p key={category} className="text-xs text-black">
                  <span className="font-semibold">{category}:</span>{' '}
                  {items.filter(Boolean).join(', ')}
                </p>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        if (certifications.length === 0) return null;
        return (
          <section key="certifications" className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-black border-b border-gray-300 pb-1 mb-2">
              Certifications
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between text-xs mb-1">
                <span className="font-medium text-black">{cert.name}</span>
                <span className="text-gray-600">{cert.issuer} • {cert.date}</span>
              </div>
            ))}
          </section>
        );

      case 'custom':
        const customSection = customSections.find(cs => cs.id === sectionId);
        if (!customSection || customSection.items.length === 0) return null;
        return (
          <section key={customSection.id} className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-black border-b border-gray-300 pb-1 mb-2">
              {customSection.title}
            </h2>
            {customSection.items.map((item) => (
              <div key={item.id} className="mb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-baseline gap-4 flex-1">
                    <h3 className="text-xs font-bold text-black">{item.title}</h3>
                    {customSection.showTechnologies && item.technologies && (
                      <span className="text-xs text-gray-600 italic">{item.technologies}</span>
                    )}
                  </div>
                  {item.date && (
                    <span className="text-xs text-gray-600 whitespace-nowrap font-bold">{item.date}</span>
                  )}
                </div>
                {item.bullets.filter(b => !isEmptyContent(b)).length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {item.bullets.filter(b => !isEmptyContent(b)).map((bullet, idx) => (
                      <li key={idx} className="text-xs text-black flex">
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
      {/* Controls */}
      <div className="sticky top-0 z-10 flex items-center gap-4 mb-6 bg-muted/80 backdrop-blur rounded-lg px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(Math.max(0.4, zoom - 0.1))}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm w-16 text-center">{Math.round(zoom * 100)}%</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(Math.min(1.2, zoom + 0.1))}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        <span className="text-sm text-muted-foreground">
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
        <div className="resume-content font-serif text-sm leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
          <style>{resumeContentStyles}</style>
          {allSections.filter(s => s.visible).map((section) => 
            renderSection(section.type, section.id)
          )}
        </div>
      </div>

      {/* Scrollable Pages Container */}
      <div 
        className="relative overflow-auto bg-muted/30 rounded-lg p-8"
        style={{ 
          maxHeight: 'calc(100vh - 200px)',
        }}
      >
        {/* Stacked Pages View */}
        <div className="flex flex-col gap-6 items-center">
          {Array.from({ length: totalPages }, (_, pageIndex) => (
            <div
              key={pageIndex}
              className="relative bg-white shadow-2xl rounded-sm"
              style={{
                width: PAGE_WIDTH * zoom,
                height: PAGE_HEIGHT * zoom,
                transformOrigin: 'top center',
              }}
            >
              {/* Page number badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full z-10">
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
                  className="resume-content font-serif text-sm leading-relaxed bg-white"
                  style={{ 
                    fontFamily: 'Georgia, serif',
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