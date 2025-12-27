import React from 'react';
import { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';

interface ResumePreviewProps {
  resume: Resume;
  showHeatmap?: boolean;
  className?: string;
}

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

  return (
    <div className={cn("relative bg-card border border-border rounded-lg shadow-sm", className)}>
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
      
      <div id="resume-preview" className="p-8 font-serif text-sm leading-relaxed resume-content" style={{ fontFamily: 'Georgia, serif' }}>
        {/* Header / Contact */}
        <header className="text-center border-b border-border pb-4 mb-4">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {contact.fullName || 'Your Name'}
          </h1>
          <div className="text-xs text-muted-foreground flex flex-wrap justify-center gap-2">
            {contact.email && <span>{contact.email}</span>}
            {contact.phone && <span>• {contact.phone}</span>}
            {contact.location && <span>• {contact.location}</span>}
          </div>
          <div className="text-xs text-muted-foreground flex flex-wrap justify-center gap-2 mt-1">
            {contact.linkedin && <span>{contact.linkedin}</span>}
            {contact.website && <span>• {contact.website}</span>}
          </div>
        </header>

        {/* Summary */}
        {!isEmptyContent(summary) && (
          <section className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground border-b border-border pb-1 mb-2">
              Professional Summary
            </h2>
            <div className="text-xs text-foreground leading-relaxed">
              <RenderHtml html={summary} />
            </div>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground border-b border-border pb-1 mb-2">
              Work Experience
            </h2>
            {experiences.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-foreground">{exp.title || 'Position'}</h3>
                    <p className="text-xs text-muted-foreground">{exp.company}{exp.location && `, ${exp.location}`}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap font-bold">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bullets.filter(b => !isEmptyContent(b)).length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.bullets.filter(b => !isEmptyContent(b)).map((bullet, idx) => (
                      <li key={idx} className="text-xs text-foreground flex">
                        <span className="mr-2">•</span>
                        <RenderHtml html={bullet} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground border-b border-border pb-1 mb-2">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-foreground">
                      {edu.degree}
                    </h3>
                    <p className="text-xs text-muted-foreground">{edu.institution}{edu.location && `, ${edu.location}`}</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-bold">
                    {edu.batchStart && edu.batchEnd ? `${edu.batchStart} - ${edu.batchEnd}` : edu.batchStart || edu.batchEnd}
                  </span>
                </div>
                {(edu.gpa || edu.honors) && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {edu.gpa && `GPA: ${edu.gpa}`}
                    {edu.gpa && edu.honors && ' | '}
                    {edu.honors}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground border-b border-border pb-1 mb-2">
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
                <p key={category} className="text-xs text-foreground">
                  <span className="font-semibold">{category}:</span>{' '}
                  {items.filter(Boolean).join(', ')}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground border-b border-border pb-1 mb-2">
              Certifications
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between text-xs mb-1">
                <span className="font-medium text-foreground">{cert.name}</span>
                <span className="text-muted-foreground">{cert.issuer} • {cert.date}</span>
              </div>
            ))}
          </section>
        )}

        {/* Custom Sections */}
        {customSections.map((section) => (
          <section key={section.id} className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground border-b border-border pb-1 mb-2">
              {section.title}
            </h2>
            {section.items.map((item) => (
              <div key={item.id} className="mb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-baseline gap-4 flex-1">
                    <h3 className="text-xs font-bold text-foreground uppercase">{item.title}</h3>
                    {item.technologies && (
                      <span className="text-xs text-muted-foreground italic">{item.technologies}</span>
                    )}
                  </div>
                  {item.date && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap font-bold">{item.date}</span>
                  )}
                </div>
                {item.bullets.filter(b => !isEmptyContent(b)).length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {item.bullets.filter(b => !isEmptyContent(b)).map((bullet, idx) => (
                      <li key={idx} className="text-xs text-foreground flex">
                        <span className="mr-2">•</span>
                        <RenderHtml html={bullet} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
