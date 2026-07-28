"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface ReviewItem {
  id: string;
  guestName: string;
  rating: number;
  comment: string;
  createdAt: string;
  tag?: string;
  avatarUrl?: string;
}

const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
];

const TAGS = [
  "Overwater Villa Guest",
  "Michelin Dining Guest",
  "Wellness & Spa Guest",
  "VIP Presidential Suite",
];

export function GuestReviewsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [avgRating, setAvgRating] = useState(4.9);
  const [totalReviews, setTotalReviews] = useState(128);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

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
          tag: r.tag || TAGS[idx % TAGS.length],
          avatarUrl: r.avatarUrl || DEFAULT_AVATARS[idx % DEFAULT_AVATARS.length],
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

  const filteredReviews = reviews
    .filter((r) => {
      if (activeCategory === "5STARS") return r.rating === 5;
      if (activeCategory === "VILLA") return r.tag?.includes("Villa") || r.tag?.includes("Suite");
      return true;
    })
    .slice(0, 4);

  return (
    <section className="py-20 bg-gradient-to-b from-[#f8f5fa] via-white to-[#f4eff9] dark:from-[#18161c] dark:via-[#1d1b20] dark:to-[#141218] border-t border-[#cbc4d2]/30 text-[#1d1b20] dark:text-white relative overflow-hidden">
      {/* Ambient Decorative Blurs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#e9ddff]/40 dark:bg-[#4f378a]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-200/30 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1340px] mx-auto px-4 md:px-8 space-y-14 relative z-10">
        {/* Section Title & Rating Hero Banner */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#cbc4d2]/30 pb-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#e9ddff] dark:bg-[#4f378a]/50 text-[#4f378a] dark:text-amber-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-[#4f378a]/20">
              <span className="material-symbols-outlined text-sm text-amber-500 animate-spin">
                stars
              </span>
              <span>Verified Guest Stories & Hospitality</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#1d1b20] dark:text-white leading-tight">
              Testimonials from <span className="text-[#4f378a] dark:text-amber-300">Paradise</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl font-medium leading-relaxed">
              Discover authentic reviews from travelers who experienced Lumina Grand&apos;s overwater sanctuaries, Michelin culinary dining, and 24/7 AI-enhanced butler concierge.
            </p>
          </div>

          {/* Luxury Rating Stat Badge */}
          <div className="glass-panel p-6 rounded-3xl border border-white/80 dark:border-white/10 shadow-2xl bg-white/80 dark:bg-[#232029]/80 backdrop-blur-xl flex items-center gap-6 flex-shrink-0">
            <div className="text-center border-r border-[#cbc4d2]/40 pr-6">
              <div className="text-5xl font-black text-[#4f378a] dark:text-amber-300 leading-none tracking-tighter">
                {avgRating}
              </div>
              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest block mt-1.5">
                Out of 5.0 Rating
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex text-amber-400 text-xl gap-1">
                {"★".repeat(Math.round(avgRating))}
              </div>
              <span className="text-xs font-black text-[#1d1b20] dark:text-white block">
                {totalReviews}+ Verified Guest Stays
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">verified</span> 100% Authenticated Reviews
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategory("ALL")}
              className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer border-none shadow-xs ${activeCategory === "ALL"
                  ? "bg-[#4f378a] text-white shadow-md scale-105"
                  : "bg-white dark:bg-[#232029] text-gray-600 dark:text-gray-300 hover:bg-[#e9ddff]/50"
                }`}
            >
              All Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveCategory("5STARS")}
              className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer border-none shadow-xs ${activeCategory === "5STARS"
                  ? "bg-[#4f378a] text-white shadow-md scale-105"
                  : "bg-white dark:bg-[#232029] text-gray-600 dark:text-gray-300 hover:bg-[#e9ddff]/50"
                }`}
            >
              5 ★ Exceptional Only
            </button>
            <button
              onClick={() => setActiveCategory("VILLA")}
              className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer border-none shadow-xs ${activeCategory === "VILLA"
                  ? "bg-[#4f378a] text-white shadow-md scale-105"
                  : "bg-white dark:bg-[#232029] text-gray-600 dark:text-gray-300 hover:bg-[#e9ddff]/50"
                }`}
            >
              Overwater Sanctuary Stays
            </button>
          </div>

          <span className="text-xs text-gray-500 font-bold hidden sm:block">
            Showing {filteredReviews.length} Verified Reviews
          </span>
        </div>

        {/* Content Layout: Testimonial Cards Grid (Left 8 Cols) & Submit Form (Right 4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Modern Glassmorphic Cards */}
          <div className="lg:col-span-8 space-y-6">
            {loading ? (
              <div className="p-12 text-center text-xs text-gray-500 font-bold animate-pulse bg-white/70 rounded-3xl border border-[#cbc4d2]/30">
                Loading authentic guest feedback...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="group bg-white dark:bg-[#232029] p-6 rounded-3xl border border-[#cbc4d2]/30 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between gap-6"
                  >
                    {/* Background Translucent Quote Watermark */}
                    <span className="material-symbols-outlined text-7xl text-[#4f378a]/5 dark:text-white/5 absolute -right-3 -bottom-3 pointer-events-none select-none">
                      format_quote
                    </span>

                    <div className="space-y-4 relative z-10">
                      {/* Top Header: Avatar, Name & Category Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {rev.avatarUrl ? (
                            <img
                              src={rev.avatarUrl}
                              alt={rev.guestName}
                              className="w-11 h-11 rounded-full object-cover border-2 border-[#4f378a]/30 shadow-md group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#4f378a] to-amber-500 text-white flex items-center justify-center font-black text-sm shadow-md">
                              {rev.guestName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-extrabold text-sm text-[#1d1b20] dark:text-white leading-tight">
                              {rev.guestName}
                            </h4>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 mt-0.5">
                              <span className="material-symbols-outlined text-[13px]">verified</span> Verified Stay
                            </span>
                          </div>
                        </div>

                        {/* Star Rating */}
                        <div className="flex text-amber-400 text-sm bg-amber-400/10 px-2 py-1 rounded-full border border-amber-400/20">
                          {"★".repeat(rev.rating)}
                        </div>
                      </div>

                      {/* Tag Pill */}
                      {rev.tag && (
                        <span className="inline-block bg-[#f8f5fa] dark:bg-[#18161c] text-[#4f378a] dark:text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-lg border border-[#cbc4d2]/30 uppercase tracking-wider">
                          {rev.tag}
                        </span>
                      )}

                      {/* Review Content Quote */}
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic">
                        &quot;{rev.comment}&quot;
                      </p>
                    </div>

                    {/* Footer Date */}
                    <div className="border-t border-[#cbc4d2]/20 dark:border-white/10 pt-3 flex justify-between items-center text-[10px] text-gray-400 font-bold">
                      <span>Lumina Grand Member</span>
                      <span>
                        {new Date(rev.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Write a Review Form */}
          <div className="lg:col-span-4 bg-white dark:bg-[#232029] p-7 rounded-3xl border border-[#cbc4d2]/40 dark:border-white/10 shadow-xl space-y-6 h-fit sticky top-24">
            <div className="border-b border-[#cbc4d2]/30 pb-4">
              <span className="text-[#4f378a] dark:text-amber-300 text-[10px] font-black uppercase tracking-widest block mb-1">
                Guest Experience Feedback
              </span>
              <h3 className="text-lg font-black text-[#1d1b20] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4f378a] dark:text-amber-300">
                  rate_review
                </span>
                Publish Your Experience
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium leading-relaxed">
                Your authentic review helps elevate Lumina Grand&apos;s luxury resort hospitality.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full bg-[#f8f5fa] dark:bg-[#18161c] border border-[#cbc4d2]/40 dark:border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#4f378a] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-2 bg-[#f8f5fa] dark:bg-[#18161c] p-3 rounded-xl border border-[#cbc4d2]/40 dark:border-white/10 justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverStar(star)}
                        onMouseLeave={() => setHoverStar(0)}
                        className={`text-2xl transition-transform cursor-pointer border-none bg-transparent ${(hoverStar || rating) >= star
                            ? "text-amber-400 scale-110"
                            : "text-gray-300 dark:text-gray-600"
                          }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-black text-[#4f378a] dark:text-amber-300">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">
                  Your Experience & Memories
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your overwater suite, dining, or spa experience..."
                  rows={4}
                  required
                  className="w-full bg-[#f8f5fa] dark:bg-[#18161c] border border-[#cbc4d2]/40 dark:border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#4f378a] resize-none transition-all font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#4f378a] hover:bg-[#3d2a6c] text-white py-3.5 rounded-xl text-xs font-black shadow-lg transition-all cursor-pointer active:scale-95 border-none flex items-center justify-center gap-2"
              >
                <span>{submitting ? "Publishing Review..." : "Publish Guest Review"}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GuestReviewsSection;
