import { Link } from "react-router";
import type { ReactNode } from "react";

interface InformationLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  heroBg?: string;
}

const InformationLayout = ({
  title,
  subtitle,
  children,
  heroBg = "from-rose-50/50 via-background to-background dark:from-rose-950/10 dark:via-background dark:to-background",
}: InformationLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className={`bg-gradient-to-b ${heroBg} pt-16 pb-12 md:pt-24 md:pb-20 border-b border-border/40`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground mb-8 uppercase tracking-[0.2em]">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="opacity-50">/</span>
            <span className="text-foreground font-medium">{title}</span>
          </nav>

          {subtitle && (
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary/80 mb-4">
              {subtitle}
            </p>
          )}
          <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-6 leading-tight tracking-tight">
            {title}
          </h1>
          <div className="w-12 h-0.5 bg-primary/30 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-12 text-muted-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InformationLayout;
