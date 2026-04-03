import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/icons";
import { Link } from "react-router";

// Defined slides with high quality premium Unsplash cosmetic imagery
const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1974", // Woman applying serum
    tagline: "NEW ARRIVALS · SPRING 2026",
    title: "Skin that speaks\nfor itself.",
    subtitle: "Clean formulations. Considered ingredients. Beauty that earns your trust.",
    ctaText: "Shop New Arrivals",
    ctaLink: "/shop",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069", // Woman beautiful glowing skin / makeup
    tagline: "BEST SELLERS",
    title: "The Art of\nthe Glow.",
    subtitle: "Discover the serums and essentials our community can't live without.",
    ctaText: "Explore Best Sellers",
    ctaLink: "/shop",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1515688594390-b649af70d282?q=80&w=2095", // Beauty editorial shot
    tagline: "DAILY ESSENTIALS",
    title: "Pure. Natural.\nTrue.",
    subtitle: "Elevate your daily routine with nutrient-rich botanicals for lasting hydration.",
    ctaText: "Shop Daily Routine",
    ctaLink: "/shop",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1980", // Glowing skin
    tagline: "SKINCARE EDIT",
    title: "Radiance from\nwithin.",
    subtitle: "Unveil your skin's natural brilliance with our award-winning complex.",
    ctaText: "Discover Radiance",
    ctaLink: "/shop",
  },
  {
    id: 5,
    image: "file:///C:/Users/ASUS/.gemini/antigravity/brain/cd1b73f5-fb97-4dde-b7cf-c56ab435c281/cosmetic_product_luxury_skincare_shot_1775199626446.png", 
    tagline: "THE MINIMALIST",
    title: "Less is\nEverything.",
    subtitle: "A curated collection of multi-tasking heroes for effortless beauty.",
    ctaText: "Shop The Edit",
    ctaLink: "/shop",
  },
  {
    id: 6,
    image: "file:///C:/Users/ASUS/.gemini/antigravity/brain/cd1b73f5-fb97-4dde-b7cf-c56ab435c281/cosmetic_product_premium_shot_1775199589952.png", 
    tagline: "SUMMER ESSENTIALS",
    title: "Golden Hour,\nEvery Hour.",
    subtitle: "Protect and nourish while maintaining a sun-kissed luminous finish.",
    ctaText: "Shop Summer",
    ctaLink: "/shop",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071", // Elegant portrait
    tagline: "LUXURY COLLECTION",
    title: "The Standard of\nExcellence.",
    subtitle: "Potent actives and sublime textures for the ultimate transformative experience.",
    ctaText: "Explore Luxury",
    ctaLink: "/shop",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?q=80&w=2071", // Serums
    tagline: "NIGHT ROUTINE",
    title: "Restore While\nYou Rest.",
    subtitle: "Overnight treatments designed to repair cellular damage at peak hours.",
    ctaText: "Shop Evening",
    ctaLink: "/shop",
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1498842812179-c81beecf902c?q=80&w=1974", // Fresh faced
    tagline: "HYDRATION FOCUS",
    title: "Quench Your\nSkin's Thirst.",
    subtitle: "Deep-penetrating moisture binds to skin cells for 48-hour continuous hydration.",
    ctaText: "Shop Hydration",
    ctaLink: "/shop",
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=1974", // Editorial fashion beauty
    tagline: "COLOR PALETTE",
    title: "Exquisite\nPigments.",
    subtitle: "High-performance color cosmetics that treat your skin while delivering impact.",
    ctaText: "Shop Color",
    ctaLink: "/shop",
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1974", // Botanical/essential
    tagline: "SIGNATURE FRAGRANCE",
    title: "Leave An\nImpression.",
    subtitle: "Complex, evocative scents crafted by master perfumers in Grasse.",
    ctaText: "Shop Fragrance",
    ctaLink: "/shop",
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1571781534958-b61adfd11ed3?q=80&w=1974", // Clean beauty bottles
    tagline: "CLEAN BEAUTY",
    title: "Uncompromising\nStandards.",
    subtitle: "Banned from our formulas: over 2,000 questionable ingredients.",
    ctaText: "Our Promise",
    ctaLink: "/shop",
  },
  {
    id: 13,
    image: "https://images.unsplash.com/photo-1450297350677-623de575f31c?q=80&w=1974", // Bath / Body
    tagline: "BODY CARE",
    title: "Head To Toe\nIndulgence.",
    subtitle: "Extend your skincare routine beyond your face with decadent body rituals.",
    ctaText: "Shop Body",
    ctaLink: "/shop",
  },
];

const AUTOPLAY_INTERVAL = 6000; // 6 seconds per slide

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Autoplay functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  // Manual navigation
  const setSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative w-full z-0 h-[85vh] min-h-[500px] overflow-hidden bg-black">
      {/* Background Images Layer */}
      {SLIDES.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div
              className={`absolute inset-0 w-full h-full transform transition-transform duration-[6000ms] ease-linear ${
                isActive ? "scale-105" : "scale-100"
              }`}
            >
              <img
                src={slide.image}
                loading={index === 0 ? "eager" : "lazy"}
                alt={slide.title.replace("\n", " ")}
                className="w-full h-full object-cover object-center"
              />
              {/* Stronger dark gradient overlay to ensure text readability against bright images */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent/10" />
            </div>
          </div>
        );
      })}

      {/* Content Layer */}
      <div className="relative z-20 mx-auto max-w-7xl px-6 h-full flex items-center">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          // Render all slide contents but hide inactive ones to keep DOM structure consistent
          // We use key based animations (fade up) for the active slide.
          if (!isActive) return null;

          return (
            <div
              key={`content-${slide.id}`}
              className="max-w-xl text-white space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out"
            >
              <p className="text-xs tracking-[0.25em] uppercase font-semibold text-white/95 drop-shadow-md">
                {slide.tagline}
              </p>

              <h1 className="text-5xl md:text-7xl font-light leading-tight font-serif whitespace-pre-line drop-shadow-xl text-white">
                {slide.title}
              </h1>

              <p className="text-base md:text-lg text-white/95 font-light max-w-sm drop-shadow-md">
                {slide.subtitle}
              </p>

              <div className="pt-4">
                <Link to={slide.ctaLink}>
                  <Button
                    variant="outline"
                    className="rounded-none border-white text-white hover:bg-white hover:text-black transition-colors duration-300 h-12 px-8 uppercase tracking-widest text-xs font-semibold backdrop-blur-sm bg-black/10 group"
                  >
                    {slide.ctaText}
                    <ArrowRightIcon className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slider Controls (Dots) */}
      <div className="absolute z-20 bottom-6 left-0 right-0 flex justify-center items-center gap-2 flex-wrap px-4">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-8 h-1.5 bg-white"
                : "w-2 h-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
