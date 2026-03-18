const FooterBottom = () => {
  return (
    <div className="border-t border-border/10">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <p className="text-xs text-muted-foreground">
          © 2026 Lumina Beauty. All rights reserved.
        </p>
        <div className="flex gap-6 text-sx text-muted-foreground">
          <span>Privacy Policy</span>
          <span>Terms of Use</span>
          <span>Cookie Settings</span>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
