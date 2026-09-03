import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { musicProvider } from "@/lib/music/provider";
import { PlaylistHeader } from "@/components/playlist/PlaylistHeader";
import { TrackRow } from "@/components/playlist/TrackRow";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

interface PlaylistPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlaylistDetailPage({ params }: PlaylistPageProps) {
  const { id } = await params;
  const playlist = await musicProvider.getPlaylist(id);

  if (!playlist) {
    notFound();
  }

  const allPlaylists = await musicProvider.getAllPlaylists();
  const relatedPlaylists = allPlaylists
    .filter((p) => p.id !== playlist.id)
    .slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-10 sm:py-16 space-y-16 sm:space-y-24 select-none">
      {/* Quiet Back Link */}
      <div>
        <Link
          href="/playlists"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#8e8c87] hover:text-[#f5f4f0] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Archives</span>
        </Link>
      </div>

      {/* Dramatic Editorial Header */}
      <PlaylistHeader playlist={playlist} />

      {/* Tracklist with Generous Spacing */}
      <section className="space-y-6 pt-6 border-t border-white/[0.04]">
        <div className="flex items-center justify-between pb-2">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#8e8c87]">
            Tracklist ({playlist.tracks.length})
          </span>
          <span className="text-[10px] font-mono text-[#4a4844] uppercase tracking-wider">
            Sequential Order
          </span>
        </div>

        <div className="divide-y divide-white/[0.03]">
          {playlist.tracks.map((track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              index={index}
              queueContext={playlist.tracks}
            />
          ))}
        </div>
      </section>

      {/* Recommended Soundscapes */}
      {relatedPlaylists.length > 0 && (
        <section className="pt-12 sm:pt-16 border-t border-white/[0.04] space-y-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#8e8c87] block mb-1">
              Adjacent Frequencies
            </span>
            <h3 className="text-xl sm:text-2xl font-light text-[#f5f4f0]">
              Explore related sound archives.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {relatedPlaylists.map((pl) => (
              <Link
                key={pl.id}
                href={`/playlist/${pl.id}`}
                className="group block space-y-3 p-4 rounded-xl bg-[#08080a] border border-white/[0.04] hover:border-white/[0.14] transition-all"
              >
                <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-[#0c0c0e]">
                  <Image
                    src={pl.artworkUrl}
                    alt={pl.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 360px"
                  />
                </div>

                <div className="flex items-start justify-between gap-2 pt-1">
                  <div>
                    <h4 className="text-sm font-medium text-[#f5f4f0] group-hover:text-white transition-colors">
                      {pl.title}
                    </h4>
                    <p className="text-xs text-[#8e8c87] line-clamp-1 mt-0.5">
                      {pl.curator} · {pl.tracks.length} tracks
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#4a4844] group-hover:text-white transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
