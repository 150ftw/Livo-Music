# LIVO — Premium Cinematic Music Experience

A design-forward, cinematic music discovery platform inspired by the visual language of high-end editorial magazines and experimental physical audio interfaces. Built to treat music as an environment rather than a dashboard.

---

## Highlights

- **Cinematic Dark Atmosphere**: Deep obsidian tones (`#050505`), soft diffuse lighting glows, and slow-moving ambient light lines.
- **Editorial Typography & Restrained Layouts**: Large negative space, micro-animations, and letter-spaced monospace uppercase metadata.
- **Unified Floating Player**: Minimalist floating pill with official Spotify playback integration, dismissable with one tap.
- **Expanded Listening Environment**: Distraction-free full-screen listening room featuring interactive 3D album tilt physics and Up Next queue management.
- **Official Spotify OAuth Integration**: Connect your Spotify account to unlock full-length streaming, live search querying, and personalized listening.
- **66 Authenticated Spotify Tracks & 12 Sound Archives**: Hand-curated nocturnal, ambient, neoclassical, and downtempo soundscapes with real Spotify CDN artwork.
- **Global Search Overlay**: Instant modal search index accessible via `⌘K` across tracks, artists, and playlists.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router & Turbopack)
- **Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 & Vanilla CSS custom variables
- **Motion & Physics**: Framer Motion 13
- **Icons**: Lucide React
- **API**: Spotify Web API & Spotify Official Embed Platform

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/150ftw/Livo-Music.git
cd Livo-Music
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Spotify Developer credentials from [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard):

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/spotify/callback
```

> **Note**: Make sure to add `http://localhost:3000/api/auth/spotify/callback` to your allowed **Redirect URIs** in your Spotify Developer Dashboard app settings.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the listening experience.

---

## License

MIT License. Crafted for music lovers and design enthusiasts.
