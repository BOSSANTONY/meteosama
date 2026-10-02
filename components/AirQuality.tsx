"use client";
import { useEffect, useState } from "react";

import {
  Activity,
  AlertCircle,
  Cloud,
  Droplets,
  Wind,
} from "lucide-react";

interface AirQualityProps {
  latitude: number;
  longitude: number;
}

interface AirQualityData {
  current?: {
    pm10?: number;
    pm2_5?: number;
    carbon_monoxide?: number;
    nitrogen_dioxide?: number;
    sulphur_dioxide?: number;
    ozone?: number;
    aerosol_optical_depth?: number;
  };
}

function formatValue(
  value: number | undefined
) {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return value < 10
    ? value.toFixed(1)
    : Math.round(value).toString();
}

function getPollutionLevel(
  pollutant: string,
  value: number | undefined
) {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return {
      label: "Indisponible",
      className:
        "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
    };
  }

  /*
   * Ces seuils sont utilisés ici uniquement
   * pour présenter les valeurs de façon lisible.
   * Ils ne constituent pas une alerte officielle.
   */

  let level = "Faible";

  if (pollutant === "PM2.5") {
    if (value > 35) {
      level = "Élevé";
    } else if (value > 15) {
      level = "Modéré";
    }
  }

  if (pollutant === "PM10") {
    if (value > 50) {
      level = "Élevé";
    } else if (value > 25) {
      level = "Modéré";
    }
  }

  if (pollutant === "NO₂") {
    if (value > 100) {
      level = "Élevé";
    } else if (value > 40) {
      level = "Modéré";
    }
  }

  if (pollutant === "O₃") {
    if (value > 120) {
      level = "Élevé";
    } else if (value > 70) {
      level = "Modéré";
    }
  }

  if (pollutant === "SO₂") {
    if (value > 125) {
      level = "Élevé";
    } else if (value > 40) {
      level = "Modéré";
    }
  }

  const styles = {
    Faible:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    Modéré:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    Élevé:
      "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  };

  return {
    label: level,
    className:
      styles[level as keyof typeof styles],
  };
}

function PollutantCard({
  icon,
  name,
  value,
  unit,
}: {
  icon: React.ReactNode;
  name: string;
  value: number | undefined;
  unit: string;
}) {
  const level =
    getPollutionLevel(name, value);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70">

      <div className="flex items-start justify-between gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
          {icon}
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${level.className}`}
        >
          {level.label}
        </span>

      </div>

      <p className="mt-5 text-sm font-bold text-slate-500 dark:text-slate-400">
        {name}
      </p>

      <div className="mt-1 flex items-baseline gap-1">

        <p className="text-2xl font-black text-slate-900 dark:text-white">
          {formatValue(value)}
        </p>

        <span className="text-xs font-semibold text-slate-400">
          {unit}
        </span>

      </div>

    </div>
  );
}

export default function AirQuality({
  latitude,
  longitude,
}: AirQualityProps) {
  const [data, setData] =
  useState<AirQualityData | null>(
    null
  );

const [loading, setLoading] =
  useState(true);

const [error, setError] =
  useState<string | null>(null);

  useEffect(() => {
    async function loadAirQuality() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await fetch(
            `/api/air-quality?latitude=${latitude}&longitude=${longitude}`
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Impossible de récupérer la qualité de l'air."
          );
        }

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de récupérer la qualité de l'air."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAirQuality();
  }, [latitude, longitude]);

  if (loading) {
    return (
      <section className="weather-card rounded-[2rem] p-6">

        <div className="mb-6 h-7 w-56 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}

        </div>

      </section>
    );
  }

  if (error) {
    return (
      <section className="weather-card rounded-[2rem] p-6">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <AlertCircle size={21} />
          </div>

          <div>

            <h2 className="font-black text-slate-900 dark:text-white">
              Qualité de l&apos;air
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {error}
            </p>

          </div>

        </div>

      </section>
    );
  }

  const current =
    data?.current;

  return (
    <section className="weather-card rounded-[2rem] p-6 sm:p-8">

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Wind size={21} />
          </div>

          <div>

            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Qualité de l&apos;air
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Conditions atmosphériques actuelles
            </p>

          </div>

        </div>

        <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
          Données actuelles
        </span>

      </div>

      <div className="mb-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Activity size={28} />
          </div>

          <div>

            <p className="text-sm font-semibold text-white/70">
              Surveillance des principaux polluants
            </p>

            <p className="mt-1 text-2xl font-black">
              Consultez les concentrations actuelles
            </p>

          </div>

        </div>

      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <PollutantCard
          icon={
            <Cloud size={19} />
          }
          name="PM2.5"
          value={current?.pm2_5}
          unit="µg/m³"
        />

        <PollutantCard
          icon={
            <Cloud size={19} />
          }
          name="PM10"
          value={current?.pm10}
          unit="µg/m³"
        />

        <PollutantCard
          icon={
            <Wind size={19} />
          }
          name="NO₂"
          value={
            current?.nitrogen_dioxide
          }
          unit="µg/m³"
        />

        <PollutantCard
          icon={
            <Droplets size={19} />
          }
          name="O₃"
          value={current?.ozone}
          unit="µg/m³"
        />

        <PollutantCard
          icon={
            <Activity size={19} />
          }
          name="SO₂"
          value={
            current?.sulphur_dioxide
          }
          unit="µg/m³"
        />

        <PollutantCard
          icon={
            <Wind size={19} />
          }
          name="CO"
          value={
            current?.carbon_monoxide
          }
          unit="µg/m³"
        />

      </div>

      <p className="mt-6 text-xs leading-5 text-slate-400">
        Les valeurs affichées proviennent des
        données de qualité de l&apos;air disponibles
        pour la position sélectionnée. Les
        indications de niveau servent à faciliter
        la lecture et ne remplacent pas les
        recommandations ou alertes officielles.
      </p>

    </section>
  );
}