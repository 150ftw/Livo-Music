import fs from "fs";
import path from "path";

/**
 * Robust environment variable resolver for Spotify credentials.
 * Checks process.env first, and gracefully falls back to reading .env.local
 * from disk if the server was booted before .env.local was created or modified.
 */
export function getSpotifyEnv() {
  let clientId = process.env.SPOTIFY_CLIENT_ID || "";
  let clientSecret = process.env.SPOTIFY_CLIENT_SECRET || "";
  let redirectUri =
    process.env.SPOTIFY_REDIRECT_URI ||
    "http://localhost:3000/api/auth/spotify/callback";

  if (!clientId || !clientSecret) {
    try {
      const envPath = path.join(process.cwd(), ".env.local");
      if (fs.existsSync(envPath)) {
        const lines = fs.readFileSync(envPath, "utf8").split("\n");
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
            continue;
          }
          const eqIdx = trimmed.indexOf("=");
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");

          if (key === "SPOTIFY_CLIENT_ID" && !clientId) {
            clientId = val;
          }
          if (key === "SPOTIFY_CLIENT_SECRET" && !clientSecret) {
            clientSecret = val;
          }
          if (key === "SPOTIFY_REDIRECT_URI" && !process.env.SPOTIFY_REDIRECT_URI) {
            redirectUri = val;
          }
        }
      }
    } catch (e) {
      console.error("Failed to read .env.local fallback:", e);
    }
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
  };
}
