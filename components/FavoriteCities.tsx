"use client";

import {
  Heart,
  MapPin,
  Trash2,
} from "lucide-react";

import type { Location } from "@/types/weather";

interface FavoriteCitiesProps {
  favorites: Location[];
  onSelect: (location: Location) => void;
  onRemove: (locationId: number) => void;
}

export default function FavoriteCities({
  favorites,
  onSelect,
  onRemove,
}: FavoriteCitiesProps) {
  if (favorites.length === 0) {
    return (
      <div className="weather-card rounded-[2rem] p-8 text-center">
        <Heart
          size={32}
          className="mx-auto text-slate-300"
        />

        <h2 className="mt-4 font-black text-slate-900 dark:text-white">
          Aucun favori
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Ajoutez vos villes préférées pour
          y accéder rapidement.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {favorites.map((location) => (
        <div
          key={location.id}
          className="weather-card rounded-3xl p-5"
        >
          <div className="flex items-start justify-between">
            <button
              type="button"
              onClick={() =>
                onSelect(location)
              }
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                <MapPin size={18} />
              </div>

              <div className="min-w-0">
                <p className="truncate font-black text-slate-900 dark:text-white">
                  {location.name}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {location.country}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                onRemove(location.id)
              }
              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
              aria-label={`Supprimer ${location.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}