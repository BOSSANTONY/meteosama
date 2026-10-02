"use client";

import dynamic from "next/dynamic";

interface WeatherMapProps {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
}

const WeatherMap = dynamic(
  () => import("./WeatherMap"),
  {
    ssr: false,
    loading: () => (
      <div className="weather-card flex h-[480px] items-center justify-center rounded-[2rem]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />

          <p className="text-sm font-semibold text-slate-500">
            Chargement de la carte...
          </p>
        </div>
      </div>
    ),
  }
);

export default function WeatherMapWrapper({
  latitude,
  longitude,
  name,
  country,
}: WeatherMapProps) {
  return (
    <WeatherMap
      latitude={latitude}
      longitude={longitude}
      locationName={`${name}, ${country}`}
    />
  );
}