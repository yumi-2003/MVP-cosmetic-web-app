import PersonalizedRecommendationSection from "@/components/home/PersonalizedRecommendationSection";
import { useEffect } from "react";

const PersonalizedRecommendation = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <PersonalizedRecommendationSection />
    </div>
  );
};

export default PersonalizedRecommendation;
