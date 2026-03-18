import Newsletter from "./Newsletter";
import FooterLinks from "./FooterLinks";
import FooterBottom from "./FooterBottom";
import FooterAccordian from "./FooterAccordian";

const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      <Newsletter />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <FooterAccordian />
        <FooterLinks />
      </div>
      <FooterBottom />
    </footer>
  );
};

export default Footer;
