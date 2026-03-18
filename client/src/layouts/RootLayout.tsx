import Footer from "@/components/layout/footer/Footer";
import Navbar from "@/components/layout/navbar/Navbar";
import { Outlet, useLocation } from "react-router";

const RootLayout = () => {
  const { pathname } = useLocation();
  const hideChrome =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  return (
    <div className="min-h-screen flex flex-col">
      {!hideChrome && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
};

export default RootLayout;
