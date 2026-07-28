"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

interface ChatMessage {
  id: string;
  sender: "concierge" | "guest";
  text: string;
  timestamp: string;
}

export function ConciergeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "concierge",
      text: "Welcome to Lumina Grand 24/7 Concierge! How may I assist your stay today?",
      timestamp: "Just now",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const messageText = textToSend || inputMessage;
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "guest",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");

    // Simulated Concierge response
    setTimeout(() => {
      let replyText = "Certainly! Our concierge team is processing your request right away.";
      const lower = messageText.toLowerCase();

      if (lower.includes("towel") || lower.includes("pillow") || lower.includes("amenity")) {
        replyText = "Extra housekeeping amenities have been dispatched to your suite. Estimated arrival: 5 mins.";
      } else if (lower.includes("airport") || lower.includes("transfer") || lower.includes("cab")) {
        replyText = "Our luxury chauffeur transfer team has been notified for your scheduled arrival/departure!";
      } else if (lower.includes("checkout") || lower.includes("check-out") || lower.includes("late")) {
        replyText = "Complimentary late check-out up to 2:00 PM has been requested for your reservation.";
      } else if (lower.includes("restaurant") || lower.includes("dinner") || lower.includes("food")) {
        replyText = "Table reservation requested for Aether Fine Dining. Our host will confirm via SMS shortly.";
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "concierge",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  const quickPrompts = [
    "Request Extra Pillows & Towels",
    "Book Airport Chauffeur",
    "Request Late Check-out",
    "Reserve Table at Aether Dining",
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[90] bg-[#4f378a] text-white p-4 rounded-full shadow-[0_8px_30px_rgba(79,55,138,0.4)] hover:bg-[#3d2a6c] hover:scale-105 active:scale-95 transition-all cursor-pointer border-none flex items-center justify-center gap-2 group"
        title="24/7 Live Concierge"
      >
        <span className="material-symbols-outlined text-2xl">
          {isOpen ? "close" : "concierge"}
        </span>
        {!isOpen && (
          <span className="hidden md:inline text-xs font-bold pr-1 tracking-wide">
            24/7 Concierge
          </span>
        )}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
      </button>

      {/* Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 z-[90] w-[90vw] max-w-sm h-[520px] bg-white/95 backdrop-blur-2xl border border-[#cbc4d2]/50 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="bg-[#4f378a] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                <span className="material-symbols-outlined text-xl text-white">concierge</span>
              </div>
              <div>
                <h3 className="font-bold text-sm leading-none">Live Concierge Desk</h3>
                <span className="text-[11px] text-[#e9ddff] flex items-center gap-1.5 mt-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  Available 24/7
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all border-none bg-transparent cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8f2fa]/40">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "guest" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    m.sender === "guest"
                      ? "bg-[#4f378a] text-white rounded-br-none"
                      : "bg-white text-[#1d1b20] border border-[#cbc4d2]/30 rounded-bl-none font-medium"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-[#cbc4d2]/20 overflow-x-auto flex gap-2 no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="whitespace-nowrap bg-[#f8f2fa] hover:bg-[#e9ddff] text-[#4f378a] text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all border border-[#cbc4d2]/30 cursor-pointer flex-shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#cbc4d2]/30 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask concierge anything..."
              className="flex-1 bg-[#f8f2fa] border border-[#cbc4d2]/40 rounded-xl px-3.5 py-2 text-xs text-[#1d1b20] focus:ring-2 focus:ring-[#4f378a] focus:border-[#4f378a] outline-none transition-all"
            />
            <button
              type="submit"
              className="bg-[#4f378a] hover:bg-[#3d2a6c] text-white p-2 rounded-xl transition-all border-none cursor-pointer flex items-center justify-center active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ConciergeChatWidget;
