const fs = require('fs');
const path = require('path');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const PLAYLIST_CONFIGS = [
  {
    spotifyId: '099QdI0bqSKSk3NxxDNNPl',
    slug: 'punjabi-hardlaunch',
    category: 'trending',
    accentColor: '#6b21a8',
    genre: 'Punjabi Trap',
    tags: ['Punjabi', 'Trap', 'Modern Desi', 'HardLaunch'],
    curator: 'Shivam',
    curatorRole: 'Sound Curator',
    subtitle: 'High-voltage modern Punjabi anthems, drill rhythms, and heavy basslines.',
    description: 'High-octane modern Punjabi trap, drill, and contemporary anthems featuring Sukha, Karan Aujla, and cutting-edge beatmakers.',
  },
  {
    spotifyId: '3hd2rX4XmCIJ74hj0ONSc2',
    slug: 'underrated-indie-songs',
    category: 'discover',
    accentColor: '#14532d',
    genre: 'Indie Folk',
    tags: ['Indie', 'Acoustic', 'Poetry', 'Soulful', 'Discover'],
    curator: 'Shivam',
    curatorRole: 'Acoustic Resident',
    subtitle: 'Acoustic warmth, heartfelt poetry, and peaceful midnight acoustics.',
    description: 'Acoustic tranquility, soulful storytelling, and hidden gems across Indian indie, folk, and serene acoustic arrangements.',
  },
  {
    spotifyId: '5QEDoAMvPXUDUg7aNan2aC',
    slug: 'punjabi-ogs',
    category: 'classics',
    accentColor: '#b45309',
    genre: 'Punjabi Classics',
    tags: ['Punjabi OG', 'Classics', 'Folk', 'Legends', 'Bhangra'],
    curator: 'Shivam',
    curatorRole: 'Heritage Selector',
    subtitle: 'Timeless folk, bhangra pioneers, and legend tracks that defined an era.',
    description: 'The era-defining classics that shaped Punjabi music culture. From iconic folk melodies to legendary urban bhangra anthems.',
  },
  {
    spotifyId: '0auHvhJI6KJHI5ClBjhWYt',
    slug: 'hollywood-rap',
    category: 'workout',
    accentColor: '#dc2626',
    genre: 'Hip-Hop & Trap',
    tags: ['Hip-Hop', 'Rap', 'Trap', '808s', 'Kinetic'],
    curator: 'Shivam',
    curatorRole: 'Hip-Hop Director',
    subtitle: 'Platinum trap, melodic flows, and heavy 808 low-end anthems.',
    description: 'Hard-hitting 808 low-end, chart-topping flows, and nocturnal trap anthems from the biggest figures in global hip-hop.',
  },
  {
    spotifyId: '3mVqVDQreJ2MwZhlBM5cEc',
    slug: 'guitar-covers-2024',
    category: 'focus',
    accentColor: '#1e3a8a',
    genre: 'Acoustic Guitar',
    tags: ['Guitar', 'Acoustic', 'Instrumental', 'Fingerstyle', 'Focus'],
    curator: 'guitar girl',
    curatorRole: 'Acoustic Virtuoso',
    subtitle: 'Intimate fingerstyle, ambient room tones, and delicate acoustic arrangements.',
    description: 'Delicate fingerpicked strings, room acoustics, and heartfelt acoustic interpretations of modern favorite melodies.',
  },
  {
    spotifyId: '4mrMgaMFVLvuJKezdSLR6O',
    slug: 'favourite',
    category: 'late-night',
    accentColor: '#312e81',
    genre: 'Dream Pop & Nocturnal',
    tags: ['Dream Pop', 'Nocturnal', 'Atmospheric', 'Slowcore'],
    curator: "Blooney's",
    curatorRole: 'Midnight Selector',
    subtitle: 'Dream pop, slowcore, and late-night reverberant reverie.',
    description: 'Reverberant guitars, hazy dream-pop textures, and introspective nocturnal ballads for slow-burning midnight hours.',
  },
];

async function getSpotifyToken() {
  try {
    const envFile = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
    let clientId = '', clientSecret = '';
    envFile.split('\n').forEach(line => {
      if (line.startsWith('SPOTIFY_CLIENT_ID=')) clientId = line.split('=')[1].trim();
      if (line.startsWith('SPOTIFY_CLIENT_SECRET=')) clientSecret = line.split('=')[1].trim();
    });
    if (!clientId || !clientSecret) return null;

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const data = await res.json();
    return data.access_token || null;
  } catch (err) {
    return null;
  }
}

async function fetchThumbnail(trackId, defaultUrl) {
  try {
    const res = await fetch(`https://open.spotify.com/oembed?url=https://open.spotify.com/track/${trackId}`, {
      headers: { 'User-Agent': USER_AGENT }
    });
    if (!res.ok) return defaultUrl;
    const data = await res.json();
    if (data.thumbnail_url) {
      return data.thumbnail_url.replace('00001e02', '0000b273');
    }
    return defaultUrl;
  } catch {
    return defaultUrl;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function buildCatalog() {
  console.log('1. Step 1: Pre-fetching all 6 playlist embeds in sequence...');
  const spotifyToken = await getSpotifyToken();
  if (spotifyToken) {
    console.log('Obtained Spotify API token for artist profiles.');
  }

  const rawPlaylists = [];
  for (const config of PLAYLIST_CONFIGS) {
    console.log(`  Fetching embed: ${config.slug} (${config.spotifyId})...`);
    const res = await fetch(`https://open.spotify.com/embed/playlist/${config.spotifyId}`, {
      headers: { 'User-Agent': USER_AGENT }
    });
    const text = await res.text();
    const nextDataMatch = text.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!nextDataMatch) {
      console.error(`  ERROR: Could not parse embed for ${config.slug} (status ${res.status})`);
      continue;
    }
    const nextData = JSON.parse(nextDataMatch[1]);
    const entity = nextData.props?.pageProps?.state?.data?.entity;
    if (!entity) {
      console.error(`  ERROR: No entity found for ${config.slug}`);
      continue;
    }
    rawPlaylists.push({ config, entity });
    console.log(`  -> OK: "${entity.title}" with ${entity.trackList?.length || 0} tracks`);
    await sleep(200); // polite pause
  }

  console.log(`\n2. Step 2: Processing ${rawPlaylists.length} playlists and their tracks...`);
  const allTracks = [];
  const processedPlaylists = [];
  const trackIdSet = new Set();
  const thumbnailCache = new Map();

  for (const { config, entity } of rawPlaylists) {
    const playlistTitle = entity.title || entity.name || config.slug;
    const playlistCover = entity.coverArt?.sources?.[0]?.url || 'https://i.scdn.co/image/ab67616d0000b273016e76981b3dfd695b90ff52';
    const rawTracks = entity.trackList || [];
    console.log(`\nProcessing: "${playlistTitle}" (${rawTracks.length} tracks)...`);

    const playlistTracks = [];
    // Process tracks with a polite queue of 4 at a time with 50ms pause
    const chunkSize = 4;
    for (let i = 0; i < rawTracks.length; i += chunkSize) {
      const chunk = rawTracks.slice(i, i + chunkSize);
      const chunkResults = await Promise.all(
        chunk.map(async (raw) => {
          const trackId = raw.uri ? raw.uri.split(':')[2] : raw.id || raw.uid;
          let artworkUrl = thumbnailCache.get(trackId);
          if (!artworkUrl) {
            artworkUrl = await fetchThumbnail(trackId, playlistCover);
            thumbnailCache.set(trackId, artworkUrl);
          }

          const trackObj = {
            id: trackId,
            title: raw.title,
            artist: (raw.subtitle || 'Unknown Artist').replace(/\u00a0/g, ' ').trim(),
            album: playlistTitle,
            duration: Math.round((raw.duration || 180000) / 1000),
            audioUrl: raw.audioPreview?.url || '',
            artworkUrl: artworkUrl,
            genre: config.genre,
            year: 2024,
            spotifyId: trackId,
            spotifyUrl: `https://open.spotify.com/track/${trackId}`,
            spotifyUri: raw.uri || `spotify:track:${trackId}`,
          };
          return trackObj;
        })
      );

      for (const trackObj of chunkResults) {
        playlistTracks.push(trackObj);
        if (!trackIdSet.has(trackObj.id)) {
          trackIdSet.add(trackObj.id);
          allTracks.push(trackObj);
        }
      }
      await sleep(50);
      process.stdout.write(`  Tracks ${playlistTracks.length}/${rawTracks.length} processed\r`);
    }

    console.log(`\n  Completed "${playlistTitle}": ${playlistTracks.length} tracks.`);

    processedPlaylists.push({
      id: config.slug,
      title: playlistTitle,
      subtitle: config.subtitle,
      description: config.description,
      curator: config.curator,
      curatorRole: config.curatorRole,
      curatorAvatar: playlistCover,
      artworkUrl: playlistCover,
      accentColor: config.accentColor,
      category: config.category,
      tracks: playlistTracks,
      followersCount: Math.floor(Math.random() * 5000) + 1200,
      releaseDate: 'User Collection',
      tags: config.tags,
      spotifyId: config.spotifyId,
      spotifyUrl: `https://open.spotify.com/playlist/${config.spotifyId}`,
      spotifyUri: `spotify:playlist:${config.spotifyId}`,
    });
  }

  console.log(`\nAll Playlists Processed! Total unique tracks: ${allTracks.length}`);

  // Curate Top Featured Artists based on the user's playlists
  const featuredArtistNames = [
    { name: 'Sukha', role: 'Punjabi Hip-Hop Pioneer', bio: 'Canadian-Punjabi powerhouse crafting viral 808 rhythms, anthemic hooks, and chart-topping Desi trap.' },
    { name: 'Karan Aujla', role: 'Punjabi Lyricist & Superstar', bio: 'Global hitmaker renowned for intricate wordplay, monumental hook writing, and genre-bending modern Punjabi productions.' },
    { name: 'Drake', role: 'Global Hip-Hop Icon', bio: 'Record-shattering artist navigating late-night melodies, nocturnal introspectives, and era-defining hip-hop anthems.' },
    { name: 'Taba Chake', role: 'Indie Folk Singer-Songwriter', bio: 'Fingerstyle virtuoso from Arunachal Pradesh crafting bilingual acoustic ballads rooted in nature and tranquility.' },
    { name: 'Prateek Kuhad', role: 'Contemporary Indie Icon', bio: 'Acclaimed singer-songwriter known for tender acoustic intimacy, delicate piano arrangements, and poetic warmth.' },
    { name: 'Cigarettes After Sex', role: 'Dream Pop & Ambient Masters', bio: 'Atmospheric slowcore pioneers famous for minimalist reverb guitars, whispery romantic vocals, and noir aesthetics.' },
    { name: 'Sidhu Moose Wala', role: 'Punjabi Legend & Revolutionary', bio: 'Immortal icon whose unyielding delivery, raw folk energy, and explosive rap production reshaped global Punjabi music.' },
    { name: 'guitar girl', role: 'Acoustic Arranger & Performer', bio: 'Talented acoustic fingerstyle arranger bringing intimate room acoustics and delicate interpretations to modern classics.' },
  ];

  const processedArtists = [];
  for (const aInfo of featuredArtistNames) {
    let artistImage = 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9';
    let followers = 2500000;
    let genres = ['Alternative', 'Indie'];

    if (spotifyToken) {
      try {
        const sRes = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(aInfo.name)}&type=artist&limit=1`, {
          headers: { Authorization: `Bearer ${spotifyToken}` },
        });
        const sData = await sRes.json();
        const artist = sData.artists?.items?.[0];
        if (artist) {
          if (artist.images?.[0]?.url) artistImage = artist.images[0].url;
          if (artist.followers?.total) followers = artist.followers.total;
          if (artist.genres?.length) genres = artist.genres.slice(0, 3);
        }
      } catch (err) {
        console.error(`Error fetching artist info for ${aInfo.name}:`, err.message);
      }
    }

    // Find artist's tracks from allTracks
    const artistTracks = allTracks.filter(t => t.artist.toLowerCase().includes(aInfo.name.toLowerCase()));
    const popularTracks = artistTracks.length > 0 ? artistTracks.slice(0, 4) : allTracks.slice(0, 3);

    processedArtists.push({
      id: aInfo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: aInfo.name,
      role: aInfo.role,
      bio: aInfo.bio,
      image: artistImage,
      monthlyListeners: followers,
      genres: genres,
      popularTracks: popularTracks,
    });
  }

  console.log(`Generated ${processedArtists.length} featured artists.`);

  // Write output
  const fileContent = `// Authenticated Live Spotify Playlist Catalog
// Generated from User's Curated Playlists
import { Track, Playlist, Artist } from "@/types/music";

export const SPOTIFY_TRACKS: Track[] = ${JSON.stringify(allTracks, null, 2)};

export const SPOTIFY_PLAYLISTS: Playlist[] = ${JSON.stringify(processedPlaylists, null, 2)};

export const SPOTIFY_ARTISTS: Artist[] = ${JSON.stringify(processedArtists, null, 2)};
`;

  const outputPath = path.join(__dirname, '..', 'src', 'lib', 'music', 'spotifyCatalog.ts');
  fs.writeFileSync(outputPath, fileContent, 'utf8');
  console.log(`\nSuccessfully written complete catalog (${allTracks.length} tracks, ${processedPlaylists.length} playlists) to: ${outputPath}`);
}

buildCatalog().catch(console.error);
