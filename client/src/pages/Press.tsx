import InformationLayout from "@/components/layout/InformationLayout";

const Press = () => {
  return (
    <InformationLayout 
      title="Press" 
      subtitle="The world is talking about JUSTAGIRL"
    >
      <div className="space-y-12">
        <section className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4 p-8 border border-border/50 rounded-2xl flex flex-col justify-center text-center bg-accent/5 backdrop-blur-sm">
            <h3 className="font-serif text-2xl text-foreground">"The skincare breakthrough of the decade."</h3>
            <p className="text-primary font-bold tracking-widest">— VOGUE</p>
          </div>
          <div className="space-y-4 p-8 border border-border/50 rounded-2xl flex flex-col justify-center text-center bg-accent/5 backdrop-blur-sm">
            <h3 className="font-serif text-2xl text-foreground">"Minimalist beauty that actually works."</h3>
            <p className="text-primary font-bold tracking-widest">— BAZAAR</p>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="font-serif text-3xl text-foreground text-center">Recent Highlights</h2>
          <div className="space-y-6">
            {[
              { date: "MAR 2024", title: "Revolutionizing the Ritual: How JUSTAGIRL is changing daily routines.", desc: "Exclusive Interview with our CEO on the future of clean beauty." },
              { date: "FEB 2024", title: "Top 10 Ethical Beauty Brands to Watch.", desc: "A deep dive into our sustainability practices and ingredient sourcing." },
               { date: "JAN 2024", title: "Winner: Best Cleanser of the Year.", desc: "The Gentle Balancing Cleanser takes the top spot in Beauty Awards 2024." }
            ].map((article, i) => (
              <article key={i} className="pb-6 border-b border-border/5 flex flex-col md:flex-row items-start gap-6 group cursor-pointer">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground w-20 pt-1">{article.date}</div>
                <div className="flex-1">
                  <h4 className="font-serif text-xl text-foreground mb-2 group-hover:text-primary transition-colors">{article.title}</h4>
                  <p className="text-sm leading-relaxed">{article.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="p-10 bg-primary/[0.03] border border-primary/10 rounded-3xl text-center space-y-6">
          <h3 className="font-serif text-2xl text-foreground">Media Inquiries</h3>
          <p className="max-w-md mx-auto">For press releases, high-res assets, or interview requests, please contact our PR team.</p>
          <a href="mailto:press@justagirl.com" className="inline-block px-10 py-4 bg-primary text-primary-foreground rounded-full font-bold tracking-widest text-xs uppercase hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
            press@justagirl.com
          </a>
        </section>
      </div>
    </InformationLayout>
  );
};

export default Press;
