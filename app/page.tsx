"use client";

import { useEffect, useState,useCallback } from "react";
import {
  Droplets,
  Gauge,
  LocateFixed,
  RefreshCw,
  Thermometer,
  Wind,
  Heart,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import WeatherChart from "@/components/WeatherChart";
import AlertBanner from "@/components/AlertBanner";
import WeatherDetails from "@/components/WeatherDetails";
import SunriseSunset from "@/components/SunriseSunset";
import WeatherMap from "@/components/WeatherMapWrapper";

import { getWeatherDescription } from "@/lib/weather-codes";
import { generateWeatherAlerts } from "@/lib/alerts";

import type {
  Location,
  WeatherResponse,
} from "@/types/weather";

const DEFAULT_LOCATION: Location = {
  id: 1,
  name: "Brazzaville",
  latitude: -4.2634,
  longitude: 15.2429,
  country: "République du Congo",
  country_code: "CG",
};

export default function Home() {
  const [location, setLocation] =
    useState<Location>(DEFAULT_LOCATION);

  const [weather, setWeather] =
    useState<WeatherResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [locating, setLocating] =
    useState(false);

  const [favorite, setFavorite] =
    useState(false);

  /*
   * ------------------------------------------------
   * CHARGEMENT DE LA MÉTÉO
   * ------------------------------------------------
   */
  function checkFavorite(
    selectedLocation: Location
  ) {
    try {
      const saved =
        localStorage.getItem(
          "bejart-meteo-favorites"
        );

      if (!saved) {
        setFavorite(false);
        return;
      }

      const favorites: Location[] =
        JSON.parse(saved);

      const exists = favorites.some(
        (item) =>
          item.latitude ===
            selectedLocation.latitude &&
          item.longitude ===
            selectedLocation.longitude
      );

      setFavorite(exists);
    } catch {
      setFavorite(false);
    }
  }

const loadWeather = useCallback( async function loadWeather(
    selectedLocation: Location
  ) {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/weather?latitude=${selectedLocation.latitude}&longitude=${selectedLocation.longitude}`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible de récupérer la météo."
        );
      }

      setWeather(data);
      setLocation(selectedLocation);
      localStorage.setItem(
  "bejart-meteo-location",
  JSON.stringify(
    selectedLocation
  )
);

      checkFavorite(selectedLocation);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * ------------------------------------------------
   * INITIALISATION
   * ------------------------------------------------
   */
useEffect(() => {
  // 1. On crée une fonction locale éphémère
  const initialize = async () => {
    await loadWeather(DEFAULT_LOCATION);
  };

  // 2. On l'exécute
  initialize();
}, [loadWeather]);

 
  /*
   * ------------------------------------------------
   * FAVORIS
   * ------------------------------------------------
   */

  

  function toggleFavorite() {
    try {
      const saved =
        localStorage.getItem(
          "bejart-meteo-favorites"
        );

      const favorites: Location[] =
        saved ? JSON.parse(saved) : [];

      const exists = favorites.some(
        (item) =>
          item.latitude ===
            location.latitude &&
          item.longitude ===
            location.longitude
      );

      let updated: Location[];

      if (exists) {
        updated = favorites.filter(
          (item) =>
            !(
              item.latitude ===
                location.latitude &&
              item.longitude ===
                location.longitude
            )
        );

        setFavorite(false);
      } else {
        updated = [
          ...favorites,
          location,
        ];

        setFavorite(true);
      }

      localStorage.setItem(
        "bejart-meteo-favorites",
        JSON.stringify(updated)
      );
    } catch {
      setError(
        "Impossible de modifier les favoris."
      );
    }
  }

  /*
   * ------------------------------------------------
   * GÉOLOCALISATION
   * ------------------------------------------------
   */

  function handleMyLocation() {
    if (!navigator.geolocation) {
      setError(
        "La géolocalisation n'est pas disponible sur cet appareil."
      );
      return;
    }

    setLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const {
            latitude,
            longitude,
          } = position.coords;

          const response =
            await fetch(
              `/api/reverse-geocode?latitude=${latitude}&longitude=${longitude}`
            );

          const data =
            await response.json();

          const currentLocation =
            data.location ?? {
              id: Date.now(),
              name: "Ma position",
              latitude,
              longitude,
              country:
                "Position actuelle",
            };

          await loadWeather(
            currentLocation
          );
        } catch {
          setError(
            "Impossible de récupérer votre position."
          );
        } finally {
          setLocating(false);
        }
      },
      () => {
        setError(
          "Autorisation de localisation refusée ou position indisponible."
        );

        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }

  /*
   * ------------------------------------------------
   * DONNÉES CALCULÉES
   * ------------------------------------------------
   */

  const current = weather?.current;

  const description = current
    ? getWeatherDescription(
        current.weather_code
      )
    : null;

  const alerts =
    weather && current
      ? generateWeatherAlerts(
          current,
          weather.daily
        )
      : [];

  /*
   * ------------------------------------------------
   * AFFICHAGE
   * ------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ================================
            EN-TÊTE
        ================================= */}

        <section className="mb-8">
          <div className="mb-6">

            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-500">
              Votre météo locale
            </p>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Bonjour, bienvenue sur{" "}
              <span className="gradient-text">
                Bejart-Meteo
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
              Consultez la météo actuelle,
              les prévisions et les conditions
              à venir, où que vous soyez.
            </p>

          </div>

          <SearchBar
            onSelect={loadWeather}
            onLocate={handleMyLocation}
            locating={locating}
          />
        </section>

        {/* ================================
            ERREUR
        ================================= */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        {/* ================================
            CHARGEMENT
        ================================= */}

        {loading ? (
          <LoadingState />
        ) : weather && current ? (
          <div className="space-y-6">

            {/* ================================
                MÉTÉO ACTUELLE
            ================================= */}

            <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">

              <div className="weather-card relative overflow-hidden rounded-[2rem] p-6 sm:p-8">

                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />

                <div className="relative">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <div className="flex items-center gap-2 text-sm font-bold text-sky-600 dark:text-sky-400">

                        <LocateFixed size={17} />

                        {location.name}

                      </div>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {location.country}
                      </p>

                    </div>

                    <div className="flex items-center gap-2">

                      <button
                        type="button"
                        onClick={
                          toggleFavorite
                        }
                        className={`rounded-xl p-2.5 transition ${
                          favorite
                            ? "bg-pink-100 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400"
                            : "text-slate-500 hover:bg-slate-100 hover:text-pink-500 dark:hover:bg-slate-800"
                        }`}
                        aria-label={
                          favorite
                            ? "Retirer des favoris"
                            : "Ajouter aux favoris"
                        }
                      >
                        <Heart
                          size={18}
                          fill={
                            favorite
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          loadWeather(
                            location
                          )
                        }
                        className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-sky-500 dark:hover:bg-slate-800"
                        aria-label="Actualiser"
                      >
                        <RefreshCw
                          size={18}
                        />
                      </button>

                    </div>
                  </div>

                  <div className="mt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">

                    <div className="text-center sm:text-left">

                      <div className="text-7xl sm:text-8xl">
                        {description?.icon}
                      </div>

                      <p className="mt-3 text-lg font-bold text-slate-700 dark:text-slate-200">
                        {description?.label}
                      </p>

                    </div>

                    <div className="text-center sm:text-right">

                      <div className="text-7xl font-black tracking-tight text-slate-900 dark:text-white sm:text-8xl">
                        {Math.round(
                          current.temperature_2m
                        )}
                        °
                      </div>

                      <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                        Ressentie{" "}
                        {Math.round(
                          current.apparent_temperature
                        )}
                        °C
                      </p>

                    </div>

                  </div>

                </div>
              </div>
              

              {/* MÉTRIQUES */}

              <div className="grid grid-cols-2 gap-4">

                <WeatherMetric
                  icon={
                    <Thermometer
                      size={20}
                    />
                  }
                  label="Ressentie"
                  value={`${Math.round(
                    current.apparent_temperature
                  )}°C`}
                />

                <WeatherMetric
                  icon={
                    <Droplets
                      size={20}
                    />
                  }
                  label="Humidité"
                  value={`${Math.round(
                    current.relative_humidity_2m
                  )}%`}
                />

                <WeatherMetric
                  icon={
                    <Wind size={20} />
                  }
                  label="Vent"
                  value={`${Math.round(
                    current.wind_speed_10m
                  )} km/h`}
                />

                <WeatherMetric
                  icon={
                    <Gauge size={20} />
                  }
                  label="Pression"
                  value={`${Math.round(
                    current.pressure_msl
                  )} hPa`}
                />

              </div>

            </section>

            {/* ================================
                HEURE PAR HEURE
            ================================= */}

            <section className="weather-card rounded-[2rem] p-6">

              <div className="mb-5">

                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Prévisions heure par heure
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Les prochaines heures dans votre zone
                </p>

              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">

                {weather.hourly.time
                  .slice(0, 12)
                  .map(
                    (
                      time,
                      index
                    ) => {

                      const hour =
                        new Date(
                          time
                        ).getHours();

                      const item =
                        getWeatherDescription(
                          weather
                            .hourly
                            .weather_code[
                            index
                          ]
                        );

                      return (
                        <div
                          key={time}
                          className="min-w-[90px] rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-800/60"
                        >

                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            {hour
                              .toString()
                              .padStart(
                                2,
                                "0"
                              )}
                            h
                          </p>

                          <div className="my-3 text-2xl">
                            {item.icon}
                          </div>

                          <p className="font-black text-slate-800 dark:text-white">
                            {Math.round(
                              weather
                                .hourly
                                .temperature_2m[
                                index
                              ]
                            )}
                            °
                          </p>

                          <p className="mt-2 text-[11px] font-semibold text-sky-500">
                            {
                              weather
                                .hourly
                                .precipitation_probability[
                                index
                              ]
                            }
                            % pluie
                          </p>

                        </div>
                      );
                    }
                  )}

              </div>
            </section>

            {/* ================================
                PRÉVISIONS 7 JOURS
            ================================= */}

            <section className="weather-card rounded-[2rem] p-6">

              <div className="mb-5">

                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Prévisions à venir
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Les 7 prochains jours
                </p>

              </div>

              <div className="space-y-3">

                {weather.daily.time
                  .slice(0, 7)
                  .map(
                    (
                      day,
                      index
                    ) => {

                      const item =
                        getWeatherDescription(
                          weather
                            .daily
                            .weather_code[
                            index
                          ]
                        );

                      const date =
                        new Date(day);

                      return (
                        <div
                          key={day}
                          className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50"
                        >

                          <div className="w-24 shrink-0">

                            <p className="font-bold text-slate-800 dark:text-white">

                              {index ===
                              0
                                ? "Aujourd'hui"
                                : date.toLocaleDateString(
                                    "fr-FR",
                                    {
                                      weekday:
                                        "short",
                                      day: "numeric",
                                    }
                                  )}

                            </p>

                          </div>

                          <div className="text-2xl">
                            {item.icon}
                          </div>

                          <div className="hidden flex-1 sm:block">

                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                              {item.label}
                            </p>

                          </div>

                          <div className="text-right">

                            <p className="font-black text-slate-900 dark:text-white">

                              {Math.round(
                                weather
                                  .daily
                                  .temperature_2m_max[
                                  index
                                ]
                              )}
                              ° /{" "}
                              {Math.round(
                                weather
                                  .daily
                                  .temperature_2m_min[
                                  index
                                ]
                              )}
                              °

                            </p>

                            <p className="text-xs font-semibold text-sky-500">

                              {
                                weather
                                  .daily
                                  .precipitation_probability_max[
                                  index
                                ]
                              }
                              % pluie

                            </p>

                          </div>

                        </div>
                      );
                    }
                  )}

              </div>

            </section>

            {/* ================================
                DÉTAILS
            ================================= */}

            <WeatherDetails
              temperature={
                current.temperature_2m
              }
              feelsLike={
                current.apparent_temperature
              }
              humidity={
                current.relative_humidity_2m
              }
              wind={
                current.wind_speed_10m
              }
              pressure={
                current.pressure_msl
              }
              clouds={
                current.cloud_cover
              }
              precipitation={
                current.precipitation
              }
              uv={
                current.uv_index ?? 0
              }
            />

            {/* ================================
                SOLEIL
            ================================= */}

            <SunriseSunset
              sunrise={
                weather.daily
                  .sunrise[0]
              }
              sunset={
                weather.daily
                  .sunset[0]
              }
            />
            <WeatherMap
  latitude={location.latitude}
  longitude={location.longitude}
  name={location.name}
  country={location.country}
/>

            {/* ================================
                GRAPHIQUE
            ================================= */}

            <WeatherChart
              times={weather.hourly.time.slice(
                0,
                12
              )}
              temperatures={weather.hourly.temperature_2m.slice(
                0,
                12
              )}
            />

            

            {/* ================================
                ALERTES
            ================================= */}

            <AlertBanner
              alerts={alerts}
            />

          </div>
          

          
        ) : null
        
        }

      </main>

      {/* ================================
          FOOTER
      ================================= */}

      <footer className="border-t border-slate-200/70 py-8 dark:border-slate-800/70">

        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

          <p className="font-black text-slate-800 dark:text-white">
            🌦️ BEJART-METEO
          </p>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Votre météo. Votre journée.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Application développée par Antony
            Christ MABIALA.
          </p>

        </div>

      </footer>
    </div>
  );
}

/*
 * =================================================
 * COMPOSANT MÉTRIQUE
 * =================================================
 */

function WeatherMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="weather-card rounded-3xl p-5">

      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
        {icon}
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
        {value}
      </p>

    </div>
  );
}

/*
 * =================================================
 * ÉTAT DE CHARGEMENT
 * =================================================
 */

function LoadingState() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">

      <div className="h-[350px] animate-pulse rounded-[2rem] bg-slate-200 dark:bg-slate-800" />

      <div className="grid grid-cols-2 gap-4">

        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="h-[165px] animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800"
          />
        ))}

      </div>

    </div>
  );
}