import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ReduxProvider from "@/components/ReduxProvider";
import ToastProvider from "@/components/ToastProvider";
import { NotificationProvider } from "@/components/NotificationProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumina Grand | Ethereal Epicure Luxury Resort",
  description: "Production-ready Luxury Hotel Management & Concierge Platform",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ReduxProvider>
          <NotificationProvider>
            <ToastProvider />
            <Navbar />
            <main style={{ width: "100%", minHeight: "calc(100vh - 70px)", padding: 0, margin: 0 }}>
              {children}
            </main>
          </NotificationProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
