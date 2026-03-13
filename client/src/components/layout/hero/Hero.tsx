import heroImg from "@/assets/images/hero.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

const Hero = () => {
  return (
    <section className="relative w-full z-0 h-[70vh]">
      {/* image */}

      <img
        src={heroImg}
        alt="Hero section"
        className="w-full h-full object-cover absolute inset-0"
      />

      <div className="absolute inset-0 bg-black/20"></div>

      {/* content  */}
      <div className="relative mx-auto max-w-7xl px-6 h-full flex items-center">
        <div className="max-w-xl text-white space-y-6">
          <p className="text-xs tracking-[0.3rem] uppercase">
            New Arrivals · Spring 2026
          </p>
          <h1 className="text-4xl md:text-6xl font-light">
            {" "}
            Skin that speaks for itself.
          </h1>
          <p className="text-sm md:text-base">
            Clean formulations. Considered ingredients. Beauty that earns your
            trust.
          </p>
          <Link to="/shop" className="">
            <Button variant="outline" className="rounded-none mt-4">
              <p className="uppercase tracking-wider font-light">
                Shop New Arrivals
              </p>
              <ArrowRight size="8" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
