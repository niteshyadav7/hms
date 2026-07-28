"use client";

import HeroSection from "@/components/home/HeroSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import BentoGridSection from "@/components/home/BentoGridSection";
import GuestReviewsSection from "@/components/GuestReviewsSection";
import HomeFooter from "@/components/home/HomeFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden bg-[#fdf7ff]">
      {/* 1. Hero Section with Floating Search Widget */}
      <HeroSection />

      {/* 2. Featured Sanctuaries Collection */}
      <FeaturedSection />

      {/* 3. Curated Experiences Bento Grid */}
      <BentoGridSection />

      {/* 4. Guest Reviews & Star Ratings */}
      <GuestReviewsSection />

      {/* 5. Lumina Grand Footer */}
      <HomeFooter />
    </div>
  );
}
