import { footerLinks } from "@/data/footer-link";
import { Link } from "react-router";
const FooterLinks = () => {
  return (
    <div className="hidden gap-12 md:grid md:grid-cols-2 lg:grid-cols-4">
      {/* brand */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl">JUSTAGIRL</h3>{" "}
        <p className="text-sm text-muted-foreground">
          Clean, considered beauty for skin that speaks for itself.{" "}
        </p>
      </div>
      {/* shop  */}
      {footerLinks.map((section) => (
        <div className="space-y-3" key={section.title}>
          <h4 className="text-xs tracking-widest text-muted-foreground">
            {section.title}
          </h4>
          <ul className="space-y-2 text-sm">
            {section.links.map((link) => (
              <li key={link.label}>
                <Link to={link.href} className="text-muted-foreground hover:text-primary hover:no-underline transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FooterLinks;
