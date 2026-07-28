"use client";

import React, { useState, useEffect } from "react";
import { SearchWidget } from "../molecules/SearchWidget";

const HERO_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=85",
    title: "Overwater Sanctuary",
  },
  {
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85",
    title: "Twilight Infinity Vista",
  },
  {
    url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=85",
    title: "Golden Oceanfront Oasis",
  },
  {
    url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=2000&q=85",
    title: "Panoramic Glass Villa",
  },
];

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        height: "870px",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Hero Background Carousel Images */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url('${slide.url}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: index === currentSlide ? 1 : 0,
              transform: index === currentSlide ? "scale(1)" : "scale(1.05)",
              transition: "all 2000ms ease-in-out",
            }}
          />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.25)", zIndex: 1 }} />
      </div>

      {/* Slide Indicators (Dots) */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          gap: "0.75rem",
        }}
      >
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              height: "10px",
              width: index === currentSlide ? "32px" : "10px",
              borderRadius: "9999px",
              backgroundColor: index === currentSlide ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
              border: "none",
              cursor: "pointer",
              transition: "all 300ms ease",
            }}
            title={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Hero Content Container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          maxWidth: "960px",
          width: "100%",
          padding: "0 1.5rem",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          color: "#ffffff",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            fontWeight: "800",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            fontFamily: "Manrope, sans-serif",
          }}
        >
          Ethereal Luxury, <br />
          Defined by Nature.
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            opacity: 0.95,
            maxWidth: "680px",
            margin: "0 auto",
            lineHeight: 1.6,
            textShadow: "0 2px 10px rgba(0,0,0,0.4)",
          }}
        >
          Experience the pinnacle of bespoke travel in our sanctuary of light and glass, nestled where the sky meets the sea.
        </p>

        {/* Floating Search Widget */}
        <div style={{ marginTop: "1rem" }}>
          <SearchWidget />
        </div>
      </div>
    </section>
  );
};
