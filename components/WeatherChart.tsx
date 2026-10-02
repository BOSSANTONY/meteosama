"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface WeatherChartProps {
  times: string[];
  temperatures: number[];
}

export default function WeatherChart({
  times,
  temperatures,
}: WeatherChartProps) {
  const data = times.map(
    (time, index) => ({
      time: new Date(time).toLocaleTimeString(
        "fr-FR",
        {
          hour: "2-digit",
        }
      ),
      temperature: Math.round(
        temperatures[index]
      ),
    })
  );

  return (
    <section className="weather-card rounded-[2rem] p-6">
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Évolution de la température
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Prévision des prochaines heures
        </p>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.15}
            />

            <XAxis
              dataKey="time"
              tick={{
                fontSize: 11,
              }}
            />

            <YAxis
              tick={{
                fontSize: 11,
              }}
              unit="°"
            />

            <Tooltip
              formatter={(value) => [
                `${value}°C`,
                "Température",
              ]}
            />

            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={{
                r: 3,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}