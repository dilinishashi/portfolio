import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from 'react';
import { Download, Printer } from "lucide-react";

interface CVViewerProps {
  isOpen: boolean;
  onClose: () => void;
  cvUrl: string;
}

const CVViewer = ({ isOpen, onClose, cvUrl }: CVViewerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [objectUrl, setObjectUrl] = useState<string>('');

  useEffect(() => {
    let createdUrl: string | null = null;

    if (isOpen && cvUrl && cvUrl !== '#' && cvUrl.startsWith('data:')) {
      const convertDataUrlToBlob = async () => {
        try {
          const response = await fetch(cvUrl);
          const blob = await response.blob();
          createdUrl = URL.createObjectURL(blob);
          setObjectUrl(createdUrl);
        } catch (error) {
          console.error("Failed to create object URL for PDF:", error);
          setObjectUrl(cvUrl); // Fallback to the original URL
        }
      };
      convertDataUrlToBlob();
    } else if (isOpen && cvUrl && cvUrl !== '#') {
      setObjectUrl(cvUrl);
    } else {
      setObjectUrl('');
    }

    // Cleanup function to prevent memory leaks
    return () => {
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [isOpen, cvUrl]);

  const handlePrint = () => {
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
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
              ref={iframeRef}
              src={objectUrl}
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