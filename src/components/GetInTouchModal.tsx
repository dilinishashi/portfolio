import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import SocialIcon from "./SocialIcon";
import { cn } from "@/lib/utils";

interface GetInTouchLink {
  icon: string;
  name: string;
  url: string;
  color: string;
}

interface GetInTouchModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: GetInTouchLink[];
}

const GetInTouchModal = ({ isOpen, onClose, links }: GetInTouchModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Get In Touch</DialogTitle>
          <DialogDescription>
            Contact me through any of the channels below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center p-4 rounded-lg transition-colors font-medium text-white",
                link.color
              )}
            >
              <SocialIcon name={link.icon as any} className="mr-3 h-6 w-6" />
              <span>{link.name}</span>
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GetInTouchModal;