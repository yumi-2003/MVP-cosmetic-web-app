import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const AdminLayout: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row bg-background min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="font-bold text-xl tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
            Y
          </div>
          YUMI <span className="text-primary">ADMIN</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 -mr-2 text-foreground/80 hover:text-primary transition-colors">
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r-border/30">
            <AdminSidebar isMobile onClose={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      <main className="flex-1 overflow-auto p-4 md:p-8 relative min-w-0">
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -z-10 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />
      </main>
    </div>
  );
};

export default AdminLayout;
