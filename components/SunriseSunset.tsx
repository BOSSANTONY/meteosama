import {
  Sunrise,
  Sunset,
} from "lucide-react";

interface SunriseSunsetProps {
  sunrise: string;
  sunset: string;
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString(
    "fr-FR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

export default function SunriseSunset({
  sunrise,
  sunset,
}: SunriseSunsetProps) {
  return (
    <section className="weather-card rounded-[2rem] p-6">
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Soleil
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Aujourd&apos;hui
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-amber-50 p-5 dark:bg-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
              <Sunrise size={22} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-amber-600">
                Lever
              </p>

              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {formatTime(sunrise)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-indigo-50 p-5 dark:bg-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
              <Sunset size={22} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                Coucher
              </p>

              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {formatTime(sunset)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}