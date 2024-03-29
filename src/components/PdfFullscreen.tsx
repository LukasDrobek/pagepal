import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { Expand, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { useToast } from "@/components/ui/use-toast";
import { useResizeDetector } from "react-resize-detector";

const PdfFullscreen = ({ fileUrl }: { fileUrl: string }) => {
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number | undefined>(undefined);

  const renderedPages = new Array(numPages).fill(null).map((_, index) => {
    return (
      <Page key={index} pageNumber={index + 1} width={width ? width : 1} />
    );
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(visibility) => !visibility && setIsOpen(visibility)}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button
          aria-label="fullscreen view"
          variant="ghost"
          className="gap-1.5"
        >
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
          <div ref={ref}>
            <Document
              file={fileUrl}
              className="max-h-full"
              loading={
                <div className="flexjustify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
              }}
              onLoadError={() => {
                toast({
                  title: "Error loading PDF",
                  description: "Please try again later.",
                  variant: "destructive",
                });
              }}
            >
              {renderedPages}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullscreen;
