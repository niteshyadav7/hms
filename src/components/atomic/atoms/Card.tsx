"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, className = "", hoverable = false }) => {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        transition: hoverable ? "transform 0.2s ease, box-shadow 0.2s ease" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
