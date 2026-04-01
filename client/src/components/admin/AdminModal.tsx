import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-none bg-transparent shadow-none">
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <DialogHeader className="p-8 border-b border-border/30 flex flex-row items-center justify-between">
            <DialogTitle className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-accent transition-all text-muted-foreground hover:text-foreground"
            >
              <X size={24} />
            </button>
          </DialogHeader>
          <div className="p-8">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminModal;
