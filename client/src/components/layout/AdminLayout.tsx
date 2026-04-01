import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "../admin/AdminHeader";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const AdminLayout: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex bg-background min-h-screen relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0">
        <AdminSidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Universal Admin Header (Desktop & Mobile) */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
           <div className="md:hidden flex items-center justify-between p-4 px-6 border-b border-border/10">
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
           <AdminHeader />
        </div>

        <main className="flex-1 overflow-auto p-4 md:p-10 relative">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
