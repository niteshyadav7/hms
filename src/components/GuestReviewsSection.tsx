"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface ReviewItem {
  id: string;
  guestName: string;
  rating: number;
  comment: string;
  createdAt: string;
  headline?: string;
  location?: string;
  avatarUrl?: string;
  cardBg?: string;
}

const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
];

const HEADLINES = [
  "Impressed by the level of attention and care",
  "Highly recommend this resort to anyone in need of a luxury escape",
  "Great experience with Lumina AI Concierge and Michelin dining",
  "I couldn't be happier with the 24/7 service received",
];

const LOCATIONS = [
  "New York, USA",
  "London, UK",
  "Zurich, Switzerland",
  "Sydney, Australia",
];

const CARD_BACKGROUNDS = [
  "bg-[#fdf7ed] border-[#f5e6d3] text-[#4d4635]",
  "bg-[#f0f7f4] border-[#d8ebe3] text-[#304c46]",
  "bg-[#f5f2f8] border-[#e6deee] text-[#423952]",
];

export function GuestReviewsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [avgRating, setAvgRating] = useState(4.9);
  const [totalReviews, setTotalReviews] = useState(128);
  const [loading, setLoading] = useState(true);

  // Form State
  const [guestName, setGuestName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverStar, setHoverStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const json = await res.json();
      if (json.success) {
        const enriched = json.data.reviews.map((r: any, idx: number) => ({
          ...r,
          headline: HEADLINES[idx % HEADLINES.length],
          location: LOCATIONS[idx % LOCATIONS.length],
          avatarUrl: r.avatarUrl || DEFAULT_AVATARS[idx % DEFAULT_AVATARS.length],
          cardBg: CARD_BACKGROUNDS[idx % CARD_BACKGROUNDS.length],
        }));
        setReviews(enriched);
        setAvgRating(json.data.averageRating);
        setTotalReviews(json.data.totalReviews);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !comment.trim()) {
      toast.error("Please enter your name and review comment.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName,
          rating,
          comment,
        }),
      });
      const json = await res.json();

      if (json.success) {
        toast.success(json.message || "Review published!");
        setGuestName("");
        setComment("");
        setRating(5);
        fetchReviews();
      } else {
        toast.error(json.error || "Failed to submit review.");
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const featuredHeroReview = reviews[0] || {
    guestName: "Sophia Montgomery",
    location: "New York, USA",
    headline: "Impressed by the level of attention and care",
    comment:
      "They really go above and beyond to make sure you are taken care of. I am extremely satisfied with the room service ordering and AI butler concierge provided by Lumina Grand. Their Overwater Sanctuary Villa exceeded every expectation. Would highly recommend them to anyone looking for an extraordinary luxury holiday!",
    avatarUrl: DEFAULT_AVATARS[0],
  };

  const gridReviews = reviews.slice(1, 4);

  return (
    <section className="py-24 bg-[#fcf9f8] dark:bg-[#121115] relative overflow-hidden text-[#1b1c1c] dark:text-white">
      {/* Decorative Wavy Swirls Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffe08e]/20 dark:bg-[#755b00]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#cae9e0]/20 dark:bg-[#48645d]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 space-y-16 relative z-10">
        
        {/* 🌟 1. DRIBBBLE HERO FEATURED SHOWCASE CARD */}
        <div className="bg-white dark:bg-[#1e1c22] rounded-[32px] p-8 md:p-12 border border-[#d1c5af]/50 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Big Headline Quote & Story */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-[#755b00] dark:text-[#ffe08e] block">
              Lumina Guest Customer Reviews
            </span>

            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1b1c1c] dark:text-white leading-tight font-display">
              &ldquo;{featuredHeroReview.headline || "Impressed by the level of attention and care"}&rdquo;
            </h2>

            <p className="text-base text-[#4d4635] dark:text-gray-300 leading-relaxed font-body font-medium">
              {featuredHeroReview.comment}
            </p>

            <div className="pt-4 border-t border-[#d1c5af]/30 flex items-center gap-3">
              <div>
                <h4 className="font-bold text-sm text-[#1b1c1c] dark:text-white">
                  {featuredHeroReview.guestName}
                </h4>
                <span className="text-xs text-[#7f7663] dark:text-gray-400 font-medium">
                  {featuredHeroReview.location || "Verified Luxury Traveler"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Res Guest Couple Image & Floating Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[28px] overflow-hidden shadow-2xl border-4 border-[#fcf9f8] dark:border-[#2b2732] aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=85"
                alt="Featured Guest Experience"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Overlapping Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#25222b] p-4 rounded-2xl border border-[#d1c5af]/60 shadow-2xl flex items-center gap-4 max-w-xs animate-in zoom-in-95 duration-300">
              <div className="text-amber-400 text-xl font-bold">★★★★★</div>
              <div>
                <span className="text-xs font-black text-[#1b1c1c] dark:text-white block">
                  {avgRating} out of 5 Stars
                </span>
                <span className="text-[10px] text-[#7f7663] dark:text-gray-400 font-medium block">
                  Average rating from {totalReviews}+ reviews
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 🌟 2. "WE LOVE HEARING FROM OUR GUESTS" SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-3 pt-6">
          <h2 className="text-3xl md:text-5xl font-black text-[#1b1c1c] dark:text-white font-display">
            We love hearing <br />
            <span className="bg-gradient-to-r from-[#755b00] via-[#c9a227] to-[#48645d] bg-clip-text text-transparent">
              from our guests
            </span>
          </h2>
          <p className="text-sm md:text-base text-[#4d4635] dark:text-gray-300 font-medium leading-relaxed">
            See what travelers are saying about Lumina Grand&apos;s overwater sanctuaries, Michelin culinary dining, and 24/7 AI-enhanced butler concierge.
          </p>
        </div>

        {/* 🌟 3. DUAL-COLUMN CONTENT LAYOUT: PASTEL REVIEWS GRID (LEFT) & PUBLISH REVIEW FORM (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 Cols): Pastel Accent Review Cards Feed */}
          <div className="lg:col-span-7 space-y-6">
            {loading ? (
              <div className="p-12 text-center text-xs text-gray-500 font-bold animate-pulse bg-white rounded-3xl border border-[#d1c5af]/30">
                Loading authentic guest feedback...
              </div>
            ) : (
              gridReviews.map((rev) => (
                <div
                  key={rev.id}
                  className={`p-6 rounded-[24px] border ${rev.cardBg || "bg-[#fdf7ed] border-[#f5e6d3] text-[#4d4635]"} shadow-sm space-y-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative`}
                >
                  <h3 className="font-extrabold text-base text-[#1b1c1c] dark:text-white font-display leading-snug">
                    &ldquo;{rev.headline || "Highly recommend this resort to anyone"}&rdquo;
                  </h3>

                  <p className="text-xs md:text-sm opacity-90 leading-relaxed font-body font-medium">
                    {rev.comment}
                  </p>

                  <div className="flex items-center gap-3 pt-2 border-t border-black/5">
                    <img
                      src={rev.avatarUrl || DEFAULT_AVATARS[0]}
                      alt={rev.guestName}
                      className="w-9 h-9 rounded-full object-cover border border-white shadow-xs"
                    />
                    <div>
                      <span className="font-extrabold text-xs text-[#1b1c1c] dark:text-white block">
                        {rev.guestName}
                      </span>
                      <span className="text-[10px] opacity-70 font-medium block">
                        {rev.location || "Verified Guest"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column (5 Cols): "Publish Your Experience" Interactive Form */}
          <div className="lg:col-span-5 sticky top-24">
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-[#1e1c22] p-8 rounded-[32px] border border-[#d1c5af]/50 shadow-xl space-y-6"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#755b00] dark:text-[#ffe08e] block">
                  Guest Experience Feedback
                </span>
                <h3 className="text-xl font-black text-[#1b1c1c] dark:text-white mt-1 font-display flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#755b00]">edit_note</span>
                  Publish Your Experience
                </h3>
                <p className="text-xs text-[#7f7663] dark:text-gray-400 mt-1 font-medium leading-relaxed">
                  Your authentic review helps elevate Lumina Grand&apos;s luxury resort hospitality.
                </p>
              </div>

              {/* Guest Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#1b1c1c] dark:text-white block">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#f6f3f2] dark:bg-[#28252e] border border-[#d1c5af]/40 rounded-xl px-4 py-3 text-xs font-medium text-[#1b1c1c] dark:text-white outline-none focus:ring-2 focus:ring-[#755b00]"
                />
              </div>

              {/* Interactive Star Hover Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#1b1c1c] dark:text-white block">
                  Rating
                </label>
                <div className="flex items-center justify-between bg-[#f6f3f2] dark:bg-[#28252e] p-3 rounded-xl border border-[#d1c5af]/40">
                  <div className="flex gap-1 text-2xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverStar(star)}
                        onMouseLeave={() => setHoverStar(0)}
                        className="transition-transform hover:scale-125 border-none bg-transparent cursor-pointer p-0"
                      >
                        <span
                          className={`${
                            star <= (hoverStar || rating)
                              ? "text-amber-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        >
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-[#755b00] dark:text-[#ffe08e]">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Experience Text Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#1b1c1c] dark:text-white block">
                  Your Experience & Memories
                </label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your overwater suite, dining, or spa experience..."
                  className="w-full bg-[#f6f3f2] dark:bg-[#28252e] border border-[#d1c5af]/40 rounded-xl p-3.5 text-xs font-medium text-[#1b1c1c] dark:text-white outline-none focus:ring-2 focus:ring-[#755b00]"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#755b00] to-[#48645d] hover:from-[#584400] hover:to-[#304c46] text-white py-3.5 rounded-xl text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-none active:scale-95 disabled:opacity-60"
              >
                <span>{submitting ? "Publishing Review..." : "Publish Guest Review ➔"}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}

export default GuestReviewsSection;
