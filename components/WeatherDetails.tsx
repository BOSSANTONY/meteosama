import {
  Cloud,
  Droplets,
  Gauge,
  Navigation,
  Thermometer,
  Umbrella,
  Wind,
} from "lucide-react";

interface WeatherDetailsProps {
  temperature: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  pressure: number;
  clouds: number;
  precipitation: number;
  uv: number;
}

export default function WeatherDetails({
  temperature,
  feelsLike,
  humidity,
  wind,
  pressure,
  clouds,
  precipitation,
  uv,
}: WeatherDetailsProps) {
  const details = [
    {
      icon: Thermometer,
      label: "Température",
      value: `${Math.round(
        temperature
      )}°C`,
    },
    {
      icon: Thermometer,
      label: "Ressentie",
      value: `${Math.round(
        feelsLike
      )}°C`,
    },
    {
      icon: Droplets,
      label: "Humidité",
      value: `${Math.round(
        humidity
      )}%`,
    },
    {
      icon: Wind,
      label: "Vent",
      value: `${Math.round(
        wind
      )} km/h`,
    },
    {
      icon: Gauge,
      label: "Pression",
      value: `${Math.round(
        pressure
      )} hPa`,
    },
    {
      icon: Cloud,
      label: "Nuages",
      value: `${Math.round(
        clouds
      )}%`,
    },
    {
      icon: Umbrella,
      label: "Précipitations",
      value: `${precipitation.toFixed(
        1
      )} mm`,
    },
    {
      icon: Navigation,
      label: "Indice UV",
      value: uv.toFixed(1),
    },
  ];

  return (
    <section className="weather-card rounded-[2rem] p-6">
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Détails météo
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Les conditions actuelles
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {details.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                <Icon size={17} />
              </div>

              <p className="text-xs font-semibold text-slate-400">
                {item.label}
              </p>

              <p className="mt-1 font-black text-slate-900 dark:text-white">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}