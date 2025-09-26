import { jsPDF } from "jspdf";

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
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 56;
  const textWidth = pageWidth - marginX * 2;
  let cursorY = 80;

  const goToNextLine = (amount = 18) => {
    cursorY += amount;
    if (cursorY > doc.internal.pageSize.getHeight() - 72) {
      doc.addPage();
      cursorY = 80;
      drawHeader();
    }
  };

  const drawHeader = () => {
    doc.setDrawColor(228, 232, 240);
    doc.setLineWidth(1);
    doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
    goToNextLine(24);
  };

  const addParagraph = (text: string, options?: { bullet?: boolean; fontSize?: number; lineHeight?: number }) => {
    const { bullet = false, fontSize = 11, lineHeight = 16 } = options ?? {};
    const contentX = bullet ? marginX + 14 : marginX;
    const wrapped = doc.splitTextToSize(text, textWidth - (bullet ? 14 : 0));

    wrapped.forEach((line, index) => {
      if (index === 0 && bullet) {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(fontSize);
        doc.text("•", marginX, cursorY);
      }
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(fontSize);
      doc.text(line, contentX, cursorY);
      goToNextLine(lineHeight);
    });
  };

  const printTitleBlock = () => {
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text(title, marginX, cursorY);
    goToNextLine(28);

    if (subtitle) {
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(12);
      const subtitleLines = doc.splitTextToSize(subtitle, textWidth);
      subtitleLines.forEach((line) => {
        doc.text(line, marginX, cursorY);
        goToNextLine(16);
      });
    }

    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(2);
    doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
    goToNextLine(26);
  };

  const addTimestamp = () => {
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(10);
    const generatedAt = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date());
    doc.text(`Generated: ${generatedAt}`, marginX, doc.internal.pageSize.getHeight() - 40);
  };

  printTitleBlock();

  sections.forEach((section, sectionIndex) => {
    if (sectionIndex > 0) {
      goToNextLine(12);
    }

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text(section.heading, marginX, cursorY);
    goToNextLine(16);

    section.lines.forEach((line) => {
      addParagraph(line, { bullet: true });
    });
  });

  addTimestamp();
  doc.save(filename);
};
