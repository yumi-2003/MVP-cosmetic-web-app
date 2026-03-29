import InformationLayout from "@/components/layout/InformationLayout";

const Sustainability = () => {
  return (
    <InformationLayout 
      title="Sustainability" 
      subtitle="Good for you, Good for the earth"
    >
      <div className="space-y-12">
        <section className="space-y-6">
          <h2 className="font-serif text-3xl text-foreground">A Commitment to the Planet</h2>
          <p>
            Sustainability isn't a goal for us—it's the core of how we operate. 
            From ingredient sourcing to packaging and shipping, we are constantly 
            reimagining our processes to reduce our environmental impact.
          </p>
        </section>

        <section className="grid sm:grid-cols-3 gap-8">
          <div className="space-y-3 p-6 border border-border/50 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors">
            <h3 className="font-serif text-lg text-foreground">Packaging</h3>
            <p className="text-sm">90% of our products use glass or bio-plastic that is 100% recyclable. We minimize secondary packaging to reduce waste.</p>
          </div>
          <div className="space-y-3 p-6 border border-border/50 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors">
            <h3 className="font-serif text-lg text-foreground">Sourcing</h3>
            <p className="text-sm">We partner exclusively with suppliers who practice fair trade and sustainable harvesting of botanical ingredients.</p>
          </div>
          <div className="space-y-3 p-6 border border-border/50 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors">
            <h3 className="font-serif text-lg text-foreground">Waste</h3>
            <p className="text-sm">Our manufacturing facilities aim for 100% carbon neutrality and zero-waste to landfill by optimizing resource use.</p>
          </div>
        </section>

        <section className="space-y-6">
           <h2 className="font-serif text-2xl text-foreground">Long-Term Vision</h2>
           <p>
             By 2030, our goal is to be carbon negative across our entire supply chain. 
             We're investing in reforestation projects and renewable energy to ensure 
             that our legacy is a healthy, beautiful planet for future generations.
           </p>
           <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
             <img 
               src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop" 
               alt="Nature sustainability" 
               className="w-full h-full object-cover"
             />
           </div>
        </section>
      </div>
    </InformationLayout>
  );
};

export default Sustainability;
