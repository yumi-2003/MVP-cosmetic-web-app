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
      <div className="hidden md:block relative group overflow-hidden">
        <img
          src={authCover}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          alt="Cosmetics"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>

        {/* Text Bottom Left */}
        <div className="absolute bottom-16 left-12 text-white max-w-sm z-10">
          <p className="text-2xl italic font-serif leading-relaxed opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards">
            "Beauty begins the moment you decide to be yourself."
          </p>
          <div className="flex items-center gap-4 mt-8 opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300 fill-mode-forwards">
            <div className="h-[1px] w-12 bg-primary/80"></div>
            <p className="text-[11px] tracking-[0.3em] font-semibold uppercase text-primary/90">
              COCO CHANEL
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-[420px] py-12">
          {/* LOGO Header */}
          <div className="mb-12">
            <Link to="/" className="flex flex-col items-center group transition-opacity hover:opacity-80">
              <span className="text-3xl tracking-[0.3em] font-light font-serif text-foreground uppercase mb-2">
                JustaGirl
              </span>
              <div className="flex items-center justify-center w-full max-w-[200px] gap-3">
                <div className="h-[0.5px] flex-1 bg-border/50"></div>
                <span className="text-[9px] tracking-[0.25em] font-medium text-muted-foreground uppercase whitespace-nowrap">
                  Premium Skincare
                </span>
                <div className="h-[0.5px] flex-1 bg-border/50"></div>
              </div>
            </Link>
          </div>

          {/* TABS */}
          <div className="flex justify-center mb-12 w-full gap-12 relative">
            <Link
              to="/login"
              className="relative group"
            >
              <span className={`text-xs font-bold tracking-[0.2em] uppercase transition-all ${
                isLogin ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}>
                Sign In
              </span>
              {isLogin && (
                <div className="absolute -bottom-4 left-0 w-full h-[2px] bg-primary animate-in fade-in zoom-in-95 duration-300"></div>
              )}
            </Link>
            <Link
              to="/signup"
              className="relative group"
            >
              <span className={`text-xs font-bold tracking-[0.2em] uppercase transition-all ${
                !isLogin ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}>
                Join Us
              </span>
              {!isLogin && (
                <div className="absolute -bottom-4 left-0 w-full h-[2px] bg-primary animate-in fade-in zoom-in-95 duration-300"></div>
              )}
            </Link>
          </div>

          {/* FORM CONTENT */}
          <div
            className={`transition-all duration-700 ease-out transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
