"use client";

import {
  Heart,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import FavoriteCities from "@/components/FavoriteCities";
import type { Location } from "@/types/weather";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Location[]>(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  }
  return [];
});

  function removeFavorite(id: number) {
    const updated = favorites.filter(
      (item) => item.id !== id
    );

    setFavorites(updated);

    localStorage.setItem(
      "bejart-meteo-favorites",
      JSON.stringify(updated)
    );
  }

  function selectFavorite(
    location: Location
  ) {
    router.push(`/?latitude=${location.latitude}&longitude=${location.longitude}&name=${encodeURIComponent(location.name)}`);
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sky-500">
              <Heart size={20} />
              <span className="text-sm font-black uppercase tracking-widest">
                Mes villes
              </span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white">
              Favoris
            </h1>

            <p className="mt-2 text-slate-500">
              Retrouvez rapidement les villes
              que vous consultez régulièrement.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
          >
            <Plus size={17} />
            Ajouter une ville
          </Link>
        </div>

        <FavoriteCities
          favorites={favorites}
          onSelect={selectFavorite}
          onRemove={removeFavorite}
        />
      </main>
    </div>
  );
}