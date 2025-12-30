import { Resume } from "@/types/resume";
import html2pdf from "html2pdf.js";

// Helper to strip HTML tags
const stripHtml = (html: string): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

// Check if content is empty
const isEmptyContent = (content: string): boolean => {
  if (!content) return true;
  return !stripHtml(content);
};

// Template font configurations
const TEMPLATE_FONTS: Record<
  string,
  { name: string; family: string; weights: string }
> = {
  classic: { name: "Georgia", family: "serif", weights: "400;700" },
  modern: { name: "Open Sans", family: "sans-serif", weights: "400;600;700" },
  elegant: {
    name: "Playfair Display",
    family: "serif",
    weights: "400;600;700",
  },
  flat: { name: "Roboto", family: "sans-serif", weights: "400;500;700" },
  onepage: { name: "Inter", family: "sans-serif", weights: "400;500;600;700" },
  spartan: {
    name: "Montserrat",
    family: "sans-serif",
    weights: "400;600;700;900",
  },
  stackoverflow: {
    name: "Source Sans Pro",
    family: "sans-serif",
    weights: "400;600;700",
  },
  kendall: { name: "Lato", family: "sans-serif", weights: "400;700" },
  paper: { name: "Merriweather", family: "serif", weights: "400;700;900" },
  macchiato: { name: "Nunito", family: "sans-serif", weights: "400;600;700" },
  crisp: { name: "Poppins", family: "sans-serif", weights: "400;600;700;800" },
  classy: {
    name: "Cormorant Garamond",
    family: "serif",
    weights: "400;600;700",
  },
  refined: {
    name: "Quicksand",
    family: "sans-serif",
    weights: "400;500;600;700",
  },
  executive: { name: "Libre Baskerville", family: "serif", weights: "400;700" },
  nordic: {
    name: "Work Sans",
    family: "sans-serif",
    weights: "400;500;600;700",
  },
  tokyo: { name: "Noto Sans", family: "sans-serif", weights: "400;600;700" },
  fresh: { name: "DM Sans", family: "sans-serif", weights: "400;500;600;700" },
};

// Template accent colors
const TEMPLATE_COLORS: Record<string, string> = {
  classic: "#000000",
  modern: "#2563eb",
  elegant: "#9333ea",
  flat: "#111827",
  onepage: "#0d9488",
  spartan: "#1f2937",
  stackoverflow: "#ea580c",
  kendall: "#475569",
  paper: "#111827",
  macchiato: "#92400e",
  crisp: "#111827",
  classy: "#ca8a04",
  refined: "#059669",
  executive: "#1e3a8a",
  nordic: "#0d9488",
  tokyo: "#dc2626",
  fresh: "#65a30d",
};

/**
 * Export resume to PDF using browser's native print functionality.
 *
 * Benefits:
 * - Uses Chromium's native @media print (same as Puppeteer)
 * - Fonts are embedded exactly (Google Fonts)
 * - True text (ATS-safe, searchable, selectable)
 * - Perfect pagination with CSS page-break rules
 * - Small PDF size
 * - No server required
 */
export async function exportToPDF(
  resume: Resume,
  filename?: string
): Promise<void> {
  const templateId = resume.templateId || "classic";
  const fontConfig = TEMPLATE_FONTS[templateId] || TEMPLATE_FONTS.classic;
  const accentColor = TEMPLATE_COLORS[templateId] || "#000000";
  const fontFamily = `'${fontConfig.name}', ${fontConfig.family}`;
  const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${fontConfig.name.replace(
    / /g,
    "+"
  )}:wght@${fontConfig.weights}&display=swap`;

  // Get ordered sections
  const allSections = [
    ...resume.sections.filter((s) => s.type !== "custom"),
    ...(resume.customSections || []).map((cs) => ({
      id: cs.id,
      type: "custom" as const,
      title: cs.title,
      order: cs.order,
      visible: cs.visible,
    })),
  ].sort((a, b) => a.order - b.order);

  // Generate section HTML
  const generateSectionHTML = (section: (typeof allSections)[0]): string => {
    if (!section.visible) return "";

    switch (section.type) {
      case "contact":
        return `
          <header class="contact-header">
            <h1 class="name">${resume.contact.fullName || "Your Name"}</h1>
            <div class="contact-info">
              ${[
                resume.contact.email,
                resume.contact.phone,
                resume.contact.location,
              ]
                .filter(Boolean)
                .map((item) => `<span>${item}</span>`)
                .join('<span class="separator">•</span>')}
            </div>
            ${
              [resume.contact.linkedin, resume.contact.website].filter(Boolean)
                .length > 0
                ? `
              <div class="contact-links">
                ${[resume.contact.linkedin, resume.contact.website]
                  .filter(Boolean)
                  .map((item) => `<span>${item}</span>`)
                  .join('<span class="separator">•</span>')}
              </div>
            `
                : ""
            }
          </header>
        `;

      case "summary":
        if (isEmptyContent(resume.summary)) return "";
        return `
          <section class="section">
            <h2 class="section-header">Professional Summary</h2>
            <p class="summary-text">${stripHtml(resume.summary)}</p>
          </section>
        `;

      case "experience":
        if (resume.experiences.length === 0) return "";
        return `
          <section class="section">
            <h2 class="section-header">Work Experience</h2>
            ${resume.experiences
              .map(
                (exp) => `
              <div class="entry">
                <div class="entry-header">
                  <span class="entry-title">${exp.title || "Position"}</span>
                  <span class="entry-date">${exp.startDate} - ${
                  exp.current ? "Present" : exp.endDate
                }</span>
                </div>
                <div class="entry-subtitle">${exp.company}${
                  exp.location ? `, ${exp.location}` : ""
                }</div>
                <ul class="bullets">
                  ${exp.bullets
                    .filter((b) => !isEmptyContent(b))
                    .map((bullet) => `<li>${stripHtml(bullet)}</li>`)
                    .join("")}
                </ul>
              </div>
            `
              )
              .join("")}
          </section>
        `;

      case "education":
        if (resume.education.length === 0) return "";
        return `
          <section class="section">
            <h2 class="section-header">Education</h2>
            ${resume.education
              .map((edu) => {
                const batch =
                  edu.batchStart && edu.batchEnd
                    ? `${edu.batchStart} - ${edu.batchEnd}`
                    : edu.batchStart || edu.batchEnd || "";
                return `
                <div class="entry">
                  <div class="entry-header">
                    <span class="entry-title">${edu.degree || "Degree"}</span>
                    ${batch ? `<span class="entry-date">${batch}</span>` : ""}
                  </div>
                  <div class="entry-subtitle">${edu.institution}${
                  edu.location ? `, ${edu.location}` : ""
                }</div>
                  ${
                    edu.gpa || !isEmptyContent(edu.honors || "")
                      ? `
                    <div class="entry-details">
                      ${edu.gpa ? `GPA: ${edu.gpa}` : ""}
                      ${
                        edu.gpa && !isEmptyContent(edu.honors || "")
                          ? " | "
                          : ""
                      }
                      ${
                        !isEmptyContent(edu.honors || "")
                          ? stripHtml(edu.honors || "")
                          : ""
                      }
                    </div>
                  `
                      : ""
                  }
                </div>
              `;
              })
              .join("")}
          </section>
        `;

      case "skills":
        if (resume.skills.length === 0) return "";
        const skillsByCategory = resume.skills.reduce((acc, skill) => {
          const category = skill.category || "Other";
          if (!acc[category]) acc[category] = [];
          acc[category].push(skill.name);
          return acc;
        }, {} as Record<string, string[]>);

        return `
          <section class="section">
            <h2 class="section-header">Skills</h2>
            <div class="skills-container">
              ${Object.entries(skillsByCategory)
                .map(
                  ([category, items]) => `
                <div class="skill-row">
                  <span class="skill-category">${category}:</span>
                  <span class="skill-items">${items
                    .filter(Boolean)
                    .join(", ")}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </section>
        `;

      case "certifications":
        if (resume.certifications.length === 0) return "";
        return `
          <section class="section">
            <h2 class="section-header">Certifications</h2>
            ${resume.certifications
              .map(
                (cert) => `
              <div class="cert-entry">
                <span class="cert-name">${cert.name || "Certification"}</span>
                <span class="cert-details">${cert.issuer}${
                  cert.date ? ` • ${cert.date}` : ""
                }</span>
              </div>
            `
              )
              .join("")}
          </section>
        `;

      case "custom":
        const customSection = (resume.customSections || []).find(
          (cs) => cs.id === section.id
        );
        if (!customSection || customSection.items.length === 0) return "";
        return `
          <section class="section">
            <h2 class="section-header">${customSection.title}</h2>
            ${customSection.items
              .map(
                (item) => `
              <div class="entry">
                <div class="entry-header">
                  <span class="entry-title">${item.title || "Item"}</span>
                  ${
                    item.date
                      ? `<span class="entry-date">${item.date}</span>`
                      : ""
                  }
                </div>
                ${
                  customSection.showTechnologies && item.technologies
                    ? `
                  <div class="entry-tech">${item.technologies}</div>
                `
                    : ""
                }
                <ul class="bullets">
                  ${item.bullets
                    .filter((b) => !isEmptyContent(b))
                    .map((bullet) => `<li>${stripHtml(bullet)}</li>`)
                    .join("")}
                </ul>
              </div>
            `
              )
              .join("")}
          </section>
        `;

      default:
        return "";
    }
  };

  // Generate CSS styles
  const styles = `
    /* Print-optimized CSS */
    @page {
      size: A4;
      margin: 15mm;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      font-family: ${fontFamily};
      font-size: 11pt;
      line-height: 1.4;
      color: #000000;
      background: white;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .resume {
      width: 100%;
      max-width: 210mm;
      margin: 0 auto;
      padding: 0;
    }

    /* Contact Header */
    .contact-header {
      text-align: center;
      padding-bottom: 12pt;
      margin-bottom: 12pt;
      border-bottom: 2px solid ${accentColor};
      break-inside: avoid;
    }

    .name {
      font-size: 22pt;
      font-weight: 700;
      color: ${accentColor};
      margin-bottom: 6pt;
      break-after: avoid;
    }

    .contact-info, .contact-links {
      font-size: 10pt;
      color: #555555;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 4pt;
    }

    .contact-links {
      margin-top: 4pt;
    }

    .separator {
      margin: 0 6pt;
      color: #999999;
    }

    /* Sections */
    .section {
      margin-bottom: 14pt;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .section-header {
      font-size: 12pt;
      font-weight: 700;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 0.5pt;
      padding-bottom: 4pt;
      margin-bottom: 8pt;
      border-bottom: 1px solid ${accentColor};
      break-after: avoid;
      page-break-after: avoid;
    }

    /* Entries (Experience, Education, Custom) */
    .entry {
      margin-bottom: 10pt;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .entry:last-child {
      margin-bottom: 0;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2pt;
      break-after: avoid;
    }

    .entry-title {
      font-weight: 700;
      color: ${accentColor};
      font-size: 11pt;
    }

    .entry-date {
      font-weight: 600;
      color: #333333;
      font-size: 10pt;
      white-space: nowrap;
    }

    .entry-subtitle {
      color: #555555;
      font-size: 10pt;
      margin-bottom: 4pt;
    }

    .entry-tech {
      font-style: italic;
      color: #666666;
      font-size: 10pt;
      margin-bottom: 4pt;
    }

    .entry-details {
      font-size: 10pt;
      color: #555555;
    }

    /* Bullets */
    .bullets {
      list-style: none;
      padding-left: 0;
    }

    .bullets li {
      position: relative;
      padding-left: 12pt;
      margin-bottom: 3pt;
      font-size: 10pt;
      line-height: 1.4;
    }

    .bullets li:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #333333;
    }

    .bullets li:last-child {
      margin-bottom: 0;
    }

    /* Summary */
    .summary-text {
      font-size: 10pt;
      line-height: 1.5;
      color: #333333;
    }

    /* Skills */
    .skills-container {
      display: flex;
      flex-direction: column;
      gap: 4pt;
    }

    .skill-row {
      display: flex;
      flex-wrap: wrap;
      font-size: 10pt;
      line-height: 1.4;
    }

    .skill-category {
      font-weight: 700;
      color: ${accentColor};
      margin-right: 6pt;
    }

    .skill-items {
      color: #333333;
    }

    /* Certifications */
    .cert-entry {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4pt;
      font-size: 10pt;
    }

    .cert-entry:last-child {
      margin-bottom: 0;
    }

    .cert-name {
      font-weight: 700;
      color: ${accentColor};
    }

    .cert-details {
      color: #555555;
    }

    /* Print-specific rules to prevent cut-offs */
    @media print {
      html, body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .section {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      .entry {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      .section-header {
        break-after: avoid !important;
        page-break-after: avoid !important;
      }

      .entry-header {
        break-after: avoid !important;
        page-break-after: avoid !important;
      }

      h1, h2, h3 {
        break-after: avoid !important;
        page-break-after: avoid !important;
      }
    }
  `;

  // Generate HTML content
  const htmlContent = `
    <div class="resume" style="font-family: ${fontFamily}; font-size: 11pt; line-height: 1.4; color: #000000; background: white; width: 100%; max-width: 210mm; margin: 0 auto; padding: 0;">
      ${allSections.map((section) => generateSectionHTML(section)).join("")}
    </div>
  `;

  // Load Google Fonts dynamically
  const linkElement = document.createElement("link");
  linkElement.href = googleFontsUrl;
  linkElement.rel = "stylesheet";
  document.head.appendChild(linkElement);

  // Create a temporary container to render the HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  tempDiv.style.position = "fixed";
  tempDiv.style.left = "-9999px";
  tempDiv.style.top = "0";
  tempDiv.style.width = "210mm";
  tempDiv.style.backgroundColor = "white";
  document.body.appendChild(tempDiv);

  // Add styles to the page
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);

  // Wait for fonts to load
  await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Configure html2pdf options
  const opt = {
    margin: [15, 15, 15, 15], // top, right, bottom, left in mm
    filename: `${filename || resume.contact.fullName || "resume"}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: true,
    },
    pagebreak: {
      mode: ["avoid-all", "css", "legacy"],
      avoid: [".section", ".entry", ".section-header", ".entry-header"],
    },
  };

  // Get the actual resume element
  const resumeElement = tempDiv.querySelector(".resume") as HTMLElement;
  if (!resumeElement) {
    throw new Error("Failed to render resume content");
  }

  // Generate and download PDF
  try {
    await html2pdf().set(opt).from(resumeElement).save();
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
    document.head.removeChild(styleElement);
    document.head.removeChild(linkElement);
  }
}

export function exportToText(resume: Resume): string {
  const lines: string[] = [];

  // Header
  lines.push(resume.contact.fullName || "Your Name");
  const contactLine = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location,
  ]
    .filter(Boolean)
    .join(" | ");
  if (contactLine) lines.push(contactLine);
  if (resume.contact.linkedin) lines.push(resume.contact.linkedin);
  if (resume.contact.website) lines.push(resume.contact.website);
  lines.push("");

  // Summary
  if (!isEmptyContent(resume.summary)) {
    lines.push("PROFESSIONAL SUMMARY");
    lines.push("-".repeat(40));
    lines.push(stripHtml(resume.summary));
    lines.push("");
  }

  // Experience
  if (resume.experiences.length > 0) {
    lines.push("WORK EXPERIENCE");
    lines.push("-".repeat(40));
    resume.experiences.forEach((exp) => {
      lines.push(`${exp.title} | ${exp.company}`);
      lines.push(
        `${exp.startDate} - ${exp.current ? "Present" : exp.endDate}${
          exp.location ? ` | ${exp.location}` : ""
        }`
      );
      exp.bullets
        .filter((b) => !isEmptyContent(b))
        .forEach((bullet) => {
        lines.push(`  • ${stripHtml(bullet)}`);
      });
      lines.push("");
    });
  }

  // Education
  if (resume.education.length > 0) {
    lines.push("EDUCATION");
    lines.push("-".repeat(40));
    resume.education.forEach((edu) => {
      lines.push(edu.degree);
      const batch =
        edu.batchStart && edu.batchEnd
          ? `${edu.batchStart} - ${edu.batchEnd}`
          : edu.batchStart || edu.batchEnd || "";
      lines.push(
        `${edu.institution}${edu.location ? `, ${edu.location}` : ""}${
          batch ? ` | ${batch}` : ""
        }`
      );
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
      if (!isEmptyContent(edu.honors || ""))
        lines.push(stripHtml(edu.honors || ""));
      lines.push("");
    });
  }

  // Skills - grouped by category
  if (resume.skills.length > 0) {
    lines.push("SKILLS");
    lines.push("-".repeat(40));
    const skillsByCategory = resume.skills.reduce((acc, skill) => {
      const category = skill.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill.name);
      return acc;
    }, {} as Record<string, string[]>);

    Object.entries(skillsByCategory).forEach(([category, items]) => {
      lines.push(`${category}: ${items.filter(Boolean).join(", ")}`);
    });
    lines.push("");
  }

  // Certifications
  if (resume.certifications.length > 0) {
    lines.push("CERTIFICATIONS");
    lines.push("-".repeat(40));
    resume.certifications.forEach((cert) => {
      lines.push(`${cert.name} - ${cert.issuer} (${cert.date})`);
    });
    lines.push("");
  }

  // Custom Sections
  if (resume.customSections && resume.customSections.length > 0) {
    resume.customSections.forEach((section) => {
      lines.push(section.title.toUpperCase());
      lines.push("-".repeat(40));
      section.items.forEach((item) => {
        let titleLine = item.title;
        if (section.showTechnologies && item.technologies) {
          titleLine += ` (${item.technologies})`;
        }
        if (item.date) titleLine += ` | ${item.date}`;
        lines.push(titleLine);
        item.bullets
          .filter((b) => !isEmptyContent(b))
          .forEach((bullet) => {
          lines.push(`  • ${stripHtml(bullet)}`);
        });
        lines.push("");
      });
    });
  }

  return lines.join("\n");
}
