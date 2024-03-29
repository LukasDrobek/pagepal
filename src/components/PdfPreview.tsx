"use client";

import { useToast } from "@/components/ui/use-toast";

import { Loader2 } from "lucide-react";
import { useResizeDetector } from "react-resize-detector";
import { Document, Page, pdfjs } from "react-pdf";

// AnnotaionLayer and TextLayer styles
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// External CDN worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfPreview = ({ url }: { url: string }) => {
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">Top bar</div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <div ref={ref}>
          <Document
            file={url}
            className="max-h-full"
            loading={
              <div className="flexjustify-center">
                <Loader2 className="my-24 h-6 w-6 animate-spin" />
              </div>
            }
            onLoadError={() => {
              toast({
                title: "Error loading PDF",
                description: "Please try again later.",
                variant: "destructive",
              });
            }}
          >
            <Page width={width ? width : 1} pageNumber={1} />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;
