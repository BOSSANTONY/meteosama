"use client";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";

interface WeatherMapProps {
  latitude: number;
  longitude: number;
  locationName: string;
  temperature?: number;
  description?: string;
}

export default function WeatherMap({
  latitude,
  longitude,
  locationName,
  temperature,
  description,
}: WeatherMapProps) {
  const position: LatLngExpression = [latitude, longitude];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="relative h-[420px] w-full sm:h-[500px]">
        <MapContainer
          center={position}
          zoom={10}
          scrollWheelZoom={true}
          zoomControl={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ZoomControl position="bottomright" />

          <CircleMarker
            center={position}
            radius={14}
            pathOptions={{
              fillOpacity: 0.85,
              weight: 3,
            }}
          >
            <Popup>
              <div className="min-w-[180px]">
                <h3 className="mb-2 text-base font-bold text-slate-900">
                  {locationName}
                </h3>

                {temperature !== undefined && (
                  <p className="text-2xl font-bold text-slate-900">
                    {Math.round(temperature)}°C
                  </p>
                )}

                {description && (
                  <p className="mt-1 text-sm text-slate-600">
                    {description}
                  </p>
                )}

                <p className="mt-2 text-xs text-slate-500">
                  {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        </MapContainer>

        <div className="pointer-events-none absolute left-4 top-4 z-[1000]">
          <div className="rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Carte météo
            </p>

            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
              {locationName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}