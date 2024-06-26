"use client";

import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import PdfFullscreen from "@/components/PdfFullscreen";

import {
  Loader2,
  ChevronDown,
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCw,
} from "lucide-react";
import { useResizeDetector } from "react-resize-detector";
import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SimpleBar from "simplebar-react";

// AnnotaionLayer and TextLayer styles
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// External CDN worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfPreview = ({ url }: { url: string }) => {
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();

  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  // Check if scale has changed -> derive if new page is loading
  const isLoading = renderedScale !== scale;

  // Form validation
  const CustomValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });
  type TCustomValidator = z.infer<typeof CustomValidator>;

  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomValidator),
  });

  // Handle page submit
  const handlePageSubmit = (page: TCustomValidator) => {
    setCurrentPage(Number(page.page));
    setValue("page", String(page.page));
  };

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            aria-label="previous page"
            onClick={() => {
              setCurrentPage((prev) => (prev <= 1 ? prev : prev - 1));
              setValue("page", String(currentPage - 1));
            }}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500"
              )}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSubmit(handlePageSubmit)();
              }}
            />
            <p className="text-sm text-zinc-700 space-x-1">
              <span>/</span>
              <span>{numPages ?? "-"}</span>
            </p>
          </div>

          <Button
            variant="ghost"
            aria-label="next page"
            onClick={() => {
              setCurrentPage((prev) =>
                prev >= numPages! ? numPages! : prev + 1
              );
              setValue("page", String(currentPage + 1));
            }}
            disabled={numPages === undefined || currentPage >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5" aria-label="zoom" variant="ghost">
                <Search className="h-4 w-4" />
                {scale * 100}%
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            aria-label="rotate 90 degrees"
            variant="ghost"
            onClick={() => setRotation((prev) => prev + 90)}
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <PdfFullscreen fileUrl={url} />
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              file={url}
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
              {isLoading && renderedScale ? (
                <Page
                  key={"@" + renderedScale}
                  pageNumber={currentPage}
                  rotate={rotation}
                  scale={scale}
                  width={width ? width : 1}
                />
              ) : null}

              <Page
                className={cn(isLoading ? "hidden" : "")}
                key={"@" + scale}
                pageNumber={currentPage}
                rotate={rotation}
                scale={scale}
                width={width ? width : 1}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 h-6 w-6 animate-spin" />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfPreview;
