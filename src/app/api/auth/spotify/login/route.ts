import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSpotifyEnv } from "@/lib/music/spotifyEnv";

export async function GET(request: NextRequest) {
  const { clientId, redirectUri } = getSpotifyEnv();

  if (!clientId) {
    return NextResponse.json(
      { error: "Missing SPOTIFY_CLIENT_ID in .env.local or environment" },
      { status: 500 }
    );
  }

  const state = crypto.randomBytes(16).toString("hex");
  const scopes = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-library-read",
    "user-library-modify",
  ].join(" ");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
    state: state,
    show_dialog: "true",
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

  const response = NextResponse.redirect(authUrl);
  // Store state in httpOnly cookie for 10 minutes
  response.cookies.set("spotify_auth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return response;
}
