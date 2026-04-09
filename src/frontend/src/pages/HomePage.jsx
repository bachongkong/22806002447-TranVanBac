import { HeroSection, FeaturesSection, HowItWorksSection, TestimonialsSection, StatsSection } from "@/features/landing/components/home-page-sections";
import { HighlightFeaturesSection } from "@/features/landing/components/highlight-features-section";
import { ResumeBuilderSection } from "@/features/landing/components/resume-builder-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HighlightFeaturesSection />
      <HowItWorksSection />
      <ResumeBuilderSection />
      <TestimonialsSection />
      <StatsSection />
    </>
  );
}
