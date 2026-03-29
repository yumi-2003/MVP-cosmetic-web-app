import InformationLayout from "@/components/layout/InformationLayout";

const OurStory = () => {
  return (
    <InformationLayout 
      title="Our Story" 
      subtitle="Crafting Beauty with Intention"
    >
      <div className="space-y-8">
        <section>
          <h2 className="font-serif text-2xl text-foreground mb-6 italic">Born from a simple belief: skin should speak for itself.</h2>
          <p className="text-lg">
            Founded in 2024, JUSTAGIRL began as a small laboratory project with one goal: 
            to strip away the unnecessary and focus on the essential. We believe that 
            true beauty isn't something you put on—it's something you nurture.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-12 items-center py-8">
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-foreground">The Philosophy</h3>
            <p>
              We treat skincare as a ritual, not a chore. Our formulas are meticulously 
              crafted using potent botanicals and science-backed active ingredients 
              that respect your skin’s natural barrier.
            </p>
            <p>
              We prioritize transparency above all else. Every ingredient has a purpose, 
              and every formula is tested for efficacy and safety.
            </p>
          </div>
          <div className="aspect-[4/5] bg-muted rounded-2xl overflow-hidden relative group shadow-xl">
             <img 
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop" 
              alt="Lab process" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="font-serif text-xl text-foreground">Our Commitment</h3>
          <p>
            Every product we create is a promise. A promise of transparency, 
            efficacy, and ethical sourcing. We don't just care about how you look today; 
            we care about the health of your skin for a lifetime.
          </p>
          <div className="p-8 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="font-serif text-lg text-primary text-center italic">
              "Beauty is the illumination of your soul."
            </p>
          </div>
        </section>
      </div>
    </InformationLayout>
  );
};

export default OurStory;
