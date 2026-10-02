import {
  AlertTriangle,
  Info,
  ShieldAlert,
} from "lucide-react";
import type { WeatherAlert } from "@/lib/alerts";

interface AlertBannerProps {
  alerts: WeatherAlert[];
}

export default function AlertBanner({
  alerts,
}: AlertBannerProps) {
  if (alerts.length === 0) {
    return (
      <section className="weather-card rounded-[2rem] border border-emerald-200 bg-emerald-50/80 p-6 dark:border-emerald-900/40 dark:bg-emerald-950/20">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
            ✓
          </div>

          <div>
            <h2 className="font-black text-slate-900 dark:text-white">
              Aucune alerte détectée
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Les conditions actuelles ne déclenchent
              aucune alerte calculée par Bejart-Meteo.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Alertes météo
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Conditions nécessitant votre attention
        </p>
      </div>

      {alerts.map((alert) => {
        const Icon =
          alert.level === "danger"
            ? ShieldAlert
            : alert.level === "warning"
              ? AlertTriangle
              : Info;

        const styles =
          alert.level === "danger"
            ? "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20"
            : alert.level === "warning"
              ? "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20"
              : "border-sky-200 bg-sky-50 dark:border-sky-900/40 dark:bg-sky-950/20";

        return (
          <div
            key={alert.id}
            className={`rounded-2xl border p-5 ${styles}`}
          >
            <div className="flex gap-4">
              <div className="text-2xl">
                {alert.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon
                    size={17}
                    className="text-slate-600 dark:text-slate-300"
                  />

                  <h3 className="font-black text-slate-900 dark:text-white">
                    {alert.title}
                  </h3>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {alert.message}
                </p>

                <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Alerte calculée par Bejart-Meteo
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}