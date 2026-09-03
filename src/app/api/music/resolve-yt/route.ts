import { NextRequest, NextResponse } from "next/server";

// Pre-seeded high quality audio IDs for instant zero-latency playback
const AUDIO_ID_CACHE = new Map<string, string>([
  ["tycho:awake", "6XJBDX3Z0BY"],
  ["bonobo:linked", "0W-a11Tdk7Y"],
  ["bicep:glue", "q5rliCxX8xc"],
  ["jon hopkins:emerald rush", "4sk0uDbM5lc"],
  ["flume, toro y moi:the difference", "MCRiUi28UpA"],
  ["odesza, madelyn grant:sun models", "cwLRN5sdfnA"],
  ["khruangbin, leon bridges:texas sun", "zSWNWWREtsI"],
  ["men i trust:show me how", "cJRFMfztgBg"],
  ["mac demarco:chamber of reflection", "MJoSyNdffGo"],
  ["cigarettes after sex:apocalypse", "sElE_BfQ67s"],
  ["clairo:bags", "L9HYJbe9Y18"],
  ["frank ocean:nights", "r4l9bFqgMaQ"],
  ["the weeknd:after hours", "ygTZZpVkmKg"],
  ["ludovico einaudi, daniel hope, i virtuosi italiani:experience", "hN_q-_nGv4U"],
  ["childish gambino:redbone", "Kp7eSUU9oy8"],
  ["kavinsky:nightcall", "MV_3Dpw-BRY"],
  ["sufjan stevens:mystery of love", "4WTt69YO2yo"],
  ["bon iver:holocene", "TWcyIpul8OE"],
  ["m83:midnight city", "dX3k_QDnzHE"],
  ["home:resonance", "8GW6sLrK40k"],
  ["burial:archangel", "IlEkvbRmfrA"],
  ["overmono:so u kno", "9g2s11e1vQc"],
  ["sigur rós:hoppípolla", "mZTb8WxEWl8"],
  ["kiasmos:looped", "zJg5gB3q46E"],
  ["aphex twin:avril 14th", "PeLuQ6X2ixI"],
  ["boards of canada:roygbiv", "yT0gRc2c2wQ"],
  ["massive attack:teardrop", "u7K72X4eo_s"],
  ["portishead:glory box", "4qQyG8KoQ1g"],
  ["steve lacy:dark red", "sRJNWkHkXhE"],
  ["tv girl:lovers rock", "8jU6e-j_F-w"],
  ["beach house:space song", "RBtlPT23PTM"],
  ["joji:glimpse of us", "FvOpPeKSf_4"],
  ["slowdive:alison", "ol787R580DU"],
]);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "").trim();
  const artist = (searchParams.get("artist") || "").trim();

  if (!title) {
    return NextResponse.json({ error: "Missing title query" }, { status: 400 });
  }

  const cacheKey = `${artist.toLowerCase()}:${title.toLowerCase()}`;
  if (AUDIO_ID_CACHE.has(cacheKey)) {
    return NextResponse.json({
      videoId: AUDIO_ID_CACHE.get(cacheKey),
      source: "cache",
    });
  }

  // Also check simplified artist key
  const simpleArtist = artist.split(",")[0].trim().toLowerCase();
  const simpleKey = `${simpleArtist}:${title.toLowerCase()}`;
  if (AUDIO_ID_CACHE.has(simpleKey)) {
    return NextResponse.json({
      videoId: AUDIO_ID_CACHE.get(simpleKey),
      source: "cache-fuzzy",
    });
  }

  // Dynamic search on YouTube
  try {
    const query = `${artist} ${title} Official Audio`.replace(/['"()]/g, "");
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
    videoId: "sElE_BfQ67s", // Apocalypse fallback
    source: "fallback",
  });
}
