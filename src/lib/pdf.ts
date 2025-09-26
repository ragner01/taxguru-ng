const escapePdfText = (text: string) =>
  text
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

type PdfSection = {
  heading: string;
  lines: string[];
};

type DownloadPdfOptions = {
  title: string;
  subtitle?: string;
  sections: PdfSection[];
  filename?: string;
};

type PdfLine = {
  text: string;
  fontSize: number;
  marginTop?: number;
};

export const downloadTaxSummaryPdf = ({
  title,
  subtitle,
  sections,
  filename = "tax-summary.pdf"
}: DownloadPdfOptions) => {
  const lines: PdfLine[] = [];

  lines.push({ text: title, fontSize: 18 });
  if (subtitle) {
    lines.push({ text: subtitle, fontSize: 12, marginTop: 10 });
  }

  sections.forEach((section) => {
    lines.push({ text: section.heading, fontSize: 14, marginTop: 18 });
    section.lines.forEach((line) => {
      lines.push({ text: `- ${line}`, fontSize: 11, marginTop: 14 });
    });
  });

  let currentY = 800;
  const streamParts: string[] = ["BT"];

  lines.forEach((line, index) => {
    const margin = line.marginTop ?? line.fontSize + 6;
    if (index === 0) {
      currentY = Math.min(currentY, 800);
    } else {
      currentY -= margin;
    }

    if (currentY < 60) {
      // Prevent overflow: clamp to minimum margin
      currentY = 60;
    }

    streamParts.push(`/F1 ${line.fontSize} Tf`);
    streamParts.push(`1 0 0 1 50 ${currentY.toFixed(2)} Tm`);
    streamParts.push(`(${escapePdfText(line.text)}) Tj`);
  });

  streamParts.push("ET");
  const stream = streamParts.join("\n");
  const encoder = new TextEncoder();
  const streamBytes = encoder.encode(stream);

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${streamBytes.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  objects.forEach((content, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${content}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i++) {
    const offset = offsets[i];
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
