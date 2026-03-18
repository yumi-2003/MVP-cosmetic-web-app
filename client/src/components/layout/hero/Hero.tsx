import heroImg from "@/assets/images/hero.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/icons";
import { Link } from "react-router";

const Hero = () => {
  return (
    <section className="relative w-full z-0 h-[85vh] min-h-[500px]">
      {/* Background Image */}
      <img
        src={heroImg}
        alt="JustaGirl"
        className="w-full h-full object-cover absolute inset-0"
      />

      {/* Subtle overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 h-full flex items-center">
        <div className="max-w-xl text-white space-y-6">
          <p className="text-xs tracking-[0.25em] uppercase font-semibold text-white/90">
            NEW ARRIVALS · SPRING 2026
          </p>
          
          <h1 className="text-5xl md:text-7xl font-light leading-tight font-serif">
            Skin that speaks <br/> for itself.
          </h1>
          
          <p className="text-base md:text-lg text-white/90 font-light max-w-sm">
            Clean formulations. Considered ingredients. Beauty that earns your trust.
          </p>
          
          <div className="pt-4">
            <Link to="/shop">
              <Button 
                variant="outline" 
                className="rounded-none border-white text-white hover:bg-white hover:text-black transition-colors duration-300 h-12 px-8 uppercase tracking-widest text-xs font-semibold backdrop-blur-sm bg-transparent group"
              >
                Shop New Arrivals
                <ArrowRightIcon className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
