import type { ResumeData } from "@/types/resume-builder";

function fileNameFromResume(resume: ResumeData) {
  const name = resume.personalInfo.fullName.trim() || "Professional";
  return `${name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}-Resume.pdf`;
}

export function exportResumeToPdf(resume: ResumeData, element: HTMLElement | null) {
  if (!element || typeof window === "undefined") return;

  const printWindow = window.open("", "_blank", "width=900,height=1200");
  if (!printWindow) {
    window.print();
    return;
  }

  const filename = fileNameFromResume(resume);
  const styles = `
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #ffffff; color: #111827; font-family: Arial, sans-serif; }
    .resume-preview { box-shadow: none !important; border: 0 !important; width: 100% !important; min-height: auto !important; }
    a { color: #111827; text-decoration: none; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .resume-preview { page-break-inside: auto; }
      section, article { break-inside: avoid; page-break-inside: avoid; }
    }
  `;

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${filename}</title>
        <style>${styles}</style>
      </head>
      <body>${element.outerHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
}
