import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpotifyAuthProvider } from "@/context/SpotifyAuthContext";
import { PlayerProvider } from "@/context/PlayerContext";
import { SearchOverlayProvider } from "@/context/SearchOverlayContext";
import { Sidebar } from "@/components/navigation/Sidebar";
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
    <html lang="en" className={`${inter.variable} dark antialiased`} suppressHydrationWarning>
      <body
        className="min-h-screen w-full bg-[#000] text-white font-sans overflow-x-hidden selection:bg-[#1ed760]/30"
        suppressHydrationWarning
      >
        <SpotifyAuthProvider>
          <PlayerProvider>
            <SearchOverlayProvider>
              {/* Persistent Left Sidebar (Desktop) */}
              <Sidebar />

              {/* Main Content Area — offset by sidebar on desktop */}
              <div className="md:ml-[var(--sidebar-width)] min-h-screen flex flex-col bg-[#121212]">
                {/* Slim Top Bar */}
                <LivoNav />

                {/* Scrollable Content Canvas */}
                <main className="flex-1 pb-32 rounded-t-xl overflow-hidden">
                  {children}
                </main>
              </div>

              {/* Persistent Floating Player */}
              <FloatingPlayer />

              {/* Expanded Full-Screen Listening Environment */}
              <ExpandedPlayer />

              {/* Full-Screen Search Overlay */}
              <SearchOverlay />

              {/* Full-Length Audio Engine */}
              <FullAudioEngine />
            </SearchOverlayProvider>
          </PlayerProvider>
        </SpotifyAuthProvider>
      </body>
    </html>
  );
}
