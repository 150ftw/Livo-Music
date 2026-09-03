"use client";

import React, { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Playlist } from "@/types/music";
import { X, Music } from "lucide-react";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePlaylistModal({ isOpen, onClose }: CreatePlaylistModalProps) {
  const { toggleSavePlaylist } = usePlayer();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPlaylist: Playlist = {
      id: `custom-playlist-${Date.now()}`,
      title: title.trim(),
      subtitle: description.trim() || "Created by you",
      description: description.trim() || "Personal custom playlist.",
      curator: "You",
      curatorRole: "Curator",
      curatorAvatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      artworkUrl:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
      accentColor: "#1DB954",
      category: "discover",
      tracks: [],
      followersCount: 1,
      releaseDate: "Just now",
      tags: ["My Playlist", "Custom"],
      spotifyId: "",
      spotifyUrl: "https://open.spotify.com",
      spotifyUri: "",
    };

    toggleSavePlaylist(newPlaylist);
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#282828] border border-white/[0.1] rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
          <h2 className="font-bold text-lg text-white">Create playlist</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.08]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-36 h-36 rounded-lg bg-[#181818] border border-white/[0.08] flex flex-col items-center justify-center text-zinc-500 shrink-0">
              <Music className="w-12 h-12 text-zinc-400 mb-1" />
              <span className="text-[10px] text-zinc-400">Artwork</span>
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Playlist #1"
                  className="w-full px-3 py-2 rounded-md bg-white/[0.08] text-white placeholder:text-zinc-500 text-sm border border-transparent focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Give your playlist a catchy description."
                  className="w-full px-3 py-2 rounded-md bg-white/[0.08] text-white placeholder:text-zinc-500 text-xs border border-transparent focus:border-white focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/[0.06]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-md transition-transform hover:scale-105"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
