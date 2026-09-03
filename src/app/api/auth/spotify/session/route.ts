import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userToken = request.cookies.get("spotify_user_token")?.value;
  const refreshToken = request.cookies.get("spotify_refresh_token")?.value;
  const userProfileCookie = request.cookies.get("spotify_user_profile")?.value;

  if (!userToken && !refreshToken) {
    return NextResponse.json({
      isAuthenticated: false,
      user: null,
    });
  }

  let user = null;
  if (userProfileCookie) {
    try {
      user = JSON.parse(userProfileCookie);
    } catch {}
  }

  return NextResponse.json({
    isAuthenticated: true,
    user,
  });
}
