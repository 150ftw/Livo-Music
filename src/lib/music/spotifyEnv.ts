import fs from "fs";
import path from "path";

/**
 * Robust environment variable resolver for Spotify credentials.
 * Checks process.env first, and gracefully falls back to reading .env.local
 * from disk across multiple potential workspace paths.
 */
export function getSpotifyEnv() {
  let clientId = (process.env.SPOTIFY_CLIENT_ID || "").trim();
  let clientSecret = (process.env.SPOTIFY_CLIENT_SECRET || "").trim();
  let redirectUri = (
    process.env.SPOTIFY_REDIRECT_URI ||
    "http://localhost:3000/api/auth/spotify/callback"
  ).trim();

  if (!clientId || !clientSecret) {
    const candidatePaths = [
      path.join(process.cwd(), ".env.local"),
      path.join(process.cwd(), ".env"),
      path.resolve(".env.local"),
      "F:\\New Website Idea for Music\\.env.local",
      "F:/New Website Idea for Music/.env.local",
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
              if (key === "SPOTIFY_REDIRECT_URI" && !process.env.SPOTIFY_REDIRECT_URI) {
                redirectUri = val;
              }
            }
          }
          if (clientId && clientSecret) break;
        }
      } catch (err) {
        console.error(`Error reading ${envPath}:`, err);
      }
    }
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
  };
}
