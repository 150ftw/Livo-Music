import { NextRequest, NextResponse } from "next/server";

// Pre-seeded high quality audio IDs for instant zero-latency playback
const AUDIO_ID_CACHE = new Map<string, string>([
  // User Curated Playlists
  ["sukha:attraction", "rbBc0IHfEKA"],
  ["amber:two reasons", "NKqbRasvp7M"],
  ["diljit dosanjh:sohni lagdi", "zx9-2lEXtHs"],
  ["chani nattan:noormahal", "enidMo5izlE"],
  ["karan aujla:boyfriend", "RYXUA32Dx4k"],
  ["ap dhillon:by my side", "N8dexd1PqEw"],
  ["talwiinder:gallan 4", "ZQBgxRuJQqg"],
  ["kunwarr:piche tere", "AM7u5EmM-IQ"],
  ["kunwarr:crazy4u", "efvZkV53RbU"],
  ["jind universe:love exit", "t3U3x_kUIbc"],
  ["navaan sandhu:deewane", "P1aXddE0Xuw"],
  ["navjot ahuja:khat", "LUgpPmj6nR8"],
  ["jind universe:high on you", "gI1Z4UHg9o0"],
  ["sarrb:desire", "ET6EiPtAVp8"],
  ["sarrb:restless", "vHUKcycwIwo"],
  ["sarrb:zulfaan", "_oTgwjM6mBU"],
  ["harkirat sangha:akhiyan", "z5Y4R4KkQZ0"],
  ["balbir:guess it's love", "OcoCdzrAuKY"],
  ["preetinder:uff", "TuKvoa2y3Zo"],
  ["bir:zulfa", "Y3ok3enJ81U"],
  ["deep dhaliwal:hypnotic", "eBLe3c4oJas"],
  ["balbir:qabool", "5GoxoKwmpEA"],
  ["a minxr:your eyes", "sObSGL336bk"],
  ["gur sohal:perfection", "vxI6KZa9rGk"],
  ["raghav & arjun:ho jayenge ghum", "SBHZo0cmfQo"],
  ["taba chake:ho jayenge ghum", "SBHZo0cmfQo"],
  ["drake:god's plan", "m1a_GqJf02M"],
  ["guitar girl:it will rain - guitar version", "MrCeYSkF8ys"],
  ["cigarettes after sex:john wayne", "M5gjHFmi2Co"],
  ["garry sandhu:illegal weapon", "H7_yY3yr-jE"],
  ["garry sandhu:yeh baby", "-qRIGtz7Svo"],
  ["dilpreet dhillon:picka", "7EjyXodK6TQ"],
  ["guru randhawa:lahore", "N3KraHFWLI0"],
  ["mankirt aulakh:badnam", "MFbWt4HJ5vQ"],
  ["sidhu moose wala:jaat da muqabala", "e11d3367fd3"],
  ["bohemia:same beef", "f4fd386325f"],
  ["sidhu moose wala:same beef", "f4fd386325f"],
  ["cigarettes after sex:apocalypse", "sElE_BfQ67s"],
  ["joji:glimpse of us", "FvOpPeKSf_4"],
  ["beach house:space song", "RBtlPT23PTM"],
  ["steve lacy:dark red", "sRJNWkHkXhE"],
  ["tv girl:lovers rock", "8jU6e-j_F-w"],
]);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "").trim();
  const artist = (searchParams.get("artist") || "").trim();

  if (!title) {
    return NextResponse.json({ error: "Missing title query" }, { status: 400 });
  }

  const cleanTitle = title.replace(/\s*\(.*?\)\s*/g, "").trim().toLowerCase();
  const primaryArtist = artist.split(",")[0].trim().toLowerCase();

  const cacheKey = `${primaryArtist}:${cleanTitle}`;
  if (AUDIO_ID_CACHE.has(cacheKey)) {
    return NextResponse.json({
      videoId: AUDIO_ID_CACHE.get(cacheKey),
      source: "cache",
    });
  }

  const fullKey = `${artist.toLowerCase()}:${title.toLowerCase()}`;
  if (AUDIO_ID_CACHE.has(fullKey)) {
    return NextResponse.json({
      videoId: AUDIO_ID_CACHE.get(fullKey),
      source: "cache-full",
    });
  }

  // Dynamic search on YouTube
  try {
    const query = `${primaryArtist} ${cleanTitle} audio`.replace(/['"()]/g, "");
    const res = await fetch(
      "https://www.youtube.com/results?search_query=" + encodeURIComponent(query),
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
          Cookie: "CONSENT=YES+cb.20210328-17-p0.en+FX+410",
        },
      }
    );

    const html = await res.text();
    const match = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    if (match && match[1]) {
      const videoId = match[1];
      AUDIO_ID_CACHE.set(cacheKey, videoId);
      return NextResponse.json({ videoId, source: "network" });
    }
  } catch (err: any) {
    console.error("Error resolving YouTube ID:", err.message);
  }

  // Fallback to default iconic audio
  return NextResponse.json({
    videoId: "rbBc0IHfEKA", // Sukha Attraction fallback
    source: "fallback",
  });
}
