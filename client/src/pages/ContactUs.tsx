import InformationLayout from "@/components/layout/InformationLayout";
import { useState } from "react";
import { Mail, MapPin, Phone, Github, Instagram, Twitter } from "lucide-react";
import { toast } from "sonner";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    toast.success("Thank you for your message! Our concierge team will get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <InformationLayout 
      title="Contact Us" 
      subtitle="We'd love to hear from you"
    >
      <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
        <section className="space-y-12">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl text-foreground">Get in touch</h2>
            <p className="opacity-80 leading-relaxed text-lg">
              Have a question about our products, an order, or just want to say hello? 
              Fill out the form and our concierge team will get back to you as soon as possible.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-5 items-start">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-xl text-foreground">Visit Our Atelier</h4>
                <p className="text-sm opacity-70 leading-relaxed">123 Beauty Lane, Suite 400<br />New York, NY 10001</p>
              </div>
            </div>
            <div className="flex gap-5 items-start">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-xl text-foreground">Email Concierge</h4>
                <p className="text-sm opacity-70 leading-relaxed">hello@justagirl.com<br />press@justagirl.com</p>
              </div>
            </div>
            <div className="flex gap-5 items-start">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-xl text-foreground">Call Us</h4>
                <p className="text-sm opacity-70 leading-relaxed">+1 (555) 123-4567<br />Mon–Fri: 9am—6pm EST</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/30 space-y-4">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">Follow our journey</h4>
            <div className="flex gap-4">
              {[Instagram, Twitter, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6 p-8 md:p-12 border border-primary/10 rounded-[2.5rem] bg-accent/5 backdrop-blur-sm shadow-xl shadow-primary/5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-70 ml-1">Name</label>
            <input 
              type="text" 
              placeholder="Your Name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-5 py-4 bg-background border border-border/50 rounded-2xl focus:ring-1 focus:ring-primary outline-none transition-all placeholder:opacity-30"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-70 ml-1">Email</label>
            <input 
              type="email" 
              placeholder="Your Email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-5 py-4 bg-background border border-border/50 rounded-2xl focus:ring-1 focus:ring-primary outline-none transition-all placeholder:opacity-30"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-70 ml-1">Subject</label>
            <input 
              type="text" 
              placeholder="What can we help with?" 
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full px-5 py-4 bg-background border border-border/50 rounded-2xl focus:ring-1 focus:ring-primary outline-none transition-all placeholder:opacity-30"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-70 ml-1">Message</label>
            <textarea 
              rows={5} 
              placeholder="Tell us more..." 
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full px-5 py-4 bg-background border border-border/50 rounded-2xl focus:ring-1 focus:ring-primary outline-none transition-all placeholder:opacity-30 resize-none"
              required
            ></textarea>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full py-5 bg-primary text-primary-foreground rounded-[2rem] font-bold tracking-widest text-xs uppercase hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </InformationLayout>
  );
};

export default ContactUs;
