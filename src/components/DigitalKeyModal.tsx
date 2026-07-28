"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  suiteNumber?: string;
}

export function DigitalKeyModal({ isOpen, onClose, suiteNumber = "Suite 402" }: Props) {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [temperature, setTemperature] = useState(71);
  const [activeLightingScene, setActiveLightingScene] = useState<"SUNSET" | "RELAX" | "FOCUS">("SUNSET");
  const [dndActive, setDndActive] = useState(false);

  if (!isOpen) return null;

  const handleUnlockSuite = () => {
    setIsUnlocking(true);
    setTimeout(() => {
      setIsUnlocking(false);
      setIsUnlocked(true);
      toast.success(`NFC Key Activated! ${suiteNumber} Unlocked.`);
      setTimeout(() => setIsUnlocked(false), 3500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#cbc4d2]/40 rounded-2xl max-w-sm w-full p-6 aura-shadow space-y-6 text-center relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-[#cbc4d2]/20">
          <div className="text-left">
            <h3 className="font-bold text-lg text-[#1d1b20]">Digital Key & Suite Control</h3>
            <p className="text-xs text-[#4f378a] font-semibold">{suiteNumber} • Lumina Grand</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-all border-none bg-transparent cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Animated NFC Key Button */}
        <div className="py-2 flex flex-col items-center justify-center">
          <button
            onClick={handleUnlockSuite}
            disabled={isUnlocking}
            className={`w-32 h-32 rounded-full flex flex-col items-center justify-center gap-2 border-4 transition-all duration-500 cursor-pointer shadow-xl relative group ${
              isUnlocked
                ? "bg-emerald-500 border-emerald-300 text-white scale-105"
                : isUnlocking
                ? "bg-[#4f378a] border-[#e9ddff] text-white animate-pulse"
                : "bg-gradient-to-br from-[#4f378a] to-[#3d2a6c] border-white/80 text-white hover:scale-105"
            }`}
          >
            <span className="material-symbols-outlined text-4xl">
              {isUnlocked ? "lock_open" : isUnlocking ? "key_visualizer" : "contactless"}
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase">
              {isUnlocked ? "Unlocked!" : isUnlocking ? "Validating..." : "Tap to Unlock"}
            </span>
          </button>
          <span className="text-[11px] text-gray-500 mt-3 font-medium">
            Hold your mobile device near door handle NFC sensor
          </span>
        </div>

        {/* Smart Suite Environment Controls */}
        <div className="space-y-4 pt-2 border-t border-[#cbc4d2]/20 text-left">
          <h4 className="text-xs font-bold text-[#1d1b20] uppercase tracking-wider">In-Room Environment</h4>

          {/* Thermostat */}
          <div className="bg-[#f8f2fa] p-3.5 rounded-xl border border-[#cbc4d2]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#4f378a]">thermostat</span>
              <div>
                <span className="block text-xs font-bold text-[#1d1b20]">Climate Temp</span>
                <span className="text-[11px] text-gray-500">Air Conditioning</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTemperature((t) => Math.max(65, t - 1))}
                className="w-7 h-7 rounded-lg bg-white text-[#1d1b20] font-bold border border-[#cbc4d2]/40 hover:bg-[#e9ddff] transition-all cursor-pointer text-xs"
              >
                -
              </button>
              <span className="text-sm font-extrabold text-[#4f378a] w-8 text-center">
                {temperature}°F
              </span>
              <button
                onClick={() => setTemperature((t) => Math.min(80, t + 1))}
                className="w-7 h-7 rounded-lg bg-white text-[#1d1b20] font-bold border border-[#cbc4d2]/40 hover:bg-[#e9ddff] transition-all cursor-pointer text-xs"
              >
                +
              </button>
            </div>
          </div>

          {/* Lighting Scenes */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-gray-500">Lighting Ambience</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "SUNSET", label: "Sunset", icon: "wb_twilight" },
                { id: "RELAX", label: "Relax", icon: "nightlight" },
                { id: "FOCUS", label: "Bright", icon: "light_mode" },
              ].map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => {
                    setActiveLightingScene(scene.id as any);
                    toast.success(`Lighting scene set to ${scene.label}`);
                  }}
                  className={`p-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                    activeLightingScene === scene.id
                      ? "bg-[#4f378a] text-white border-[#4f378a]"
                      : "bg-[#f8f2fa] text-[#494551] border-[#cbc4d2]/30 hover:bg-[#e9ddff]"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{scene.icon}</span>
                  {scene.label}
                </button>
              ))}
            </div>
          </div>

          {/* Do Not Disturb Toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-[#1d1b20]">Do Not Disturb</span>
            <button
              onClick={() => {
                setDndActive(!dndActive);
                toast.success(dndActive ? "Do Not Disturb deactivated" : "Do Not Disturb activated on door display");
              }}
              className={`w-12 h-6 rounded-full p-1 transition-all cursor-pointer border-none ${
                dndActive ? "bg-red-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  dndActive ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DigitalKeyModal;
