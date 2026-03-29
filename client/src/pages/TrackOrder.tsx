import InformationLayout from "@/components/layout/InformationLayout";
import { useState } from "react";
import { useNavigate } from "react-router";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId) {
      // Redirect to the existing tracking page
      navigate(`/tracking/${orderId}`);
    }
  };

  return (
    <InformationLayout 
      title="Track Order" 
      subtitle="Where is my beauty?"
    >
      <div className="max-w-lg mx-auto space-y-12">
        <section className="text-center space-y-4">
          <h2 className="font-serif text-3xl text-foreground">Track Your Order</h2>
          <p className="opacity-80 leading-relaxed">
            Enter your order details below to see the current status of your shipment. 
            Everything from processing to final delivery, at your fingertips.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6 p-8 md:p-12 bg-white dark:bg-card border border-border/30 rounded-3xl shadow-xl shadow-primary/5">
          <div className="space-y-2">
            <label htmlFor="orderId" className="text-[10px] font-bold tracking-widest uppercase opacity-70 ml-1">Order Number</label>
            <input 
              id="orderId"
              type="text" 
              placeholder="e.g. 660235f..." 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-5 py-4 bg-background border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:opacity-30"
              required
            />
            <p className="text-[10px] opacity-40 ml-1 italic italic">Found in your confirmation email.</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-[10px] font-bold tracking-widest uppercase opacity-70 ml-1">Billing Email</label>
            <input 
              id="email"
              type="email" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-background border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:opacity-30"
              required
            />
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold tracking-widest text-xs uppercase hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] hover:shadow-xl hover:shadow-primary/30">
              Find My Order
            </button>
          </div>
        </form>

        <section className="text-center p-8 bg-primary/[0.03] border border-primary/10 rounded-3xl space-y-4">
          <p className="text-sm opacity-80 max-w-sm mx-auto leading-relaxed">
            Having trouble finding your order details? Our concierge team is ready to assist you.
          </p>
          <a href="/contact" className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-primary border-b border-primary/20 pb-1 hover:border-primary transition-all">
            Get Support
          </a>
        </section>
      </div>
    </InformationLayout>
  );
};

export default TrackOrder;
