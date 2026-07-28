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
  suiteType?: string;
  imageUrl?: string;
  audioDuration?: string;
}

const LUXURY_STORIES = [
  {
    id: "story_1",
    guestName: "Sophia Montgomery",
    location: "New York, USA 🇺🇸",
    suiteType: "Overwater Sanctuary Villa",
    headline: "An Unforgettable Island Oasis",
    comment:
      "The Overwater Sanctuary Villa exceeded every expectation. Waking up to 360° turquoise lagoon views and placing gourmet breakfast orders via the Lumina AI Butler made our stay feel like magic. Will return next season!",
    rating: 5,
    createdAt: "Nov 15, 2024",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    imageUrl: "/images/ethereal_sanctuary_villa.png",
    audioDuration: "0:42",
  },
  {
    id: "story_2",
    guestName: "Alexander Vance",
    location: "London, UK 🇬🇧",
    suiteType: "Epicurean Penthouse Suite",
    headline: "Michelin Dining Meets AI Concierge",
    comment:
      "Aether Michelin dining was world-class. The somatic spa treatments at Celestial Pavilion were deeply rejuvenating. The 24/7 AI Butler answered every request instantly!",
    rating: 5,
    createdAt: "Nov 18, 2024",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    imageUrl: "/images/ethereal_epicure_dining.png",
    audioDuration: "0:38",
  },
  {
    id: "story_3",
    guestName: "Elena Rostova",
    location: "Zurich, Switzerland 🇨🇭",
    suiteType: "Celestial Spa Sanctuary",
    headline: "Bespoke Wellness & Digital Key Access",
    comment:
      "Bespoke VIP hospitality, pristine lagoon waters, and instant NFC digital key suite access. 10/10 hydrotherapy experience!",
    rating: 5,
    createdAt: "Nov 20, 2024",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    imageUrl: "/images/ethereal_spa_sanctuary.png",
    audioDuration: "0:45",
  },
  {
    id: "story_4",
    guestName: "Julian Sterling",
    location: "Sydney, Australia 🇦🇺",
    suiteType: "VIP Presidential Villa",
    headline: "Private Infinity Pool & Sunset Vista",
    comment:
      "The private infinity pool villa offers breathtaking sunset views. Lumina Grand sets the gold standard for luxury resorts.",
    rating: 5,
    createdAt: "Nov 22, 2024",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
    audioDuration: "0:50",
  },
];

export function GuestReviewsSection() {
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [avgRating, setAvgRating] = useState(4.9);
  const [totalReviews, setTotalReviews] = useState(128);

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
      if (json.success && Array.isArray(json.data.reviews)) {
        setReviews(json.data.reviews);
        setAvgRating(json.data.averageRating);
        setTotalReviews(json.data.totalReviews);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  };

  const handleNextStory = () => {
    setIsPlayingAudio(false);
    setActiveStoryIdx((prev) => (prev + 1) % LUXURY_STORIES.length);
  };

  const handlePrevStory = () => {
    setIsPlayingAudio(false);
    setActiveStoryIdx((prev) => (prev - 1 + LUXURY_STORIES.length) % LUXURY_STORIES.length);
  };

  const toggleAudioPostcard = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      toast.success(`🔊 Playing audio postcard from ${currentStory.guestName}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !comment.trim()) {
      toast.error("Please enter your name and story comment.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestName, rating, comment }),
      });
      const json = await res.json();

      if (json.success) {
        toast.success(json.message || "Guest story published!");
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

  const currentStory = LUXURY_STORIES[activeStoryIdx];

  return (
    <section className="py-24 bg-[#fcf9f8] dark:bg-[#121115] relative overflow-hidden text-[#1b1c1c] dark:text-white">
      {/* Glow Effects */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-[#ffe08e]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-[#cae9e0]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1340px] mx-auto px-4 md:px-8 space-y-16 relative z-10">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#d1c5af]/40 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#ffe08e]/30 dark:bg-[#755b00]/30 text-[#755b00] dark:text-[#ffe08e] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-[#c9a227]/40">
              <span className="material-symbols-outlined text-sm text-[#755b00]">graphic_eq</span>
              <span>Interactive Guest Postcard Reel</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#1b1c1c] dark:text-white leading-tight font-display">
              Stories from <br />
              <span className="bg-gradient-to-r from-[#755b00] via-[#c9a227] to-[#48645d] bg-clip-text text-transparent">
                The Maldivian Sanctuary
              </span>
            </h2>
          </div>

          {/* Rating Stat Pill */}
          <div className="bg-white dark:bg-[#1e1c22] p-4 px-6 rounded-2xl border border-[#d1c5af]/50 shadow-md flex items-center gap-4">
            <div className="text-3xl font-black text-[#755b00] dark:text-[#ffe08e] leading-none">
              {avgRating}
            </div>
            <div className="space-y-0.5">
              <div className="text-[#c9a227] text-sm">★★★★★</div>
              <span className="text-[10px] font-extrabold text-[#7f7663] uppercase tracking-wider block">
                {totalReviews}+ Verified Guest Reviews
              </span>
            </div>
          </div>
        </div>

        {/* 🌟 UNIQUE FEATURE: 3D AUDIO-VISUAL STORY POSTCARD REEL */}
        <div className="bg-white dark:bg-[#1e1c22] rounded-[36px] border border-[#d1c5af]/50 shadow-2xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
          
          {/* Left Column: Story Image & Audio Postcard Player */}
          <div className="lg:col-span-6 relative group">
            <div className="relative rounded-[28px] overflow-hidden aspect-[4/3] shadow-xl border-2 border-white/80">
              <img
                src={currentStory.imageUrl}
                alt={currentStory.suiteType}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Suite Pill Overlay */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/20">
                {currentStory.suiteType}
              </div>

              {/* Audio Postcard Button */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-xl p-3.5 rounded-2xl border border-white/40 flex items-center justify-between shadow-lg">
                <button
                  type="button"
                  onClick={toggleAudioPostcard}
                  className="bg-[#755b00] hover:bg-[#584400] text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all border-none cursor-pointer flex items-center gap-2 shadow-md active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">
                    {isPlayingAudio ? "pause_circle" : "play_circle"}
                  </span>
                  <span>{isPlayingAudio ? "Pause Postcard" : "▶ Listen Audio Postcard"}</span>
                </button>

                <div className="flex items-center gap-2">
                  {isPlayingAudio && (
                    <div className="flex items-end gap-1 h-4 px-2">
                      <span className="w-1 bg-[#755b00] h-full animate-bounce" />
                      <span className="w-1 bg-[#c9a227] h-3 animate-bounce delay-100" />
                      <span className="w-1 bg-[#48645d] h-full animate-bounce delay-200" />
                      <span className="w-1 bg-[#755b00] h-2 animate-bounce delay-300" />
                    </div>
                  )}
                  <span className="text-xs font-mono font-bold text-[#1b1c1c] dark:text-white">
                    {currentStory.audioDuration}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Full Narrative & Author Controls */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex text-[#c9a227] text-lg">★★★★★</div>
                <span className="text-xs text-[#7f7663] font-bold">{currentStory.createdAt}</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-[#1b1c1c] dark:text-white font-display leading-snug">
                &ldquo;{currentStory.headline}&rdquo;
              </h3>

              <p className="text-sm md:text-base text-[#4d4635] dark:text-gray-300 leading-relaxed font-body font-medium">
                {currentStory.comment}
              </p>
            </div>

            {/* Author Signature & Story Reel Controls */}
            <div className="pt-6 border-t border-[#d1c5af]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={currentStory.avatarUrl}
                  alt={currentStory.guestName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#755b00]"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-[#1b1c1c] dark:text-white">
                    {currentStory.guestName}
                  </h4>
                  <span className="text-xs text-[#7f7663] font-medium block">
                    {currentStory.location}
                  </span>
                </div>
              </div>

              {/* Navigation Carousel Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevStory}
                  className="p-3 rounded-full bg-[#f6f3f2] dark:bg-[#28252e] hover:bg-[#ffe08e] text-[#1b1c1c] dark:text-white transition-all border-none cursor-pointer flex items-center justify-center"
                  title="Previous Guest Story"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                </button>
                <span className="text-xs font-mono font-extrabold px-2">
                  {activeStoryIdx + 1} / {LUXURY_STORIES.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextStory}
                  className="p-3 rounded-full bg-[#f6f3f2] dark:bg-[#28252e] hover:bg-[#ffe08e] text-[#1b1c1c] dark:text-white transition-all border-none cursor-pointer flex items-center justify-center"
                  title="Next Guest Story"
                >
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* 🌟 UNIQUE FEATURE 2: ETHEREAL PASSPORT JOURNAL PREVIEW & PUBLISH STUDIO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
          
          {/* Left Column (6 Cols): Ethereal Passport & Memory Journal Preview */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-[#755b00] dark:text-[#ffe08e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                Live Passport & Memory Journal Preview
              </span>
              <span className="text-[10px] bg-[#ffe08e]/40 text-[#755b00] px-3 py-1 rounded-full font-bold uppercase border border-[#c9a227]/40">
                Real-Time Preview
              </span>
            </div>
            
            {/* Parchment Certificate / Passport Card */}
            <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#fffdfa] via-[#fcf6eb] to-[#f8f0de] dark:from-[#1e1c22] dark:to-[#25222b] border-2 border-[#c9a227]/60 shadow-[0_20px_50px_rgba(117,91,0,0.12)] space-y-6 relative overflow-hidden">
              
              {/* Top Header: Lumina Gold Wax Seal Stamp & Ribbon */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#755b00] dark:text-[#ffe08e] block">
                    Official Lumina Grand Guest Record
                  </span>
                  <h4 className="text-2xl font-black text-[#1b1c1c] dark:text-white font-display mt-0.5">
                    {guestName ? `"${guestName}'s Stay Journal"` : '"Your Lumina Stay Memory"'}
                  </h4>
                </div>

                {/* 3D Gold Embossed Wax Seal */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c9a227] via-[#755b00] to-[#4b3a00] text-white flex flex-col items-center justify-center shadow-xl border-2 border-[#ffe08e] flex-shrink-0 animate-pulse">
                  <span className="material-symbols-outlined text-lg text-[#ffe08e]">verified</span>
                  <span className="text-[7px] font-black tracking-widest uppercase">LUMINA</span>
                </div>
              </div>

              {/* Dynamic Star Rating & Quote Text */}
              <div className="space-y-3 bg-white/70 dark:bg-black/30 p-5 rounded-2xl border border-[#c9a227]/30 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#c9a227] text-xl">
                    {"★".repeat(rating)}
                  </div>
                  <span className="text-[10px] font-bold bg-[#755b00] text-white px-2.5 py-0.5 rounded-full uppercase">
                    Authenticated Stay
                  </span>
                </div>

                <p className="text-xs md:text-sm text-[#4d4635] dark:text-gray-200 leading-relaxed font-body font-medium italic">
                  &ldquo;{comment || "Your review thoughts, suite memories, and dining experiences will appear here live in real-time as you write in the journal..."}&rdquo;
                </p>
              </div>

              {/* Passport Stamp Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-[#c9a227]/30 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#755b00] to-[#48645d] text-white font-extrabold flex items-center justify-center text-sm shadow-md border border-white">
                    {guestName ? guestName.charAt(0).toUpperCase() : "G"}
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-[#1b1c1c] dark:text-white block">
                      {guestName || "Guest Name"}
                    </span>
                    <span className="text-[10px] text-[#7f7663] font-medium block">
                      Maldives Atoll Sanctuary • 2026
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-mono text-gray-400 block">SERIAL NO.</span>
                  <span className="text-[10px] font-mono font-bold text-[#755b00] dark:text-[#ffe08e]">
                    PASSPORT-LUM-{Math.floor(100000 + Math.random() * 900000)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (6 Cols): Ethereal Story Publisher Form Studio */}
          <div className="lg:col-span-6">
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-[#1e1c22] p-8 md:p-10 rounded-[32px] border border-[#d1c5af]/60 shadow-[0_20px_60px_rgba(117,91,0,0.1)] space-y-6"
            >
              <div>
                <div className="inline-flex items-center gap-2 bg-[#ffe08e]/30 text-[#755b00] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-[#c9a227]/40 mb-2">
                  <span className="material-symbols-outlined text-xs">auto_awesome</span>
                  Guest Experience Journal
                </div>
                <h3 className="text-2xl font-black text-[#1b1c1c] dark:text-white font-display flex items-center gap-2">
                  Publish Your Story
                </h3>
                <p className="text-xs text-[#7f7663] dark:text-gray-400 mt-1 font-medium leading-relaxed">
                  Contribute your memory to Lumina Grand&apos;s luxury resort journal.
                </p>
              </div>

              {/* Guest Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#1b1c1c] dark:text-white block">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Julian Sterling"
                  className="w-full bg-[#f6f3f2] dark:bg-[#28252e] border border-[#d1c5af]/50 rounded-xl px-4 py-3.5 text-xs font-semibold text-[#1b1c1c] dark:text-white outline-none focus:ring-2 focus:ring-[#755b00]"
                />
              </div>

              {/* Interactive Star Rating */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#1b1c1c] dark:text-white block">
                  Rating & Satisfaction
                </label>
                <div className="flex items-center justify-between bg-[#f6f3f2] dark:bg-[#28252e] p-3.5 rounded-xl border border-[#d1c5af]/50">
                  <div className="flex gap-1.5 text-2xl">
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
                              ? "text-amber-400 drop-shadow-sm"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        >
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-black text-[#755b00] dark:text-[#ffe08e] uppercase tracking-wider">
                    {rating === 5
                      ? "5 ★ Exceptional Luxury"
                      : rating === 4
                      ? "4 ★ Outstanding Stay"
                      : `${rating} / 5 Stars`}
                  </span>
                </div>
              </div>

              {/* Story Narrative Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#1b1c1c] dark:text-white block">
                  Your Memory & Experience
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe your overwater suite views, Michelin dining, spa hydrotherapy, or 24/7 AI butler concierge experience..."
                  className="w-full bg-[#f6f3f2] dark:bg-[#28252e] border border-[#d1c5af]/50 rounded-xl p-4 text-xs font-semibold text-[#1b1c1c] dark:text-white outline-none focus:ring-2 focus:ring-[#755b00]"
                />
              </div>

              {/* Shimmering Golden Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#755b00] via-[#c9a227] to-[#48645d] hover:from-[#584400] hover:to-[#304c46] text-white py-4 rounded-xl text-xs font-black shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border-none active:scale-95 disabled:opacity-60"
              >
                <span>{submitting ? "Securing Story..." : "Publish Guest Story to Journal ➔"}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}

export default GuestReviewsSection;
