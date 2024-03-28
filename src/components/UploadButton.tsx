"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useState } from "react";

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={(open) => !open && setIsOpen(open)}>
        <DialogTrigger onClick={() => setIsOpen(true)} asChild>
          <Button>Upload PDF</Button>
        </DialogTrigger>

        <DialogContent>example content</DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadButton;
