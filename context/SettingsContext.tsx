"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type TemperatureUnit = "celsius" | "fahrenheit";
export type WindUnit = "kmh" | "mph";
export type TimeFormat = "24h" | "12h";

interface SettingsContextType {
  temperatureUnit: TemperatureUnit;
  windUnit: WindUnit;
  timeFormat: TimeFormat;

  setTemperatureUnit: (
    unit: TemperatureUnit
  ) => void;

  setWindUnit: (unit: WindUnit) => void;

  setTimeFormat: (format: TimeFormat) => void;
}

const SettingsContext =
  createContext<SettingsContextType | undefined>(
    undefined
  );

const STORAGE_KEY = "bejart-meteo-settings";

export function SettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [temperatureUnit, setTemperatureUnitState] = useState<"celsius" | "fahrenheit">(() => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("settings"); // Remplacez par votre clé exacte de localStorage si différente
      if (saved) {
        const settings = JSON.parse(saved);
        if (settings && (settings.temperatureUnit === "celsius" || settings.temperatureUnit === "fahrenheit")) {
          return settings.temperatureUnit;
        }
      }
    } catch {
      // En cas d'erreur de parsing, on utilise la valeur par défaut
    }
  }
  return "celsius"; // Votre unité de température par défaut
});

  const [windUnit, setWindUnitState] =
    useState<WindUnit>("kmh");

  const [timeFormat, setTimeFormatState] =
    useState<TimeFormat>("24h");

  

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        temperatureUnit,
        windUnit,
        timeFormat,
      })
    );
  }, [
    temperatureUnit,
    windUnit,
    timeFormat,
  ]);

  const value = useMemo(
    () => ({
      temperatureUnit,
      windUnit,
      timeFormat,

      setTemperatureUnit:
        setTemperatureUnitState,

      setWindUnit: setWindUnitState,

      setTimeFormat: setTimeFormatState,
    }),
    [
      temperatureUnit,
      windUnit,
      timeFormat,
    ]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings doit être utilisé dans SettingsProvider"
    );
  }

  return context;
}