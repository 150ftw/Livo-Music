import {
  MusicProvider,
  Playlist,
  Track,
  Artist,
  SearchResults,
} from "@/types/music";
import {
  SPOTIFY_PLAYLISTS,
  SPOTIFY_TRACKS,
  SPOTIFY_ARTISTS,
} from "./spotifyCatalog";

/**
 * LIVO Music Provider
 * Operates autonomously in pure Demo Mode without requiring external API credentials.
 * Provides instant, high-fidelity querying of LIVO's 50+ track and 12 playlist sound archive.
 */
export class LivoMusicProvider implements MusicProvider {
  async search(query: string): Promise<SearchResults> {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        playlists: SPOTIFY_PLAYLISTS.slice(0, 6),
        tracks: SPOTIFY_TRACKS.slice(0, 8),
        artists: SPOTIFY_ARTISTS,
      };
    }

    const matchedPlaylists = SPOTIFY_PLAYLISTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.curator.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q))
    );

    const matchedTracks = SPOTIFY_TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q) ||
        (t.genre && t.genre.toLowerCase().includes(q))
    );

    const matchedArtists = SPOTIFY_ARTISTS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.genres.some((g) => g.toLowerCase().includes(q)) ||
        a.bio.toLowerCase().includes(q)
    );

    return {
      playlists: matchedPlaylists,
      tracks: matchedTracks,
      artists: matchedArtists,
    };
  }

  async getPlaylist(id: string): Promise<Playlist | null> {
    const playlist = SPOTIFY_PLAYLISTS.find(
      (p) => p.id === id || p.spotifyId === id
    );
    return playlist || null;
  }

  async getTrack(id: string): Promise<Track | null> {
    const track = SPOTIFY_TRACKS.find(
      (t) => t.id === id || t.spotifyId === id
    );
    return track || null;
  }

  async getFeaturedPlaylists(): Promise<Playlist[]> {
    return SPOTIFY_PLAYLISTS.filter(
      (p) => p.category === "featured" || p.id === "late-night-frequencies" || p.id === "golden-hour"
    );
  }

  async getTrending(): Promise<Playlist[]> {
    return SPOTIFY_PLAYLISTS.filter(
      (p) => p.category === "trending" || p.category === "discover"
    );
  }

  async getPlaylistsByCategory(category: string): Promise<Playlist[]> {
    if (category === "all") return SPOTIFY_PLAYLISTS;
    return SPOTIFY_PLAYLISTS.filter((p) => p.category === category);
  }

  async getAllPlaylists(): Promise<Playlist[]> {
    return SPOTIFY_PLAYLISTS;
  }

  async getArtists(): Promise<Artist[]> {
    return SPOTIFY_ARTISTS;
  }
}

export const musicProvider: MusicProvider = new LivoMusicProvider();
