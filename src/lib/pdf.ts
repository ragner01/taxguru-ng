import { jsPDF } from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";

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

export const downloadTaxSummaryPdf = ({
  title,
  subtitle,
  sections,
  filename = "tax-summary.pdf"
}: DownloadPdfOptions) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  type AutoTableCapableDoc = jsPDF & { lastAutoTable?: { finalY: number } };
  const tableDoc = doc as AutoTableCapableDoc;

  const sanitizeText = (value: string) => value.replace(/₦/g, "NGN ");

  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 60;
  const contentWidth = pageWidth - marginX * 2;
  let cursorY = 140;

  const ensureSpace = (requiredSpace = 60) => {
    if (cursorY + requiredSpace > doc.internal.pageSize.getHeight() - 80) {
      doc.addPage();
      cursorY = 120;
      drawPageHeader();
    }
  };

  const drawPageHeader = () => {
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.line(marginX, cursorY - 20, pageWidth - marginX, cursorY - 20);
  };

  const addParagraph = (text: string, options?: { bullet?: boolean; fontSize?: number; lineHeight?: number }) => {
    const { bullet = false, fontSize = 11, lineHeight = 18 } = options ?? {};
    const safeText = sanitizeText(text).replace(/^[-•]\s*/, "");
    const indent = bullet ? 16 : 0;
    const wrapped = doc.splitTextToSize(safeText, contentWidth - indent);

    wrapped.forEach((line, index) => {
      ensureSpace(lineHeight);
      if (index === 0 && bullet) {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", "bold");
        doc.text("•", marginX, cursorY);
      }
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", "normal");
      doc.text(line, marginX + indent, cursorY);
      cursorY += lineHeight;
    });
  };

  const renderTitleBlock = () => {
    doc.setFillColor(24, 69, 139);
    doc.roundedRect(marginX, 60, contentWidth, 70, 10, 10, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(sanitizeText(title), marginX + 18, 92);

    if (subtitle) {
      const subtitleLines = doc.splitTextToSize(sanitizeText(subtitle), contentWidth - 36);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(subtitleLines, marginX + 18, 116);
    }

    doc.setTextColor(30, 41, 59);
  };

  const renderKeyFiguresTable = (section: PdfSection) => {
    const body: RowInput[] = section.lines.map((line) => {
      const sanitized = sanitizeText(line);
      const [label, ...rest] = sanitized.split(":");
      return [label.trim(), rest.join(":").trim()];
    });

    ensureSpace(120);
    autoTable(doc, {
      startY: cursorY,
      head: [["Key Figure", "Amount"].map((heading) => sanitizeText(heading))],
      body,
      margin: { left: marginX, right: marginX },
      tableWidth: contentWidth,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 11,
        cellPadding: 10,
        textColor: [30, 41, 59]
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold"
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      bodyStyles: {
        minCellHeight: 18
      }
    });

    cursorY = (tableDoc.lastAutoTable?.finalY ?? cursorY) + 24;
  };

  const renderSectionHeading = (heading: string) => {
    ensureSpace(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(sanitizeText(heading), marginX, cursorY);
    cursorY += 18;
  };

  const renderListSection = (section: PdfSection) => {
    renderSectionHeading(section.heading);
    section.lines.forEach((line) => addParagraph(line, { bullet: true }));
    cursorY += 8;
  };

  const addFooter = () => {
    const generatedAt = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date());

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${generatedAt}`, marginX, doc.internal.pageSize.getHeight() - 36);
  };

  renderTitleBlock();

  sections.forEach((section) => {
    const normalizedHeading = section.heading.toLowerCase();

    if (normalizedHeading.includes("key figure")) {
      renderSectionHeading(section.heading);
      cursorY += 6;
      renderKeyFiguresTable(section);
    } else if (normalizedHeading.includes("breakdown") || normalizedHeading.includes("notes")) {
      renderSectionHeading(section.heading);
      cursorY += 6;
      const rows: RowInput[] = section.lines.map((line) => [sanitizeText(line.replace(/^[-•]\s*/, ""))]);
      ensureSpace(120);
      autoTable(doc, {
        startY: cursorY,
        head: [["Details"]],
        body: rows,
        margin: { left: marginX, right: marginX },
        tableWidth: contentWidth,
        theme: "striped",
        headStyles: {
          fillColor: [15, 118, 110],
          textColor: 255,
          fontStyle: "bold"
        },
        styles: {
          font: "helvetica",
          fontSize: 11,
          cellPadding: 10,
          textColor: [30, 41, 59]
        },
        alternateRowStyles: {
          fillColor: [240, 253, 250]
        }
      });
      cursorY = (tableDoc.lastAutoTable?.finalY ?? cursorY) + 24;
    } else {
      renderListSection(section);
    }
  });

  addFooter();
  doc.save(filename);
};
