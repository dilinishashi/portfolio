import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface LoginErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  emoji: string;
}

const LoginErrorModal = ({ isOpen, onClose, title, message, emoji }: LoginErrorModalProps) => {
  useEffect(() => {
    if (isOpen) {
      const audio = new Audio('/error-sound.mp3');
      audio.play().catch(error => {
        console.error("Audio playback failed. Make sure the user has interacted with the page.", error);
      });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6">
          <div className="text-8xl mb-4">{emoji}</div>
          <p className="text-lg font-semibold text-center">
            {message}
          </p>
        </div>
        <div className="flex justify-center">
            <Button onClick={onClose}>Try Again</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginErrorModal;