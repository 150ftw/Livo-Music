import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const response = NextResponse.json({ success: true });
  response.cookies.delete("spotify_user_token");
  response.cookies.delete("spotify_refresh_token");
  response.cookies.delete("spotify_user_profile");
  response.cookies.delete("spotify_auth_state");
  return response;
}
