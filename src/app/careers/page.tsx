"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function CareersPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");

  const positions = [
    {
      title: "Executive Pastry Chef",
      department: "Culinary Arts",
      location: "Lumina Grand Estate",
      type: "Full-Time",
    },
    {
      title: "Head VIP Concierge Manager",
      department: "Guest Relations",
      location: "Lumina Grand Estate",
      type: "Full-Time",
    },
    {
      title: "Lead Sustainability Officer",
      department: "Environmental Operations",
      location: "Lumina Grand Estate",
      type: "Full-Time",
    },
    {
      title: "Front Desk Hospitality Associate",
      department: "Front Office",
      location: "Lumina Grand Estate",
      type: "Full-Time",
    },
  ];

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Application submitted for ${selectedRole || "Career Role"}! Our HR team will reach out within 48 hours.`);
    setSelectedRole(null);
    setApplicantName("");
    setApplicantEmail("");
  };

  return (
    <main className="max-w-[1100px] mx-auto px-6 md:px-12 py-12 text-[#1d1b20]">
      {/* Return Link */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-[#494551] hover:text-[#4f378a] transition-colors group no-underline text-xs font-semibold"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>Back to Home</span>
      </Link>

      {/* Header */}
      <div className="space-y-3 mb-10 pb-6 border-b border-[#cbc4d2]/40">
        <span className="text-[#4f378a] text-xs font-semibold tracking-widest uppercase block">
          JOIN OUR TEAM
        </span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1d1b20]">
          Careers at Lumina Grand
        </h1>
        <p className="text-sm text-[#494551] max-w-2xl">
          Craft extraordinary hospitality experiences alongside global leaders in luxury resort management, culinary innovation, and guest wellness.
        </p>
      </div>

      {/* Open Positions List */}
      <div className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-[#1d1b20]">Open Opportunities</h2>
        <div className="space-y-4">
          {positions.map((pos, idx) => (
            <div
              key={idx}
              className="bg-white aura-shadow p-6 rounded-2xl border border-[#cbc4d2]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#4f378a]/50 transition-all"
            >
              <div>
                <span className="text-[10px] font-bold text-[#4f378a] uppercase tracking-wider block mb-1">
                  {pos.department} • {pos.type}
                </span>
                <h3 className="text-lg font-bold text-[#1d1b20]">{pos.title}</h3>
                <p className="text-xs text-[#494551] flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span>{pos.location}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedRole(pos.title)}
                className="bg-[#4f378a] hover:bg-[#3d2a6c] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all border-none cursor-pointer"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Application Modal */}
      {selectedRole && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#cbc4d2]/40 rounded-2xl p-6 max-w-md w-full aura-shadow space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-[#cbc4d2]/30">
              <h3 className="text-lg font-bold text-[#4f378a]">Apply for {selectedRole}</h3>
              <button
                onClick={() => setSelectedRole(null)}
                className="text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#494551]">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#494551]">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  className="w-full bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#494551]">LinkedIn / Portfolio URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#4f378a] hover:bg-[#3d2a6c] text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all border-none cursor-pointer"
              >
                Submit Career Application
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
