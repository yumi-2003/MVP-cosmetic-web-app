import { Link } from "react-router";
import { Button } from "./ui/button";

const BrandcommimentSection = () => {
  return (
    <section className="bg-neutral-900 text-white py-16">
      <div className="max-w-full mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* left side  */}
          <div className="space-y-6">
            <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase">
              Our Commitment
            </p>
            <h1 className="text-3xl md:text-5xl font-light leading-tight">
              Every ingredient <br />
              has a reason
            </h1>
          </div>

          {/* right side  */}
          <div className="space-y-6">
            <div className="border-b border-neutral-700 pb-4">
              <h3 className="text-xs tracking-[0.3em] text-neutral-400">
                VEGAN
              </h3>
              <p className="text-sm mt-1">
                No animal-derived ingredients, ever.
              </p>
            </div>
            <div className="border-b border-neutral-700 pb-4">
              <h3 className="text-xs tracking-[0.3em] text-neutral-400">
                CRUELTY-FREE
              </h3>
              <p className="text-sm mt-1">Never tested on animals.</p>
            </div>
            <div className="border-b border-neutral-700 pb-4">
              <h3 className="text-xs tracking-[0.3em] text-neutral-400">
                CLEAN
              </h3>
              <p className="text-sm mt-1">
                Free from parabens, sulfates, and silicones.
              </p>
            </div>
            <Button asChild className="pl-0">
              <Link
                to="/shop"
                className="text-sm tracking-widest underline underline-offset-4"
              >
                SHOP SKINCARE
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandcommimentSection;
