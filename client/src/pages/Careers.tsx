import InformationLayout from "@/components/layout/InformationLayout";

const Careers = () => {
  return (
    <InformationLayout 
      title="Careers" 
      subtitle="Join the beauty revolution"
    >
      <div className="space-y-12">
        <section className="space-y-6">
          <h2 className="font-serif text-3xl text-foreground">Work with us</h2>
          <p className="text-lg">
            At JUSTAGIRL, we are building a team of dreamers, doers, and creators. 
            We value curiosity, transparency, and a passion for making a difference 
            in the beauty industry and the world. 
          </p>
        </section>

        <section className="space-y-8">
          <h3 className="font-serif text-2xl text-foreground">Open Positions</h3>
          <div className="grid gap-6">
            {[
              { title: "Senior Product Formulator", location: "New York, NY", type: "Full-time" },
              { title: "Marketing Strategy Lead", location: "Remote / NY", type: "Full-time" },
              { title: "Customer Experience Manager", location: "Los Angeles, CA", type: "Full-time" },
              { title: "Creative Content Director", location: "London, UK", type: "Full-time" }
            ].map((job, i) => (
              <div key={i} className="p-6 border border-border/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-primary/50 hover:bg-primary/[0.02] transition-all duration-300">
                <div className="space-y-1">
                  <h4 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">{job.title}</h4>
                  <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">{job.location} • {job.type}</p>
                </div>
                <button className="px-8 py-2.5 border border-primary/20 text-primary rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all font-bold tracking-widest text-[10px] uppercase">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="p-10 bg-accent/5 border border-border/50 rounded-3xl space-y-6">
          <h3 className="font-serif text-2xl text-foreground">Don't see a perfect fit?</h3>
          <p className="max-w-xl">We’re always looking for talented individuals who share our vision. Send us your resume and a brief introduction about why you'd like to join the team, and we'll keep you in mind for future openings.</p>
          <a href="mailto:careers@justagirl.com" className="inline-flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs border-b border-primary/30 pb-1 hover:border-primary transition-colors">
            careers@justagirl.com
          </a>
        </section>
      </div>
    </InformationLayout>
  );
};

export default Careers;
