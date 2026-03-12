import Navbar from "@/components/layout/navbar/Navbar";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8">
        <Outlet />
      </main>
      <footer className="">Footer</footer>
    </div>
  );
};

export default RootLayout;
