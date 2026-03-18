import { Link } from "react-router";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "@/components/icons";

const BrandcommimentSection = () => {
  return (
    <section className="bg-muted/60 text-foreground py-16">
      <div className="max-w-full mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* left side  */}
          <div className="space-y-6">
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
              Our Commitment
            </p>
            <h1 className="text-3xl md:text-5xl font-light leading-tight">
              Every ingredient <br />
              has a reason
            </h1>
          </div>

          {/* right side  */}
          <div className="space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="text-xs tracking-[0.3em] text-muted-foreground">
                VEGAN
              </h3>
              <p className="text-sm mt-1">
                No animal-derived ingredients, ever.
              </p>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="text-xs tracking-[0.3em] text-muted-foreground">
                CRUELTY-FREE
              </h3>
              <p className="text-sm mt-1">Never tested on animals.</p>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="text-xs tracking-[0.3em] text-muted-foreground">
                CLEAN
              </h3>
              <p className="text-sm mt-1">
                Free from parabens, sulfates, and silicones.
              </p>
            </div>
            <Button asChild variant="link" className="px-0">
              <Link
                to="/shop"
                className="text-sm tracking-widest"
              >
                SHOP SKINCARE <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandcommimentSection;
