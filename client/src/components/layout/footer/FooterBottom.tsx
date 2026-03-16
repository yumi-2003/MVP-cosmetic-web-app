const FooterBottom = () => {
  return (
    <div className="border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <p className="text-xs text-neutral-500">
          © 2026 Lumina Beauty. All rights reserved.
        </p>
        <div className="flex gap-6 text-sx text-neutral-400">
          <span>Privacy Policy</span>
          <span>Terms of Use</span>
          <span>Cookie Settings</span>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
