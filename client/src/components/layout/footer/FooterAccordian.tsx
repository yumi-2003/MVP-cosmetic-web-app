import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { footerLinks } from "@/data/footer-link";
import { Link } from "react-router";

const FooterAccordian = () => {
  return (
    <>
      {/* brand  */}
      <div className="space-y-4 md:hidden">
        <h3 className="font-serif text-2xl">JUSTAGIRL</h3>
        <p className="text-sm text-muted-foreground">
          Clean, considered beauty for skin that speaks for itself.
        </p>
      </div>
      <Accordion type="single" collapsible className="md:hidden">
        {footerLinks.map((section) => (
          <AccordionItem key={section.title} value={section.title}>
            <AccordionTrigger className="text-xs tracking-widest">
              {section.title}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pb-4 text-sm">
                {section.links.map((link) => (
                  <li className="" key={link.label}>
                    <Link to={link.href} className="text-muted-foreground hover:text-primary hover:no-underline transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default FooterAccordian;
