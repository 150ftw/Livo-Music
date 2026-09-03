import { Track, Playlist, Artist, SearchResults } from "@/types/music";

interface TokenCache {
  token: string;
  expiresAt: number;
}

let cachedToken: TokenCache | null = null;

export async function getSpotifyAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  // Use cached token if valid (with 60-second buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.token;
  }

  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to authenticate with Spotify API:", await res.text());
      return null;
    }

    const data = await res.json();
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    return cachedToken.token;
  } catch (error) {
    console.error("Error fetching Spotify access token:", error);
    return null;
  }
}

interface SpotifyApiTrack {
  id: string;
  name: string;
  artists?: { name: string }[];
  album?: {
    name: string;
    release_date?: string;
    images?: { url: string }[];
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls?: { spotify?: string };
  uri?: string;
}

interface SpotifyApiPlaylist {
  id: string;
  name: string;
  description: string | null;
  owner?: { display_name?: string };
  images?: { url: string }[];
  external_urls?: { spotify?: string };
  uri?: string;
  tracks?: { total: number };
}

interface SpotifyApiArtist {
  id: string;
  name: string;
  genres?: string[];
  images?: { url: string }[];
  followers?: { total: number };
}

export async function searchLiveSpotify(query: string): Promise<SearchResults | null> {
  const token = await getSpotifyAccessToken();
  if (!token) return null;

  try {
    const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track,playlist,artist&limit=8`;

    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();

    const tracks: Track[] = (data.tracks?.items || []).map((item: SpotifyApiTrack) => ({
      id: item.id,
      title: item.name,
      artist: (item.artists || []).map((a) => a.name).join(", ") || "Various Artists",
      album: item.album?.name || "Single",
      duration: Math.round((item.duration_ms || 200000) / 1000),
      audioUrl: item.preview_url || "",
      artworkUrl:
        item.album?.images?.[0]?.url ||
        "https://i.scdn.co/image/ab67616d0000b273016e76981b3dfd695b90ff52",
      genre: "Spotify Catalog",
      year: item.album?.release_date ? parseInt(item.album.release_date.slice(0, 4)) : 2024,
      spotifyId: item.id,
      spotifyUrl: item.external_urls?.spotify || `https://open.spotify.com/track/${item.id}`,
      spotifyUri: item.uri || `spotify:track:${item.id}`,
    }));

    const playlists: Playlist[] = (data.playlists?.items || [])
      .filter((p: SpotifyApiPlaylist | null) => p !== null && p.id)
      .map((item: SpotifyApiPlaylist) => ({
        id: item.id,
        title: item.name,
        subtitle: item.description || "Curated Spotify Collection",
        description: item.description || "Handpicked collection on Spotify.",
        curator: item.owner?.display_name || "Spotify Editorial",
        curatorRole: "Spotify Curator",
        curatorAvatar:
          "https://i.scdn.co/image/ab6761610000e5eb1d2c676997fffa6c04f982cf",
        artworkUrl:
          item.images?.[0]?.url ||
          "https://i.scdn.co/image/ab67616d0000b273016e76981b3dfd695b90ff52",
        accentColor: "#1DB954",
        category: "discover",
        tracks: [],
        followersCount: item.tracks?.total || 1200,
        releaseDate: "Spotify Live Archive",
        tags: ["Spotify", "Live Playlist"],
        spotifyId: item.id,
        spotifyUrl: item.external_urls?.spotify || `https://open.spotify.com/playlist/${item.id}`,
        spotifyUri: item.uri || `spotify:playlist:${item.id}`,
      }));

    const artists: Artist[] = (data.artists?.items || []).map((item: SpotifyApiArtist) => ({
      id: item.id,
      name: item.name,
      role: "Spotify Artist",
      bio: item.genres && item.genres.length > 0
        ? `Leading ${item.genres.slice(0, 3).join(", ")} sound creator on Spotify.`
        : "Sound creator on Spotify.",
      image:
        item.images?.[0]?.url ||
        "https://i.scdn.co/image/ab6761610000e5eb5f33a8c66a4f7e53f19e3498",
      monthlyListeners: item.followers?.total || 45000,
      genres: item.genres || ["Electronic", "Alternative"],
      popularTracks: [],
    }));

    return {
      tracks,
      playlists,
      artists,
    };
  } catch (error) {
    console.error("Error searching Spotify API:", error);
    return null;
  }
}
