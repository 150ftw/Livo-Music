import { NextRequest, NextResponse } from "next/server";
import { searchLiveSpotify } from "@/lib/music/spotifyApi";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ success: true, results: null });
  }

  try {
    const results = await searchLiveSpotify(query);
    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Spotify Search API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to query Spotify API" },
      { status: 500 }
    );
  }
}
