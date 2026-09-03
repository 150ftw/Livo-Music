export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  audioUrl: string;
  artworkUrl: string;
  genre?: string;
  year?: number;
  bpm?: number;
  spotifyId: string;
  spotifyUrl: string;
  spotifyUri: string;
}

export type PlaylistCategory =
  | "featured"
  | "trending"
  | "late-night"
  | "focus"
  | "workout"
  | "classics"
  | "discover"
  | "new-releases";

export interface Playlist {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  curator: string;
  curatorRole: string;
  curatorAvatar: string;
  artworkUrl: string;
  bannerUrl?: string;
  accentColor: string;
  category: PlaylistCategory;
  tracks: Track[];
  followersCount: number;
  releaseDate: string;
  tags: string[];
  spotifyId: string;
  spotifyUrl: string;
  spotifyUri: string;
}

export interface Artist {
  id: string;
  name: string;
  role?: string;
  bio: string;
  image: string;
  monthlyListeners: number;
  genres: string[];
  popularTracks: Track[];
}

export interface SearchResults {
  playlists: Playlist[];
  tracks: Track[];
  artists: Artist[];
}

export interface MusicProvider {
  search(query: string): Promise<SearchResults>;
  getPlaylist(id: string): Promise<Playlist | null>;
  getTrack(id: string): Promise<Track | null>;
  getFeaturedPlaylists(): Promise<Playlist[]>;
  getTrending(): Promise<Playlist[]>;
  getPlaylistsByCategory(category: string): Promise<Playlist[]>;
  getAllPlaylists(): Promise<Playlist[]>;
  getArtists(): Promise<Artist[]>;
}

export type RepeatMode = "off" | "all" | "one";

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  queue: Track[];
  queueIndex: number;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isFullScreen: boolean;
}

export interface UserLibrary {
  savedPlaylistIds: string[];
  savedTrackIds: string[];
  recentlyPlayed: Track[];
}
