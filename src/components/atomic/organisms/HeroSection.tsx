"use client";

import React from "react";
import { SearchWidget } from "../molecules/SearchWidget";

export const HeroSection: React.FC = () => {
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
      {/* Hero Background Image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCC9Fw2uDb5cELlAcXsTRK9KDP8JlUt_7Qhgp9MsJjeRBYp7Cor7Ct6miOpc06Cap_rqSiPx_EbEbmLakv8THJoVn_W_lybRCu7WcXjSh573LJH2ueq2T2sEkmR2_tuxg-P-WbATOxECic-g3mN3V89fKRUAw3Asx5YZCLCl2AO3rSMKEhGxXYGQtC2A4OPNTgTzY27lGW9dE1xxLeiIr-8PviWVQqq-5GFROpBnAYpPJEboM2l492YBfNu61sSqfJ-L6sPprA3dzN5')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          zIndex: 1,
        }}
      />

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
