"use client";

import {
  useState,
} from "react";

import Navbar from "@/components/Navbar";
import AirQuality from "@/components/AirQuality";

import type { Location } from "@/types/weather";

const DEFAULT_LOCATION: Location = {
  id: 1,
  name: "Brazzaville",
  latitude: -4.2634,
  longitude: 15.2429,
  country: "République du Congo",
  country_code: "CG",
};

export default function AirQualityPage() {
  const [location] = useState<Location>(() => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("votre_clef_location"); // Remplacez par votre clé exacte
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.latitude === "number") {
          return parsed;
        }
      }
    } catch {
      // En cas d'erreur, retourne la valeur par défaut
    }
  }
  return DEFAULT_LOCATION; // Votre valeur par défaut
});
 

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <section className="mb-8">

          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-500">
            Atmosphère
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Qualité de l&apos;air
          </h1>

          <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
            Consultez les principaux polluants
            atmosphériques mesurés autour de la
            zone sélectionnée.
          </p>

        </section>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">

          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Localisation
          </p>

          <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            {location.name}
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {location.country}
          </p>

        </div>

        <AirQuality
          latitude={location.latitude}
          longitude={location.longitude}
        />

      </main>

      <footer className="border-t border-slate-200/70 py-8 dark:border-slate-800/70">

        <div className="mx-auto max-w-7xl px-4 text-center">

          <p className="font-black text-slate-800 dark:text-white">
            🌦️ BEJART-METEO
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Votre météo. Votre journée.
          </p>

        </div>

      </footer>

    </div>
  );
}