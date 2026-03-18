import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import authCover from "@/assets/images/auth.jpg";

type Props = {
  children: ReactNode;
};

// components/auth/AuthLayout.tsx
export default function AuthLayout({ children }: Props) {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => {
      clearTimeout(timer);
      setMounted(false);
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen overflow-hidden grid md:grid-cols-2">
      {/* LEFT IMAGE */}
      <div className="hidden md:block">
        <img
          src={authCover}
          className="h-full w-full object-cover"
          alt="Cosmetics"
        />

        {/* Text Bottom Left */}
        <div className="absolute bottom-12 left-10 text-white max-w-sm">
          <p className="text-xl italic font-serif opacity-90">
            "Beauty begins the moment you decide to be yourself."
          </p>
          <div className="flex items-center gap-3 mt-5">
            <div className="h-[1px] w-8 bg-primary"></div>
            <p className="text-[10px] tracking-[0.2em] font-medium uppercase text-primary">
              COCO CHANEL
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-center justify-center p-6 bg-background overflow-y-auto">
        <div className="w-full max-w-[400px] py-8">
          <div className="absolute right-0 top-3 left-4 text-foreground font-bold">
            <Link to="/">JUSTAGIRL</Link>
          </div>
          {/* LOGO Header */}
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="flex items-center justify-center w-full max-w-[240px] gap-2">
              <div className="h-px flex-1 bg-border"></div>
              <span className="text-lg tracking-[0.2em] font-medium text-muted-foreground uppercase whitespace-nowrap">
                Beauty & Skincare
              </span>
              <div className="h-px flex-1 bg-border"></div>
            </div>
          </div>

          {/* TABS */}
          <div className="flex justify-center border-b border-border mb-8 w-full gap-8 relative">
            <Link
              to="/login"
              className={`pb-3 text-xs font-semibold tracking-widest uppercase transition-colors -mb-[1px] ${
                isLogin
                  ? "text-primary border-b border-primary"
                  : "text-muted-foreground hover:text-foreground border-b border-transparent"
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className={`pb-3 text-xs font-semibold tracking-widest uppercase transition-colors -mb-[1px] ${
                !isLogin
                  ? "text-primary border-b border-primary"
                  : "text-muted-foreground hover:text-foreground border-b border-transparent"
              }`}
            >
              Create Account
            </Link>
          </div>

          {/* FORM CONTENT */}
          <div
            className={`transition-all duration-500 ease-in-out transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
