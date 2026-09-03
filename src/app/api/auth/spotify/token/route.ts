import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let userToken = request.cookies.get("spotify_user_token")?.value;
  const refreshToken = request.cookies.get("spotify_refresh_token")?.value;

  if (userToken) {
    return NextResponse.json({ token: userToken });
  }

  if (!refreshToken) {
    return NextResponse.json({ token: null }, { status: 401 });
  }

  // Refresh the token
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 500 });
  }

  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!res.ok) {
      return NextResponse.json({ token: null }, { status: 401 });
    }

    const data = await res.json();
    const newAccessToken = data.access_token;
    const expiresIn = data.expires_in || 3600;

    const response = NextResponse.json({ token: newAccessToken });
    response.cookies.set("spotify_user_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Token refresh error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
