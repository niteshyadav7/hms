"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, Search } from "lucide-react";
import { Button } from "../atoms/Button";

interface SearchWidgetProps {
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: string;
  onSearch?: (checkIn: string, checkOut: string, guests: string) => void;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({
  initialCheckIn = "2024-11-20",
  initialCheckOut = "2024-11-25",
  initialGuests = "2 Adults",
  onSearch,
}) => {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(checkIn, checkOut, guests);
    } else {
      const query = new URLSearchParams();
      if (checkIn) query.set("checkIn", checkIn);
      if (checkOut) query.set("checkOut", checkOut);
      if (guests) query.set("guests", guests);
      router.push(`/rooms?${query.toString()}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0px 0.6rem 2.4rem rgba(0, 0, 0, 0.08)",
        borderRadius: "var(--border-radius-md)",
        padding: "1.25rem 1.5rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1.25rem",
        alignItems: "end",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        color: "#1d1b20",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", textAlign: "left" }}>
        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#494551", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Calendar size={16} /> Check-in
        </label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          style={{
            width: "100%",
            padding: "0.6rem 0.85rem",
            borderRadius: "var(--border-radius-sm)",
            border: "1px solid #cbc4d2",
            backgroundColor: "transparent",
            color: "#1d1b20",
            fontSize: "0.95rem",
            outline: "none",
          }}
          required
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", textAlign: "left" }}>
        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#494551", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Calendar size={16} /> Check-out
        </label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          style={{
            width: "100%",
            padding: "0.6rem 0.85rem",
            borderRadius: "var(--border-radius-sm)",
            border: "1px solid #cbc4d2",
            backgroundColor: "transparent",
            color: "#1d1b20",
            fontSize: "0.95rem",
            outline: "none",
          }}
          required
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", textAlign: "left" }}>
        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#494551", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Users size={16} /> Guests
        </label>
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          style={{
            width: "100%",
            padding: "0.6rem 0.85rem",
            borderRadius: "var(--border-radius-sm)",
            border: "1px solid #cbc4d2",
            backgroundColor: "transparent",
            color: "#1d1b20",
            fontSize: "0.95rem",
            outline: "none",
          }}
        >
          <option value="2 Adults, 1 Child">2 Adults, 1 Child</option>
          <option value="2 Adults">2 Adults</option>
          <option value="4 Adults">4 Adults</option>
          <option value="1 Adult">1 Adult</option>
        </select>
      </div>

      <Button type="submit" variant="primary" style={{ height: "46px", width: "100%", fontSize: "0.95rem" }}>
        <Search size={18} /> Search Availability
      </Button>
    </form>
  );
};
