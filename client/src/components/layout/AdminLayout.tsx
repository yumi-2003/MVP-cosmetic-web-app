import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex bg-background min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8 relative">
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
