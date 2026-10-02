"use client";

import dynamic from "next/dynamic";
import { useEffect, useState,useCallback } from "react";
import { Map, MapPin, RefreshCw } from "lucide-react";

import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import type { Location, WeatherResponse } from "@/types/weather";
import { getWeatherDescription } from "@/lib/weather-codes";

const WeatherMap = dynamic(
  () => import("@/components/WeatherMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-3xl bg-slate-100 dark:bg-slate-900 sm:h-[500px]">
        <div className="flex items-center gap-3 text-slate-500">
          <RefreshCw className="animate-spin" size={20} />
          Chargement de la carte...
        </div>
      </div>
    ),
  }
);

const DEFAULT_LOCATION: Location = {
  id: 1,
  name: "Brazzaville",
  latitude: -4.2634,
  longitude: 15.2429,
  country: "République du Congo",
  country_code: "CG",
};

export default function MapPage() {
  const [location, setLocation] =
    useState<Location>(DEFAULT_LOCATION);

  const [weather, setWeather] =
    useState<WeatherResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadWeather = useCallback(async function loadWeather(selectedLocation: Location) {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/weather?latitude=${selectedLocation.latitude}&longitude=${selectedLocation.longitude}`
      );

      if (!response.ok) {
        throw new Error(
          "Impossible de récupérer les données météo."
        );
      }

      const data: WeatherResponse =
        await response.json();

      setLocation(selectedLocation);
      setWeather(data);

      localStorage.setItem(
        "bejart-meteo-location",
        JSON.stringify(selectedLocation)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  } , []);

 useEffect(() => {
  // 1. Créez une fonction asynchrone interne pour isoler l'exécution
  const initializeMapWeather = async () => {
    try {
      const saved = localStorage.getItem("selected_location"); // Utilisez votre clé exacte (ex: "favorites" ou "selected_location")
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.name === "string") {
          // 2. L'appel devient asynchrone aux yeux du linter
          await loadWeather(parsed);
          return;
        }
      }
    } catch {
      // On conserve la ville par défaut en cas d'erreur
    }

    // Si aucun favori n'est trouvé, chargez la ville par défaut
    await loadWeather(DEFAULT_LOCATION);
  };

  initializeMapWeather();
}, [loadWeather]); // 3. Pensez à ajouter loadWeather dans les dépendances (et assurez-vous qu'elle utilise useCallback au-dessus)


  const current = weather?.current;

  const description = current
    ? getWeatherDescription(current.weather_code)
    : undefined;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* En-tête */}
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
              <Map size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                Carte météo
              </h1>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Explorez la météo directement sur la carte.
              </p>
            </div>
          </div>
        </section>

        {/* Recherche */}
        <section className="mb-6">
          <SearchBar
            onSelect={(selectedLocation) =>
              loadWeather(selectedLocation)
            }
          />
        </section>

        {/* Erreur */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Informations */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2 text-slate-500">
              <MapPin size={18} />
              <span className="text-sm">
                Position
              </span>
            </div>

            <p className="font-semibold text-slate-900 dark:text-white">
              {location.name}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {location.country}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-3 text-sm text-slate-500">
              Température
            </p>

            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {current
                ? `${Math.round(
                    current.temperature_2m
                  )}°C`
                : "--"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-3 text-sm text-slate-500">
              Conditions
            </p>

            <p className="font-semibold text-slate-900 dark:text-white">
              {description?.label ?? "Chargement..."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-3 text-sm text-slate-500">
              Coordonnées
            </p>

            <p className="font-mono text-sm font-medium text-slate-900 dark:text-white">
              {location.latitude.toFixed(3)}
            </p>

            <p className="font-mono text-sm font-medium text-slate-900 dark:text-white">
              {location.longitude.toFixed(3)}
            </p>
          </div>
        </section>

        {/* Carte */}
        {loading ? (
          <div className="flex h-[420px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:h-[500px]">
            <div className="flex items-center gap-3 text-slate-500">
              <RefreshCw
                size={20}
                className="animate-spin"
              />
              Chargement des données météo...
            </div>
          </div>
        ) : (
          <WeatherMap
            latitude={location.latitude}
            longitude={location.longitude}
            locationName={location.name}
            temperature={current?.temperature_2m}
            description={description?.label}
          />
        )}

        {/* Informations */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            À propos de la carte
          </h2>

          <div className="mt-4 grid gap-4 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Navigation
              </p>
              <p>
                Déplacez la carte et utilisez les contrôles
                de zoom pour explorer les environs.
              </p>
            </div>

            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Localisation
              </p>
              <p>
                Le point affiché correspond à la ville
                actuellement sélectionnée.
              </p>
            </div>

            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Données
              </p>
              <p>
                Les informations météo affichées sont
                fournies par les données utilisées par
                Bejart-Meteo.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500">
          © 2026 Bejart-Meteo — Antony Christ MABIALA
        </div>
      </footer>
    </div>
  );
}