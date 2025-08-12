import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LoginErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginErrorModal = ({ isOpen, onClose }: LoginErrorModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Access Denied</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6">
          <div className="text-8xl mb-4">😠</div>
          <p className="text-lg font-semibold text-center">
            You are not Inamulhasan!
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