import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { Download, Printer } from "lucide-react";

interface CVViewerProps {
  isOpen: boolean;
  onClose: () => void;
  cvUrl: string;
}

const CVViewer = ({ isOpen, onClose, cvUrl }: CVViewerProps) => {
  const [objectUrl, setObjectUrl] = useState<string>('');

  useEffect(() => {
    // This effect creates a browser-friendly URL for the uploaded PDF
    // to ensure it can be displayed and interacted with safely.
    let objectUrlToRevoke: string | null = null;

    if (isOpen && cvUrl && cvUrl !== '#' && cvUrl.startsWith('data:application/pdf')) {
      try {
        const parts = cvUrl.split(',');
        const base64Data = parts[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        
        const url = URL.createObjectURL(blob);
        setObjectUrl(url);
        objectUrlToRevoke = url;
      } catch (error) {
        console.error("Failed to create object URL from data URL:", error);
        setObjectUrl('');
      }
    } else if (isOpen && cvUrl && cvUrl !== '#') {
      setObjectUrl(cvUrl);
    } else {
      setObjectUrl('');
    }

    return () => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
    };
  }, [isOpen, cvUrl]);

  const handlePrint = () => {
    // Opens the PDF in a new tab, allowing the user to use the browser's native print functionality.
    // This is the most reliable way to avoid cross-origin security errors.
    if (objectUrl) {
      window.open(objectUrl, '_blank');
    }
  };

  const hasCv = cvUrl && cvUrl !== '#';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Curriculum Vitae</DialogTitle>
          {hasCv && (
            <DialogDescription>
              You can view, download, or print my CV from here.
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="flex-1 w-full border rounded-md overflow-hidden">
          {hasCv && objectUrl ? (
            <iframe
              src={`${objectUrl}#toolbar=0&navpanes=0`} // Hide the default iframe toolbar
              title="CV"
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <p className="text-muted-foreground">{isOpen && hasCv ? 'Loading CV...' : 'No CV has been uploaded yet.'}</p>
            </div>
          )}
        </div>
        {hasCv && (
          <DialogFooter className="mt-4">
            <Button variant="outline" asChild>
              <a href={cvUrl} download="Nawayir-Inamulhasan-CV.pdf">
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
            <Button onClick={handlePrint} disabled={!objectUrl}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CVViewer;