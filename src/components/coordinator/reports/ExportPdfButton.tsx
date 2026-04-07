import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ExportPdfButtonProps {
  contentRef: React.RefObject<HTMLDivElement>;
  fileName: string;
  title: string;
  schoolName?: string;
}

export function ExportPdfButton({ contentRef, fileName, title, schoolName }: ExportPdfButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!contentRef.current) return;

    setExporting(true);
    toast.info("Gerando PDF, aguarde...");

    try {
      const element = contentRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgWidth = 190; // A4 width minus margins (210 - 20)
      const pageHeight = 277; // A4 height minus margins (297 - 20)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF("p", "mm", "a4");

      // Header
      pdf.setFontSize(16);
      pdf.setTextColor(33, 33, 33);
      pdf.text(title, 10, 15);

      if (schoolName) {
        pdf.setFontSize(10);
        pdf.setTextColor(120, 120, 120);
        pdf.text(schoolName, 10, 22);
      }

      const dateStr = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Gerado em ${dateStr}`, 10, schoolName ? 28 : 22);

      const startY = schoolName ? 33 : 27;
      const availableHeight = pageHeight - startY + 10;

      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      if (imgHeight <= availableHeight) {
        pdf.addImage(imgData, "JPEG", 10, startY, imgWidth, imgHeight);
      } else {
        // Multi-page: slice the canvas
        let remainingHeight = canvas.height;
        let sourceY = 0;
        let isFirstPage = true;

        while (remainingHeight > 0) {
          if (!isFirstPage) {
            pdf.addPage();
          }

          const currentStartY = isFirstPage ? startY : 10;
          const currentAvailableHeight = isFirstPage ? availableHeight : pageHeight;
          const sliceHeight = Math.min(
            remainingHeight,
            (currentAvailableHeight * canvas.width) / imgWidth
          );

          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = sliceHeight;
          const ctx = pageCanvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(
              canvas,
              0, sourceY, canvas.width, sliceHeight,
              0, 0, pageCanvas.width, sliceHeight
            );
          }

          const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.95);
          const pageImgHeight = (sliceHeight * imgWidth) / canvas.width;
          pdf.addImage(pageImgData, "JPEG", 10, currentStartY, imgWidth, pageImgHeight);

          // Footer
          pdf.setFontSize(7);
          pdf.setTextColor(180, 180, 180);
          pdf.text(
            `Página ${pdf.getNumberOfPages()}`,
            105,
            292,
            { align: "center" }
          );

          sourceY += sliceHeight;
          remainingHeight -= sliceHeight;
          isFirstPage = false;
        }
      }

      // Footer on first page if single page
      if (imgHeight <= availableHeight) {
        pdf.setFontSize(7);
        pdf.setTextColor(180, 180, 180);
        pdf.text("Página 1", 105, 292, { align: "center" });
      }

      pdf.save(`${fileName}.pdf`);
      toast.success("PDF exportado com sucesso!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Erro ao exportar PDF. Tente novamente.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={exporting}
      className="gap-2"
    >
      {exporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4" />
      )}
      {exporting ? "Gerando..." : "Exportar PDF"}
    </Button>
  );
}
