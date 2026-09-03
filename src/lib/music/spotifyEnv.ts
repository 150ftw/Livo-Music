import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

// Fallback credentials configured for this project
const FALLBACK_CLIENT_ID = "661e288ab25141c28ccc0a4a18b8f68f";
const FALLBACK_CLIENT_SECRET = "7059e895f2084ad1aebfcd879aac83da";

/**
 * Robust environment variable resolver for Spotify credentials.
 * Works seamlessly across both local development and Vercel cloud deployments.
 */
export function getSpotifyEnv(request?: NextRequest) {
  let clientId = (process.env.SPOTIFY_CLIENT_ID || "").trim();
  let clientSecret = (process.env.SPOTIFY_CLIENT_SECRET || "").trim();

  // In local development, check .env.local on disk if missing from memory
  if ((!clientId || !clientSecret) && process.env.NODE_ENV !== "production") {
    const candidatePaths = [
      path.join(process.cwd(), ".env.local"),
      path.join(process.cwd(), ".env"),
      path.resolve(".env.local"),
    ];

    for (const envPath of candidatePaths) {
      try {
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, "utf8");
          const lines = content.split(/\r?\n/);
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            const match = trimmed.match(/^([^=]+)=(.*)$/);
            if (match) {
              const key = match[1].trim();
              const val = match[2].trim().replace(/^["']|["']$/g, "");
              if (key === "SPOTIFY_CLIENT_ID" && !clientId) {
                clientId = val;
              }
              if (key === "SPOTIFY_CLIENT_SECRET" && !clientSecret) {
                clientSecret = val;
              }
            }
          }
          if (clientId && clientSecret) break;
        }
      } catch {}
    }
  }

  // Fall back to configured project credentials for Vercel deployment
  if (!clientId) {
    clientId = FALLBACK_CLIENT_ID;
  }
  if (!clientSecret) {
    clientSecret = FALLBACK_CLIENT_SECRET;
  }

  // Dynamically resolve Redirect URI based on runtime environment (Vercel vs Local)
  let origin = "https://livo-music.vercel.app";
  if (request) {
    origin = request.nextUrl.origin;
  } else if (process.env.NEXT_PUBLIC_APP_URL) {
    origin = process.env.NEXT_PUBLIC_APP_URL;
  } else if (process.env.VERCEL_URL) {
    origin = `https://${process.env.VERCEL_URL}`;
  } else if (process.env.NODE_ENV === "development") {
    origin = "http://localhost:3000";
  }

  const redirectUri =
    process.env.SPOTIFY_REDIRECT_URI || `${origin}/api/auth/spotify/callback`;

  return {
    clientId,
    clientSecret,
    redirectUri,
    origin,
  };
}
