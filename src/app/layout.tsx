import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpotifyAuthProvider } from "@/context/SpotifyAuthContext";
import { PlayerProvider } from "@/context/PlayerContext";
import { SearchOverlayProvider } from "@/context/SearchOverlayContext";
import { LivoNav } from "@/components/navigation/LivoNav";
import { FloatingPlayer } from "@/components/player/FloatingPlayer";
import { ExpandedPlayer } from "@/components/player/ExpandedPlayer";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { FullAudioEngine } from "@/components/player/FullAudioEngine";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LIVO — Music Worth Discovering",
  description:
    "A quiet, minimal, cinematic music environment. Curated sound archives, independent artists, and deep nocturnal soundscapes.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark antialiased`}>
      <body className="min-h-screen w-full bg-[#050505] text-[#f5f4f0] font-sans overflow-x-hidden selection:bg-white/20">
        <SpotifyAuthProvider>
          <PlayerProvider>
            <SearchOverlayProvider>
              {/* Minimal Header Navigation */}
              <LivoNav />

              {/* Expansive Canvas Main Body */}
              <main className="min-h-[calc(100vh-4rem)] pb-32">
                {children}
              </main>

              {/* Persistent Floating Minimal Player */}
              <FloatingPlayer />

              {/* Expanded Full-Screen Listening Environment */}
              <ExpandedPlayer />

              {/* Full-Screen Minimalist Search Overlay */}
              <SearchOverlay />

              {/* Full-Length Uninterrupted Audio Engine */}
              <FullAudioEngine />
            </SearchOverlayProvider>
          </PlayerProvider>
        </SpotifyAuthProvider>
      </body>
    </html>
  );
}
