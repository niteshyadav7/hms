"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookingRef?: string;
  roomName?: string;
}

export function GuestReviewModal({ isOpen, onClose, bookingRef = "LUM-9482", roomName = "Overwater Sanctuary Suite" }: Props) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [cleanliness, setCleanliness] = useState(5);
  const [dining, setDining] = useState(5);
  const [hospitality, setHospitality] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Thank you! Your stay review has been submitted for Lumina Grand Rewards points (+500 Lumina Points added).");
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#cbc4d2]/40 rounded-2xl max-w-lg w-full p-6 aura-shadow space-y-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-[#cbc4d2]/20">
          <div>
            <span className="text-[#4f378a] font-bold text-xs tracking-wider uppercase block">Post-Stay Feedback</span>
            <h3 className="font-extrabold text-lg text-[#1d1b20]">Review Your Luxury Experience</h3>
            <p className="text-xs text-gray-500 mt-0.5">{roomName} • Ref #{bookingRef}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-all border-none bg-transparent cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Overall Star Rating */}
          <div className="text-center bg-[#f8f2fa] p-4 rounded-xl border border-[#cbc4d2]/30 space-y-2">
            <span className="text-xs font-bold text-[#1d1b20] uppercase tracking-wider block">
              Overall Stay Satisfaction
            </span>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl transition-transform hover:scale-125 border-none bg-transparent cursor-pointer"
                >
                  <span
                    className={`material-symbols-outlined ${
                      (hoverRating || rating) >= star ? "text-amber-400 fill-1" : "text-gray-300"
                    }`}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-[#4f378a]">
              {rating === 5 ? "Exceptional (5/5)" : rating === 4 ? "Very Good (4/5)" : "Good (3/5)"}
            </span>
          </div>

          {/* Sub-Ratings */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Cleanliness", value: cleanliness, setter: setCleanliness },
              { label: "Dining", value: dining, setter: setDining },
              { label: "Hospitality", value: hospitality, setter: setHospitality },
            ].map((sub) => (
              <div key={sub.label} className="bg-white p-2.5 rounded-xl border border-[#cbc4d2]/30 text-center">
                <span className="text-[11px] font-bold text-gray-600 block mb-1">{sub.label}</span>
                <select
                  value={sub.value}
                  onChange={(e) => sub.setter(Number(e.target.value))}
                  className="w-full bg-[#f8f2fa] border border-[#cbc4d2]/40 rounded-lg p-1 text-xs font-bold text-[#4f378a] cursor-pointer outline-none"
                >
                  <option value={5}>5 ★ Excellent</option>
                  <option value={4}>4 ★ Good</option>
                  <option value={3}>3 ★ Average</option>
                </select>
              </div>
            ))}
          </div>

          {/* Written Feedback */}
          <div>
            <label className="block text-xs font-bold text-[#1d1b20] uppercase tracking-wider mb-1.5">
              Detailed Comments & Memories
            </label>
            <textarea
              rows={3}
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us what you loved about your overwater suite, dining, or staff..."
              className="w-full bg-[#f8f2fa] border border-[#cbc4d2]/40 rounded-xl p-3 text-xs text-[#1d1b20] outline-none focus:ring-2 focus:ring-[#4f378a] transition-all"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-2 border-t border-[#cbc4d2]/20">
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">stars</span> Earn 500 Lumina Points
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#4f378a] hover:bg-[#3d2a6c] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer shadow-md active:scale-95"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GuestReviewModal;
