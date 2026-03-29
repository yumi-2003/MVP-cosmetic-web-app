import InformationLayout from "@/components/layout/InformationLayout";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <InformationLayout 
      title="FAQ" 
      subtitle="How can we help?"
    >
      <div className="space-y-12">
        <section className="space-y-6">
          <h2 className="font-serif text-3xl text-foreground">Frequently Asked Questions</h2>
          <p className="opacity-80">Everything you need to know about our products, shipping, and more.</p>
        </section>

        <section className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-foreground border-b border-border/50 pb-2">Orders & Shipping</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-border/30">
                <AccordionTrigger className="font-medium hover:no-underline hover:text-primary transition-colors py-4">What is your returns policy?</AccordionTrigger>
                <AccordionContent className="pb-4 leading-relaxed">
                  We offer free returns within 30 days of purchase. The items must be in their original packaging and unused for a full refund.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-border/30">
                <AccordionTrigger className="font-medium hover:no-underline hover:text-primary transition-colors py-4">How long does shipping take?</AccordionTrigger>
                <AccordionContent className="pb-4 leading-relaxed">
                  Standard shipping typically takes 3-5 business days. Express shipping options are available at checkout for 1-2 business day delivery.
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-3" className="border-border/30">
                <AccordionTrigger className="font-medium hover:no-underline hover:text-primary transition-colors py-4">Which countries do you ship to?</AccordionTrigger>
                <AccordionContent className="pb-4 leading-relaxed">
                  We currently ship to North America, Europe, and Australia. We're working on expanding our global presence soon!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="font-serif text-xl text-foreground border-b border-border/50 pb-2">Products & Philosophy</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-border/30">
                <AccordionTrigger className="font-medium hover:no-underline hover:text-primary transition-colors py-4">Are your products cruelty-free?</AccordionTrigger>
                <AccordionContent className="pb-4 leading-relaxed">
                  Absolutely. JUSTAGIRL is 100% cruelty-free. We never test on animals at any stage of product development, and we don't work with suppliers who do.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-border/30">
                <AccordionTrigger className="font-medium hover:no-underline hover:text-primary transition-colors py-4">Are your formulas vegan?</AccordionTrigger>
                <AccordionContent className="pb-4 leading-relaxed">
                  The vast majority of our line is vegan. You can find a full list of ingredients on each product page to verify.
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-3" className="border-border/30">
                <AccordionTrigger className="font-medium hover:no-underline hover:text-primary transition-colors py-4">Can I use your products if I have sensitive skin?</AccordionTrigger>
                <AccordionContent className="pb-4 leading-relaxed">
                  Our formulas are designed to be gentle and effective. However, we always recommend patch testing new products or consulting with a dermatologist if you have specific skin concerns.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <section className="p-10 bg-accent/5 border border-border/50 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-serif text-2xl text-foreground">Still have questions?</h3>
            <p className="max-w-md">Our customer success team is here to help you find the perfect routine.</p>
          </div>
          <button className="px-10 py-4 bg-primary text-primary-foreground rounded-full font-bold tracking-widest text-xs uppercase hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            Contact Support
          </button>
        </section>
      </div>
    </InformationLayout>
  );
};

export default FAQ;
