"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "react-hot-toast";

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  actionType?: "INFO" | "ROOM_SEARCH" | "MY_BOOKINGS" | "ORDER_DINING" | "BOOK_SPA" | "USER_PROFILE" | "BOOKING_CONFIRMED" | "DINING_DISPATCHED" | "SPA_RESERVED";
  payloadData?: any;
  directLink?: { label: string; url: string } | null;
  groundednessScore?: number;
  isSafe?: boolean;
  citations?: Array<{ sourceId: string; sourceTitle: string; matchedSnippet: string }>;
  timestamp: string;
  isInitial?: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const FALLBACK_ROOM_IMAGE = "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80";

/**
 * ChatGPT-Style Typewriter Streaming Text Component
 */
function TypewriterText({ text, speed = 12 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    setIsTyping(true);
    setDisplayedText("");

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => text.substring(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      {isTyping && (
        <span className="inline-block w-1.5 h-3.5 bg-[#4f378a] dark:bg-amber-300 ml-0.5 animate-pulse align-middle rounded-full" />
      )}
    </span>
  );
}

export function AiModeDrawer({ isOpen, onClose }: Props) {
  const { user } = useAppSelector((state) => state.auth);
  const [input, setInput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const initialGreeting: ChatMessage = {
    id: "init_1",
    sender: "ai",
    text: "Greetings! I am Lumina AI Assistant, powered by ReAct Agentic Reasoning & Supabase pgvector RAG. How may I orchestrate your luxury stay today?",
    groundednessScore: 100,
    isSafe: true,
    isInitial: true,
    directLink: { label: "Browse All Overwater Rooms & Suites ➔", url: "/rooms" },
    citations: [{ sourceId: "prisma_db", sourceTitle: "Prisma DB & Supabase pgvector", matchedSnippet: "Live hotel database" }],
    timestamp: "Just now",
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleNewChat = () => {
    setMessages([
      {
        ...initialGreeting,
        id: Date.now().toString(),
      },
    ]);
    setInput("");
    toast.success("New AI session initialized");
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          userEmail: user?.email,
        }),
      });
      const json = await res.json();

      if (json.success) {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: json.data.replyText,
          actionType: json.data.actionType,
          payloadData: json.data.payloadData,
          directLink: json.data.directLink,
          groundednessScore: json.data.groundednessScore || 100,
          isSafe: json.data.isSafe !== undefined ? json.data.isSafe : true,
          citations: json.data.citations || [],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        toast.error("ReAct Agent response failed.");
      }
    } catch (err: any) {
      toast.error(`ReAct Agent error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "Who am I?",
    "Book Overwater Suite from 2024-11-20 to 2024-11-25",
    "Order Truffle Eggs Benedict to my suite",
    "Book Celestial Lunar Massage for tomorrow",
    "Show overwater suites under ₹70,000",
  ];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[110] flex items-center justify-end bg-black/75 backdrop-blur-md animate-in fade-in duration-250"
    >
      <div
        className={`bg-white dark:bg-[#121115] h-full shadow-2xl flex flex-col border-l border-[#cbc4d2]/30 relative overflow-hidden text-[#1d1b20] dark:text-white transition-all duration-300 ${
          isFullscreen ? "w-full max-w-none" : "w-full max-w-xl"
        }`}
      >
        {/* Sleek Top Header Bar */}
        <div className="bg-gradient-to-r from-[#3d2a6c] via-[#4f378a] to-[#2a1b4e] text-white px-5 py-4 flex items-center justify-between shadow-lg border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner flex-shrink-0">
              <span className="material-symbols-outlined text-2xl text-amber-300 animate-pulse">auto_awesome</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight leading-none">Lumina AI Assistant</h2>
                <span className="bg-amber-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  ReAct Agent
                </span>
              </div>
              <p className="text-[11px] text-[#e9ddff] mt-1 font-medium opacity-90">
                {user ? `VIP Member: ${user.name}` : "Guest Mode • 24/7 AI Concierge"}
              </p>
            </div>
          </div>

          {/* Right Header Action Buttons */}
          <div className="flex items-center gap-2">
            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className="bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border border-white/20 cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap active:scale-95"
              title="Start a New AI Chat Session"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>New Chat</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all border-none bg-transparent cursor-pointer flex items-center justify-center"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
            >
              <span className="material-symbols-outlined text-lg">
                {isFullscreen ? "fullscreen_exit" : "fullscreen"}
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all border-none bg-transparent cursor-pointer flex items-center justify-center"
              title="Close Drawer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Chat Body Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#f8f5fa]/60 dark:bg-[#18161c] no-scrollbar">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
              {/* Message Bubble */}
              <div
                className={`max-w-[90%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm transition-all ${
                  m.sender === "user"
                    ? "bg-[#4f378a] text-white rounded-br-none font-medium shadow-md"
                    : "bg-white dark:bg-[#232029] border border-[#cbc4d2]/30 dark:border-white/10 rounded-bl-none text-[#1d1b20] dark:text-gray-100 font-medium"
                }`}
              >
                {/* Header Badge Inside Message */}
                <div className="flex items-center justify-between gap-2 mb-2 text-[11px] font-bold">
                  {m.sender === "ai" ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[#4f378a] dark:text-amber-300 flex items-center gap-1 font-extrabold">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span> Lumina ReAct Agent
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[9px] px-2 py-0.5 rounded-full font-black flex items-center gap-1 border border-emerald-300/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {m.groundednessScore || 100}% Fact Check
                      </span>
                    </div>
                  ) : (
                    <span className="opacity-90">{user ? user.name : "Guest"}</span>
                  )}
                  <span className="text-[10px] opacity-60 font-normal">{m.timestamp}</span>
                </div>

                {/* Main Message Text */}
                <div className="text-[12px] leading-relaxed">
                  {m.sender === "ai" && !m.isInitial ? (
                    <TypewriterText text={m.text} speed={12} />
                  ) : (
                    m.text
                  )}
                </div>

                {/* Direct Navigation Action Link */}
                {m.sender === "ai" && m.directLink && (
                  <div className="mt-3 pt-2.5 border-t border-[#cbc4d2]/20 dark:border-white/10">
                    <Link
                      href={m.directLink.url}
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 bg-[#4f378a] hover:bg-[#3d2a6c] text-white px-3.5 py-2 rounded-xl text-[11px] font-extrabold no-underline shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <span>{m.directLink.label}</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                  </div>
                )}

                {/* Generative UI Cards for ROOM_SEARCH */}
                {m.actionType === "ROOM_SEARCH" && Array.isArray(m.payloadData) && m.payloadData.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {m.payloadData.map((room: any) => (
                      <div key={room.id} className="p-3 bg-[#f8f2fa] dark:bg-[#18161c] rounded-2xl border border-[#cbc4d2]/30 dark:border-white/10 flex items-center justify-between gap-3 shadow-xs hover:border-[#4f378a]/50 transition-all">
                        <img
                          src={room.image && typeof room.image === "string" && room.image.startsWith("http") ? room.image : FALLBACK_ROOM_IMAGE}
                          alt={room.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_ROOM_IMAGE;
                          }}
                          className="w-14 h-14 object-cover rounded-xl flex-shrink-0 border border-[#cbc4d2]/20"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-xs text-[#1d1b20] dark:text-white truncate">{room.name}</h4>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{room.description || "Luxury Overwater Suite"}</p>
                          <div className="text-[11px] font-extrabold text-[#4f378a] dark:text-amber-300 mt-0.5">
                            ₹{room.price?.toLocaleString()} / night
                          </div>
                        </div>
                        <Link
                          href={`/rooms/${room.id}`}
                          onClick={onClose}
                          className="bg-[#4f378a] hover:bg-[#3d2a6c] text-white px-3 py-1.5 rounded-xl text-[10px] font-extrabold no-underline flex-shrink-0 shadow-xs active:scale-95"
                        >
                          View Suite ➔
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {/* Agentic Execution Card for BOOKING_CONFIRMED */}
                {m.actionType === "BOOKING_CONFIRMED" && m.payloadData && (
                  <div className="mt-3 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300/60 dark:border-emerald-700/60 space-y-2 shadow-xs">
                    <div className="flex justify-between items-center text-emerald-900 dark:text-emerald-300 font-extrabold">
                      <span className="flex items-center gap-1.5 text-xs">
                        <span className="material-symbols-outlined text-base text-emerald-600">verified</span> 🎉 Reservation Confirmed!
                      </span>
                      <span className="bg-emerald-200 text-emerald-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                        Prisma DB Created
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-700 dark:text-gray-200 space-y-1">
                      <div><strong>Guest:</strong> {m.payloadData.guestName}</div>
                      <div><strong>Suite:</strong> {m.payloadData.roomName}</div>
                      <div><strong>Dates:</strong> {m.payloadData.checkIn} to {m.payloadData.checkOut}</div>
                      <div className="font-extrabold text-[#4f378a] dark:text-amber-300 text-xs mt-1">
                        Total Amount: ₹{m.payloadData.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Agentic Execution Card for DINING_DISPATCHED */}
                {m.actionType === "DINING_DISPATCHED" && m.payloadData && (
                  <div className="mt-3 p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-300/60 dark:border-amber-700/60 space-y-1.5 shadow-xs">
                    <div className="flex justify-between items-center text-amber-950 dark:text-amber-300 font-extrabold">
                      <span className="flex items-center gap-1.5 text-xs">
                        <span className="material-symbols-outlined text-base text-amber-600">restaurant</span> 🍽️ Kitchen Order Dispatched
                      </span>
                      <span className="bg-amber-200 text-amber-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                        ETA: {m.payloadData.eta}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-700 dark:text-gray-200">
                      Item: {m.payloadData.quantity}x {m.payloadData.itemName} • Total: ₹{m.payloadData.totalAmount.toLocaleString()}
                    </div>
                  </div>
                )}

                {/* Agentic Execution Card for SPA_RESERVED */}
                {m.actionType === "SPA_RESERVED" && m.payloadData && (
                  <div className="mt-3 p-3.5 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-300/60 dark:border-purple-700/60 space-y-1.5 shadow-xs">
                    <div className="flex justify-between items-center text-[#4f378a] dark:text-amber-300 font-extrabold">
                      <span className="flex items-center gap-1.5 text-xs">
                        <span className="material-symbols-outlined text-base">spa</span> 🌿 Spa Appointment Scheduled
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-700 dark:text-gray-200">
                      Treatment: {m.payloadData.treatmentName} • Slot: {m.payloadData.dateTime}
                    </div>
                  </div>
                )}

                {/* Citation Sources Accordion */}
                {m.sender === "ai" && Array.isArray(m.citations) && m.citations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[#cbc4d2]/20 dark:border-white/10 text-[10px] text-gray-500">
                    <span className="font-bold text-[#4f378a] dark:text-amber-300 block mb-1">
                      📚 Verified Database Sources:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {m.citations.map((c, idx) => (
                        <span key={idx} className="bg-[#f8f2fa] dark:bg-[#18161c] border border-[#cbc4d2]/40 dark:border-white/10 px-2 py-0.5 rounded-md font-semibold text-gray-700 dark:text-gray-300">
                          {c.sourceTitle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#4f378a] dark:text-amber-300 font-extrabold p-3 bg-white dark:bg-[#232029] rounded-2xl w-fit shadow-xs border border-[#cbc4d2]/30 animate-pulse">
              <span className="material-symbols-outlined text-sm animate-spin">sync</span>
              Lumina ReAct Agent is executing Thought-Action-Observation loop...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Prompts Pills */}
        <div className="px-4 py-2.5 bg-white dark:bg-[#121115] border-t border-[#cbc4d2]/20 dark:border-white/10 flex gap-2 overflow-x-auto no-scrollbar">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="whitespace-nowrap bg-[#f8f2fa] dark:bg-[#232029] hover:bg-[#e9ddff] dark:hover:bg-[#4f378a] text-[#4f378a] dark:text-amber-300 hover:text-[#3d2a6c] dark:hover:text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-full transition-all border border-[#cbc4d2]/40 dark:border-white/10 cursor-pointer flex-shrink-0 shadow-2xs active:scale-95"
            >
              ✨ {p}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-white dark:bg-[#121115] border-t border-[#cbc4d2]/30 dark:border-white/10 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell Lumina ReAct Agent 'Book suite for Nov 20-25' or 'Order room service'..."
            className="flex-1 bg-[#f8f2fa] dark:bg-[#232029] border border-[#cbc4d2]/40 dark:border-white/10 rounded-2xl px-4 py-3 text-xs text-[#1d1b20] dark:text-white outline-none focus:ring-2 focus:ring-[#4f378a] dark:focus:ring-amber-300 font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#4f378a] hover:bg-[#3d2a6c] text-white px-5 py-3 rounded-2xl transition-all border-none cursor-pointer flex items-center justify-center font-bold text-xs active:scale-95 shadow-md"
          >
            <span className="material-symbols-outlined text-base">send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AiModeDrawer;
