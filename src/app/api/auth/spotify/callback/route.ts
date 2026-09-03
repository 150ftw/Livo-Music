import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const origin = request.nextUrl.origin;

  if (error) {
    console.error("Spotify Auth Error:", error);
    return NextResponse.redirect(`${origin}?auth_error=${encodeURIComponent(error)}`);
  }

  const storedState = request.cookies.get("spotify_auth_state")?.value;
  if (!state || state !== storedState) {
    console.error("State mismatch in Spotify auth callback");
    return NextResponse.redirect(`${origin}?auth_error=state_mismatch`);
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri =
    process.env.SPOTIFY_REDIRECT_URI || "http://localhost:3000/api/auth/spotify/callback";

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}?auth_error=missing_credentials`);
  }

  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code || "",
      redirect_uri: redirectUri,
    });

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("Failed to exchange token with Spotify:", errText);
      return NextResponse.redirect(`${origin}?auth_error=token_exchange_failed`);
    }

    const tokenData = await tokenRes.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Fetch user profile
    const userRes = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    let userData = null;
    if (userRes.ok) {
      userData = await userRes.json();
    }

    const response = NextResponse.redirect(`${origin}?auth_success=true`);

    // Store tokens in secure cookies
    response.cookies.set("spotify_user_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expires_in || 3600,
      path: "/",
    });

    if (refresh_token) {
      response.cookies.set("spotify_refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 3600, // 30 days
        path: "/",
      });
    }

    if (userData) {
      response.cookies.set(
        "spotify_user_profile",
        JSON.stringify({
          id: userData.id,
          display_name: userData.display_name,
          email: userData.email,
          product: userData.product, // "premium" | "free"
          images: userData.images,
        }),
        {
          httpOnly: false, // Accessible to client components for display
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 30 * 24 * 3600,
          path: "/",
        }
      );
    }

    // Clear state cookie
    response.cookies.delete("spotify_auth_state");

    return response;
  } catch (err: any) {
    console.error("Callback exception:", err);
    return NextResponse.redirect(`${origin}?auth_error=${encodeURIComponent(err.message)}`);
  }
}
