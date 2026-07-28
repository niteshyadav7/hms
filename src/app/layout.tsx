import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ReduxProvider from "@/components/ReduxProvider";
import ToastProvider from "@/components/ToastProvider";
import ConciergeChatWidget from "@/components/ConciergeChatWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumina Grand | Luxury Resort & HMS",
  description: "Production-ready MVP for Hotel Room Search, Bookings and Administration",
  icons: {
    icon: [
      { url: "/logo.png" },
      { url: "/icon.png" },
    ],
    shortcut: "/logo.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ReduxProvider>
          <ToastProvider />
          <Navbar />
          <main style={{ width: "100%", minHeight: "calc(100vh - 70px)", padding: 0, margin: 0 }}>
            {children}
          </main>
          <ConciergeChatWidget />
        </ReduxProvider>
      </body>
    </html>
  );
}
