"use client";

import {
  Loader2,
  MapPin,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Location } from "@/types/weather";

interface SearchBarProps {
  onSelect: (location: Location) => void;
  onLocate?: () => void;
  locating?: boolean;
}

export default function SearchBar({
  onSelect,
  onLocate,
  locating = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `/api/geocode?name=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        setResults(data.results ?? []);
        setShowResults(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  function handleSelect(location: Location) {
    setQuery(location.name);
    setShowResults(false);
    onSelect(location);
  }

  return (
    <div className="relative w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            onFocus={() =>
              results.length > 0 &&
              setShowResults(true)
            }
            placeholder="Rechercher une ville..."
            className="h-14 w-full rounded-2xl border border-slate-200 bg-white/90 pl-12 pr-12 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 dark:border-slate-700 dark:bg-slate-900/80 dark:text-white"
          />

          {loading && (
            <Loader2
              size={19}
              className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-sky-500"
            />
          )}

          {showResults &&
            results.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                {results.map((location) => (
                  <button
                    key={`${location.id}-${location.latitude}-${location.longitude}`}
                    type="button"
                    onClick={() =>
                      handleSelect(location)
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-sky-50 dark:hover:bg-slate-800"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                      <MapPin size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-800 dark:text-white">
                        {location.name}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {location.admin1
                          ? `${location.admin1}, `
                          : ""}
                        {location.country}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
        </div>

        <button
          type="button"
          onClick={onLocate}
          disabled={locating || !onLocate}
          className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          {locating ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <MapPin size={18} />
          )}

          {locating
            ? "Localisation..."
            : "Ma position"}
        </button>
      </div>
    </div>
  );
}