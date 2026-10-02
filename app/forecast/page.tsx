"use client";

import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import type { ReactNode } from "react";
import {
  CalendarDays,
  ChevronDown,
  Droplets,
  MapPin,
  Sun,
  Thermometer,
  Umbrella,
  Wind,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";

import { getWeatherDescription } from "@/lib/weather-codes";

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

export default function ForecastPage() {
  const [location, setLocation] =
    useState<Location>(DEFAULT_LOCATION);

  const [weather, setWeather] =
    useState<WeatherResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [selectedDay, setSelectedDay] =
    useState(0);

  const [locating, setLocating] =
    useState(false);

  const loadWeather = useCallback(async function loadWeather(
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
            "Impossible de récupérer les prévisions."
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
      setSelectedDay(0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  },[]);
  useEffect(() => {
  const initializeForecast = async () => {
    await loadWeather(DEFAULT_LOCATION);
  };
  initializeForecast();
}, [loadWeather]); // Ajoutez loadWeather dans les dépendances

  function handleMyLocation() {
    if (!navigator.geolocation) {
      setError(
        "La géolocalisation n'est pas disponible."
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
          "Position indisponible ou autorisation refusée."
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

  const selectedHourly =
    useMemo(() => {
      if (!weather) {
        return [];
      }

      const selectedDate =
        weather.daily.time[
          selectedDay
        ];

      return weather.hourly.time
        .map((time, index) => ({
          time,
          index,
        }))
        .filter(
          ({ time }) =>
            time.startsWith(selectedDate)
        );
    }, [weather, selectedDay]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HEADER */}

        <section className="mb-8">

          <div className="mb-6">

            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-500">
              Prévisions météo
            </p>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Prévisions sur 7 jours
            </h1>

            <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
              Consultez l&apos;évolution de la météo
              jour après jour et heure par heure.
            </p>

          </div>

          <SearchBar
            onSelect={loadWeather}
            onLocate={handleMyLocation}
            locating={locating}
          />

        </section>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <ForecastLoading />
        ) : weather ? (
          <div className="space-y-6">

            {/* LOCATION */}

            <section className="weather-card rounded-[2rem] p-6">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                    <MapPin size={22} />
                  </div>

                  <div>

                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {location.name}
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {location.country}
                    </p>

                  </div>

                </div>

                <div className="text-sm font-semibold text-slate-400">
                  7 jours de prévisions
                </div>

              </div>

            </section>

            {/* DAY SELECTOR */}

            <section className="weather-card rounded-[2rem] p-4 sm:p-6">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                  <CalendarDays size={19} />
                </div>

                <div>

                  <h2 className="font-black text-slate-900 dark:text-white">
                    Choisir une journée
                  </h2>

                  <p className="text-xs text-slate-500">
                    Sélectionnez une journée pour voir ses détails
                  </p>

                </div>

              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

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

                      const active =
                        selectedDay ===
                        index;

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() =>
                            setSelectedDay(
                              index
                            )
                          }
                          className={`rounded-2xl border p-4 text-left transition ${
                            active
                              ? "border-sky-500 bg-sky-50 shadow-lg shadow-sky-500/10 dark:bg-sky-950/40"
                              : "border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800"
                          }`}
                        >

                          <div className="flex items-start justify-between">

                            <div>

                              <p
                                className={`text-sm font-black ${
                                  active
                                    ? "text-sky-600 dark:text-sky-400"
                                    : "text-slate-900 dark:text-white"
                                }`}
                              >
                                {index ===
                                0
                                  ? "Aujourd'hui"
                                  : date.toLocaleDateString(
                                      "fr-FR",
                                      {
                                        weekday:
                                          "long",
                                        day: "numeric",
                                        month:
                                          "short",
                                      }
                                    )}
                              </p>

                            </div>

                            <span className="text-3xl">
                              {item.icon}
                            </span>

                          </div>

                          <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {item.label}
                          </p>

                          <div className="mt-3 flex items-end justify-between">

                            <p className="text-xl font-black text-slate-900 dark:text-white">
                              {Math.round(
                                weather
                                  .daily
                                  .temperature_2m_max[
                                  index
                                ]
                              )}
                              °
                            </p>

                            <p className="text-sm font-bold text-slate-400">
                              {Math.round(
                                weather
                                  .daily
                                  .temperature_2m_min[
                                  index
                                ]
                              )}
                              °
                            </p>

                          </div>

                        </button>
                      );
                    }
                  )}

              </div>

            </section>

            {/* SELECTED DAY */}

            <SelectedDayDetails
              weather={weather}
              selectedDay={selectedDay}
            />

            {/* HOURLY */}

            <section className="weather-card rounded-[2rem] p-6">

              <div className="mb-6 flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Prévisions heure par heure
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Évolution des conditions pendant la journée
                  </p>

                </div>

                <ChevronDown
                  size={20}
                  className="text-slate-400"
                />

              </div>

              <div className="overflow-x-auto">

                <div className="flex min-w-max gap-3 pb-3">

                  {selectedHourly.map(
                    ({
                      time,
                      index,
                    }) => {

                      const item =
                        getWeatherDescription(
                          weather
                            .hourly
                            .weather_code[
                            index
                          ]
                        );

                      const hour =
                        new Date(
                          time
                        ).getHours();

                      return (
                        <div
                          key={time}
                          className="w-[105px] rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-900"
                        >

                          <p className="text-xs font-bold text-slate-500">
                            {hour
                              .toString()
                              .padStart(
                                2,
                                "0"
                              )}
                            h
                          </p>

                          <div className="my-3 text-3xl">
                            {item.icon}
                          </div>

                          <p className="text-lg font-black text-slate-900 dark:text-white">
                            {Math.round(
                              weather
                                .hourly
                                .temperature_2m[
                                index
                              ]
                            )}
                            °
                          </p>

                          <div className="mt-3 flex items-center justify-center gap-1 text-xs font-bold text-sky-500">
                            <Droplets
                              size={13}
                            />

                            {
                              weather
                                .hourly
                                .precipitation_probability[
                                index
                              ]
                            }
                            %
                          </div>

                          <div className="mt-2 flex items-center justify-center gap-1 text-xs font-semibold text-slate-400">
                            <Wind
                              size={13}
                            />

                            {Math.round(
                              weather
                                .hourly
                                .wind_speed_10m[
                                index
                              ]
                            )}{" "}
                            km/h
                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>

            </section>

          </div>
        ) : null}

      </main>

      <footer className="border-t border-slate-200/70 py-8 dark:border-slate-800/70">

        <div className="mx-auto max-w-7xl px-4 text-center">

          <p className="font-black text-slate-800 dark:text-white">
            🌦️ BEJART-METEO
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Des prévisions claires pour mieux préparer votre journée.
          </p>

        </div>

      </footer>
    </div>
  );
}

/*
 * =====================================================
 * DÉTAILS DU JOUR
 * =====================================================
 */

function SelectedDayDetails({
  weather,
  selectedDay,
}: {
  weather: WeatherResponse;
  selectedDay: number;
}) {
  const max =
    weather.daily
      .temperature_2m_max[
      selectedDay
    ];

  const min =
    weather.daily
      .temperature_2m_min[
      selectedDay
    ];

  const precipitation =
    weather.daily
      .precipitation_sum[
      selectedDay
    ];

  const rainProbability =
    weather.daily
      .precipitation_probability_max[
      selectedDay
    ];

  const wind =
    weather.daily
      .wind_speed_10m_max[
      selectedDay
    ];

  const uv =
    weather.daily
      .uv_index_max[
      selectedDay
    ];

  const item =
    getWeatherDescription(
      weather.daily
        .weather_code[
        selectedDay
      ]
    );

  return (
    <section className="weather-card overflow-hidden rounded-[2rem]">

      <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 text-white sm:p-8">

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-bold uppercase tracking-wider text-white/70">
              Journée sélectionnée
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {item.label}
            </h2>

          </div>

          <div className="text-7xl">
            {item.icon}
          </div>

        </div>

      </div>

      <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 lg:grid-cols-6">

        <ForecastStat
          icon={
            <Thermometer
              size={18}
            />
          }
          label="Maximale"
          value={`${Math.round(max)}°C`}
        />

        <ForecastStat
          icon={
            <Thermometer
              size={18}
            />
          }
          label="Minimale"
          value={`${Math.round(min)}°C`}
        />

        <ForecastStat
          icon={
            <Droplets size={18} />
          }
          label="Pluie"
          value={`${Math.round(
            rainProbability
          )}%`}
        />

        <ForecastStat
          icon={
            <Umbrella size={18} />
          }
          label="Précipitations"
          value={`${Number(
            precipitation
          ).toFixed(1)} mm`}
        />

        <ForecastStat
          icon={
            <Wind size={18} />
          }
          label="Vent max."
          value={`${Math.round(
            wind
          )} km/h`}
        />

        <ForecastStat
          icon={
            <Sun size={18} />
          }
          label="Indice UV"
          value={Number(
            uv
          ).toFixed(1)}
        />

      </div>

      <div className="grid gap-4 border-t border-slate-200/70 p-6 dark:border-slate-800 sm:grid-cols-2">

        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900">

          <div className="flex items-center gap-3">

            <Sun className="text-amber-500" />

            <div>

              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Lever du soleil
              </p>

              <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                {formatTime(
                  weather.daily
                    .sunrise[
                    selectedDay
                  ]
                )}
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900">

          <div className="flex items-center gap-3">

            <Sun className="text-indigo-500" />

            <div>

              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Coucher du soleil
              </p>

              <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                {formatTime(
                  weather.daily
                    .sunset[
                    selectedDay
                  ]
                )}
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

/*
 * =====================================================
 * STATISTIQUE
 * =====================================================
 */

function ForecastStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">

      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
        {icon}
      </div>

      <p className="text-xs font-semibold text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">
        {value}
      </p>

    </div>
  );
}

/*
 * =====================================================
 * FORMAT HEURE
 * =====================================================
 */

function formatTime(
  value: string
) {
  return new Date(
    value
  ).toLocaleTimeString(
    "fr-FR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

/*
 * =====================================================
 * LOADING
 * =====================================================
 */

function ForecastLoading() {
  return (
    <div className="space-y-6">

      <div className="h-28 animate-pulse rounded-[2rem] bg-slate-200 dark:bg-slate-800" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {Array.from({
          length: 7,
        }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
          />
        ))}

      </div>

      <div className="h-80 animate-pulse rounded-[2rem] bg-slate-200 dark:bg-slate-800" />

    </div>
  );
}