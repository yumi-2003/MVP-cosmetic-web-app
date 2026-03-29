import InformationLayout from "@/components/layout/InformationLayout";

const ShippingReturns = () => {
  return (
    <InformationLayout 
      title="Shipping & Returns" 
      subtitle="Delivery and Returns Made Easy"
    >
      <div className="space-y-16">
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl text-foreground">Shipping Policy</h2>
            <p className="opacity-80 leading-relaxed text-lg">
              We strive to process and ship your order as quickly as possible, ensuring 
              your beauty ritual isn't interrupted for long.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="p-8 border border-border/30 rounded-3xl space-y-4 bg-accent/5">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-foreground">Standard Shipping</h3>
              <div className="space-y-1">
                <p className="text-sm font-bold tracking-widest uppercase opacity-60">Estimated Time</p>
                <p className="text-foreground">3—5 Business Days</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold tracking-widest uppercase opacity-60">Cost</p>
                <p className="text-foreground">Free on orders over $50. Otherwise $5.95 flat rate.</p>
              </div>
            </div>

            <div className="p-8 border border-border/30 rounded-3xl space-y-4 bg-accent/5">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-foreground">Express Shipping</h3>
              <div className="space-y-1">
                <p className="text-sm font-bold tracking-widest uppercase opacity-60">Estimated Time</p>
                <p className="text-foreground">1—2 Business Days</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold tracking-widest uppercase opacity-60">Cost</p>
                <p className="text-foreground">$15.00 flat rate for all orders.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl text-foreground">Returns & Exchanges</h2>
            <p className="opacity-80 leading-relaxed">
              If you're not completely satisfied with your purchase, we're here to help. 
              We offer a simple and transparent return process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <ul className="space-y-6">
              {[
                "Returns are accepted within 30 days of purchase date.",
                "Items must be in original packaging and in slightly used or unused condition.",
                "Refunds are processed back to the original payment method.",
                "Standard return shipping is complementary within the continental US."
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                  <span className="text-sm font-medium leading-relaxed opacity-90">{item}</span>
                </li>
              ))}
            </ul>
            <div className="p-8 bg-primary/[0.03] border border-primary/20 rounded-3xl text-center space-y-6 flex flex-col justify-center">
              <h3 className="font-serif text-2xl text-foreground">Initiate a Return</h3>
              <p className="text-sm opacity-80">Ready to start? Simply have your order number and email address handy.</p>
              <button className="px-10 py-4 bg-primary text-primary-foreground rounded-full font-bold tracking-widest text-xs uppercase hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95">
                Start a Return
              </button>
            </div>
          </div>
        </section>

        <section className="pt-8 border-t border-border/30">
          <p className="text-xs text-muted-foreground text-center italic">
            * Please note: For health and safety reasons, we cannot accept returns for heavily used or depleted products.
          </p>
        </section>
      </div>
    </InformationLayout>
  );
};

export default ShippingReturns;
