"use client";

import React, { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  roomTitle?: string;
}

export function VirtualTourModal({
  isOpen,
  onClose,
  roomTitle = "Overwater Ocean Sanctuary Suite",
}: Props) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [activeAngle, setActiveAngle] = useState<"BEDROOM" | "TERRACE" | "BATHROOM">("BEDROOM");

  if (!isOpen) return null;

  const PANORAMA_IMAGES = {
    BEDROOM: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=85",
    TERRACE: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=85",
    BATHROOM: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=2000&q=85",
  };

  const handleRotate = (delta: number) => {
    setRotation((prev) => prev + delta);
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(1.5, Math.max(0.8, prev + delta)));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#1d1b20] border border-white/20 rounded-2xl max-w-4xl w-full h-[85vh] max-h-[720px] flex flex-col aura-shadow overflow-hidden relative text-white">
        {/* Header */}
        <div className="bg-[#4f378a] p-4 px-6 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl">360</span>
            <div>
              <h2 className="text-base font-bold leading-none">360° Interactive Virtual Room Tour</h2>
              <p className="text-xs text-[#e9ddff] mt-1 font-medium">{roomTitle} • Lumina Grand</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all border-none bg-transparent cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Panoramic Viewer Area */}
        <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 ease-out"
            style={{
              backgroundImage: `url('${PANORAMA_IMAGES[activeAngle]}')`,
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          />

          {/* Interactive Orientation Guide Indicator */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive 360° View</span>
          </div>

          {/* Perspective Viewport Switcher */}
          <div className="absolute top-4 right-4 flex gap-2">
            {[
              { id: "BEDROOM", label: "Master Suite" },
              { id: "TERRACE", label: "Private Terrace Pool" },
              { id: "BATHROOM", label: "Spa Bathroom" },
            ].map((angle) => (
              <button
                key={angle.id}
                onClick={() => setActiveAngle(angle.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  activeAngle === angle.id
                    ? "bg-[#4f378a] text-white border-[#e9ddff]"
                    : "bg-black/60 text-white/80 border-white/20 hover:bg-black/80"
                }`}
              >
                {angle.label}
              </button>
            ))}
          </div>

          {/* On-Screen Pan & Zoom Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-xl border border-white/20 p-2 rounded-2xl flex items-center gap-3 shadow-2xl">
            <button
              onClick={() => handleRotate(-15)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/30 text-white transition-all border-none cursor-pointer flex items-center"
              title="Rotate Left"
            >
              <span className="material-symbols-outlined text-xl">rotate_left</span>
            </button>

            <button
              onClick={() => handleRotate(15)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/30 text-white transition-all border-none cursor-pointer flex items-center"
              title="Rotate Right"
            >
              <span className="material-symbols-outlined text-xl">rotate_right</span>
            </button>

            <div className="h-6 w-[1px] bg-white/20" />

            <button
              onClick={() => handleZoom(0.1)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/30 text-white transition-all border-none cursor-pointer flex items-center"
              title="Zoom In"
            >
              <span className="material-symbols-outlined text-xl">zoom_in</span>
            </button>

            <button
              onClick={() => handleZoom(-0.1)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/30 text-white transition-all border-none cursor-pointer flex items-center"
              title="Zoom Out"
            >
              <span className="material-symbols-outlined text-xl">zoom_out</span>
            </button>

            <button
              onClick={() => {
                setRotation(0);
                setZoom(1);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#4f378a] hover:bg-[#3d2a6c] text-white text-xs font-bold transition-all border-none cursor-pointer"
            >
              Reset View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VirtualTourModal;
