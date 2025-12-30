import type { Handler, HandlerEvent } from "@netlify/functions";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ResumeData = any;

const TEMPLATE_FONTS: Record<string, { name: string; family: string; weights: number[] }> = {
  classic: { name: "Georgia", family: "serif", weights: [400, 700] },
  modern: { name: "Open Sans", family: "sans-serif", weights: [400, 600, 700] },
  elegant: { name: "Playfair Display", family: "serif", weights: [400, 600, 700] },
  flat: { name: "Roboto", family: "sans-serif", weights: [400, 500, 700] },
  onepage: { name: "Inter", family: "sans-serif", weights: [400, 500, 600, 700] },
  spartan: { name: "Montserrat", family: "sans-serif", weights: [400, 600, 700, 900] },
  stackoverflow: { name: "Source Sans Pro", family: "sans-serif", weights: [400, 600, 700] },
  kendall: { name: "Lato", family: "sans-serif", weights: [400, 700] },
  paper: { name: "Merriweather", family: "serif", weights: [400, 700, 900] },
  macchiato: { name: "Nunito", family: "sans-serif", weights: [400, 600, 700] },
  crisp: { name: "Poppins", family: "sans-serif", weights: [400, 600, 700, 800] },
  classy: { name: "Cormorant Garamond", family: "serif", weights: [400, 600, 700] },
  refined: { name: "Quicksand", family: "sans-serif", weights: [400, 500, 600, 700] },
  executive: { name: "Libre Baskerville", family: "serif", weights: [400, 700] },
  nordic: { name: "Work Sans", family: "sans-serif", weights: [400, 500, 600, 700] },
  tokyo: { name: "Noto Sans", family: "sans-serif", weights: [400, 600, 700] },
  fresh: { name: "DM Sans", family: "sans-serif", weights: [400, 500, 600, 700] },
};

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

const stripHtml = (html: string): string => (html || "").replace(/<[^>]*>/g, "").trim();
const isEmptyContent = (content: string): boolean => !stripHtml(content);

const googleFontsUrlForTemplate = (templateId: string) => {
  const font = TEMPLATE_FONTS[templateId] || TEMPLATE_FONTS.classic;
  const name = font.name.replace(/ /g, "+");
  const weights = font.weights.join(";");
  return `https://fonts.googleapis.com/css2?family=${name}:wght@${weights}&display=swap`;
};

const generateHtml = (resume: ResumeData) => {
  const templateId = resume?.templateId || "classic";
  const font = TEMPLATE_FONTS[templateId] || TEMPLATE_FONTS.classic;
  const accent = TEMPLATE_COLORS[templateId] || "#000000";
  const fontFamily = `'${font.name}', ${font.family}`;
  const fontsUrl = googleFontsUrlForTemplate(templateId);

  const allSections = [
    ...(resume.sections || []).filter((s: any) => s.type !== "custom"),
    ...((resume.customSections || []) as any[]).map((cs: any) => ({
      id: cs.id,
      type: "custom",
      title: cs.title,
      order: cs.order,
      visible: cs.visible,
    })),
  ].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

  const contact = resume.contact || {};

  const sectionHtml = (section: any): string => {
    if (!section?.visible) return "";

    switch (section.type) {
      case "contact": {
        const contactParts = [contact.email, contact.phone, contact.location].filter(Boolean);
        const linkParts = [contact.linkedin, contact.website].filter(Boolean);
        return `
          <header class="contact-header">
            <h1 class="name">${contact.fullName || "Your Name"}</h1>
            ${contactParts.length ? `<div class="contact-info">${contactParts.map((x: string) => `<span>${x}</span>`).join('<span class="separator">•</span>')}</div>` : ""}
            ${linkParts.length ? `<div class="contact-links">${linkParts.map((x: string) => `<span>${x}</span>`).join('<span class="separator">•</span>')}</div>` : ""}
          </header>
        `;
      }
      case "summary": {
        if (isEmptyContent(resume.summary)) return "";
        return `
          <section class="section">
            <h2 class="section-header">Professional Summary</h2>
            <p class="summary-text">${stripHtml(resume.summary)}</p>
          </section>
        `;
      }
      case "experience": {
        const exps = resume.experiences || [];
        if (!exps.length) return "";
        return `
          <section class="section">
            <h2 class="section-header">Work Experience</h2>
            ${exps
              .map(
                (exp: any) => `
              <div class="entry">
                <div class="entry-header">
                  <span class="entry-title">${exp.title || "Position"}</span>
                  <span class="entry-date">${exp.startDate || ""} - ${exp.current ? "Present" : exp.endDate || ""}</span>
                </div>
                <div class="entry-subtitle">${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}</div>
                <ul class="bullets">
                  ${(exp.bullets || [])
                    .filter((b: string) => !isEmptyContent(b))
                    .map((b: string) => `<li>${stripHtml(b)}</li>`)
                    .join("")}
                </ul>
              </div>
            `
              )
              .join("")}
          </section>
        `;
      }
      case "education": {
        const edus = resume.education || [];
        if (!edus.length) return "";
        return `
          <section class="section">
            <h2 class="section-header">Education</h2>
            ${edus
              .map((edu: any) => {
                const batch =
                  edu.batchStart && edu.batchEnd ? `${edu.batchStart} - ${edu.batchEnd}` : edu.batchStart || edu.batchEnd || "";
                return `
                  <div class="entry">
                    <div class="entry-header">
                      <span class="entry-title">${edu.degree || "Degree"}</span>
                      ${batch ? `<span class="entry-date">${batch}</span>` : ""}
                    </div>
                    <div class="entry-subtitle">${edu.institution || ""}${edu.location ? `, ${edu.location}` : ""}</div>
                    ${
                      edu.gpa || !isEmptyContent(edu.honors || "")
                        ? `<div class="entry-details">${edu.gpa ? `GPA: ${edu.gpa}` : ""}${edu.gpa && !isEmptyContent(edu.honors || "") ? " | " : ""}${!isEmptyContent(edu.honors || "") ? stripHtml(edu.honors || "") : ""}</div>`
                        : ""
                    }
                  </div>
                `;
              })
              .join("")}
          </section>
        `;
      }
      case "skills": {
        const skills = resume.skills || [];
        if (!skills.length) return "";
        const byCat = skills.reduce((acc: any, s: any) => {
          const cat = s.category || "Other";
          acc[cat] = acc[cat] || [];
          acc[cat].push(s.name);
          return acc;
        }, {});
        return `
          <section class="section">
            <h2 class="section-header">Skills</h2>
            <div class="skills-container">
              ${Object.entries(byCat)
                .map(
                  ([cat, items]: any) => `
                <div class="skill-row">
                  <span class="skill-category">${cat}:</span>
                  <span class="skill-items">${(items as string[]).filter(Boolean).join(", ")}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </section>
        `;
      }
      case "certifications": {
        const certs = resume.certifications || [];
        if (!certs.length) return "";
        return `
          <section class="section">
            <h2 class="section-header">Certifications</h2>
            ${certs
              .map(
                (c: any) => `
              <div class="cert-entry">
                <span class="cert-name">${c.name || "Certification"}</span>
                <span class="cert-details">${c.issuer || ""}${c.date ? ` • ${c.date}` : ""}</span>
              </div>
            `
              )
              .join("")}
          </section>
        `;
      }
      case "custom": {
        const custom = (resume.customSections || []).find((cs: any) => cs.id === section.id);
        if (!custom || !(custom.items || []).length) return "";
        return `
          <section class="section">
            <h2 class="section-header">${custom.title}</h2>
            ${(custom.items || [])
              .map(
                (item: any) => `
              <div class="entry">
                <div class="entry-header">
                  <span class="entry-title">${item.title || "Item"}</span>
                  ${item.date ? `<span class="entry-date">${item.date}</span>` : ""}
                </div>
                ${custom.showTechnologies && item.technologies ? `<div class="entry-tech">${item.technologies}</div>` : ""}
                <ul class="bullets">
                  ${(item.bullets || [])
                    .filter((b: string) => !isEmptyContent(b))
                    .map((b: string) => `<li>${stripHtml(b)}</li>`)
                    .join("")}
                </ul>
              </div>
            `
              )
              .join("")}
          </section>
        `;
      }
      default:
        return "";
    }
  };

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link href="${fontsUrl}" rel="stylesheet" />
    <style>
      @page { size: A4; margin: 15mm; }
      *{ box-sizing:border-box; }
      html,body{ margin:0; padding:0; font-family:${fontFamily}; font-size:11pt; line-height:1.4; color:#000; background:#fff; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
      .contact-header{ text-align:center; padding-bottom:12pt; margin-bottom:12pt; border-bottom:2px solid ${accent}; break-inside:avoid; }
      .name{ font-size:22pt; font-weight:700; color:${accent}; margin-bottom:6pt; break-after:avoid; }
      .contact-info,.contact-links{ font-size:10pt; color:#555; display:flex; justify-content:center; flex-wrap:wrap; gap:4pt; }
      .contact-links{ margin-top:4pt; }
      .separator{ margin:0 6pt; color:#999; }
      .section{ margin-bottom:14pt; break-inside:avoid; page-break-inside:avoid; }
      .section-header{ font-size:12pt; font-weight:700; color:${accent}; text-transform:uppercase; letter-spacing:.5pt; padding-bottom:4pt; margin-bottom:8pt; border-bottom:1px solid ${accent}; break-after:avoid; }
      .entry{ margin-bottom:10pt; break-inside:avoid; page-break-inside:avoid; }
      .entry-header{ display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2pt; break-after:avoid; }
      .entry-title{ font-weight:700; color:${accent}; font-size:11pt; }
      .entry-date{ font-weight:600; color:#333; font-size:10pt; white-space:nowrap; }
      .entry-subtitle{ color:#555; font-size:10pt; margin-bottom:4pt; }
      .entry-tech{ font-style:italic; color:#666; font-size:10pt; margin-bottom:4pt; }
      .entry-details{ font-size:10pt; color:#555; }
      .bullets{ list-style:none; padding-left:0; margin:0; }
      .bullets li{ position:relative; padding-left:12pt; margin-bottom:3pt; font-size:10pt; line-height:1.4; }
      .bullets li:before{ content:"•"; position:absolute; left:0; color:#333; }
      .summary-text{ font-size:10pt; line-height:1.5; color:#333; }
      .skills-container{ display:flex; flex-direction:column; gap:4pt; }
      .skill-row{ display:flex; flex-wrap:wrap; font-size:10pt; line-height:1.4; }
      .skill-category{ font-weight:700; color:${accent}; margin-right:6pt; }
      .cert-entry{ display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4pt; font-size:10pt; }
      .cert-name{ font-weight:700; color:${accent}; }
      .cert-details{ color:#555; }
      @media print{
        .section,.entry{ break-inside:avoid; page-break-inside:avoid; }
        h1,h2,h3,.section-header,.entry-header{ break-after:avoid; }
      }
    </style>
  </head>
  <body>
    <div class="resume">
      ${allSections.map(sectionHtml).join("")}
    </div>
  </body>
</html>`;
};

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "Method not allowed" }) };

  let browser: puppeteer.Browser | null = null;

  try {
    const { resume, filename } = JSON.parse(event.body || "{}");
    if (!resume) throw new Error("resume is required");

    const html = generateHtml(resume);

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: ["domcontentloaded", "networkidle0"] });
    await page.evaluateHandle("document.fonts.ready");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false, // <-- removes date/title/url/page header/footer
      margin: { top: "15mm", bottom: "15mm", left: "15mm", right: "15mm" },
    });

    await browser.close();
    browser = null;

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: filename || "resume",
        pdf: Buffer.from(pdfBuffer).toString("base64"),
      }),
    };
  } catch (err: any) {
    if (browser) await browser.close();
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: err?.message || "Failed to generate PDF" }),
    };
  }
};


