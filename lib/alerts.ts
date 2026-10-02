import type {
  CurrentWeather,
  DailyWeather,
} from "@/types/weather";

export type AlertLevel =
  | "info"
  | "warning"
  | "danger";

export interface WeatherAlert {
  id: string;
  title: string;
  message: string;
  level: AlertLevel;
  icon: string;
}

export function generateWeatherAlerts(
  current: CurrentWeather,
  daily: DailyWeather
): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  const rainProbability =
    daily.precipitation_probability_max?.[0] ??
    0;

  const maxTemperature =
    daily.temperature_2m_max?.[0] ?? 0;

  const maxWind =
    daily.wind_speed_10m_max?.[0] ?? 0;

  const uv =
    daily.uv_index_max?.[0] ?? 0;

  if (
    [95, 96, 99].includes(
      current.weather_code
    )
  ) {
    alerts.push({
      id: "storm",
      title: "Risque d'orage",
      message:
        "Des conditions orageuses sont actuellement détectées.",
      level: "danger",
      icon: "⛈️",
    });
  }

  if (rainProbability >= 70) {
    alerts.push({
      id: "heavy-rain",
      title: "Risque élevé de pluie",
      message: `La probabilité maximale de précipitations est de ${rainProbability}%.`,
      level: "warning",
      icon: "🌧️",
    });
  }

  if (maxTemperature >= 35) {
    alerts.push({
      id: "heat",
      title: "Forte chaleur",
      message: `La température maximale prévue atteint ${Math.round(
        maxTemperature
      )}°C.`,
      level: "warning",
      icon: "🔥",
    });
  }

  if (maxWind >= 50) {
    alerts.push({
      id: "wind",
      title: "Vent fort",
      message: `Des rafales ou vents pouvant atteindre ${Math.round(
        maxWind
      )} km/h sont prévus.`,
      level: "warning",
      icon: "💨",
    });
  }

  if (uv >= 8) {
    alerts.push({
      id: "uv",
      title: "Indice UV élevé",
      message:
        "Une protection solaire est recommandée lors des activités extérieures.",
      level: "warning",
      icon: "☀️",
    });
  }

  if (
    current.relative_humidity_2m >= 85
  ) {
    alerts.push({
      id: "humidity",
      title: "Humidité élevée",
      message:
        "L'humidité est actuellement élevée.",
      level: "info",
      icon: "💧",
    });
  }

  return alerts;
}