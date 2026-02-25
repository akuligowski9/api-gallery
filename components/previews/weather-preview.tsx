"use client";

import { cn } from "@/lib/utils";
import type { PreviewData } from "@/lib/types";

interface WeatherPreviewProps {
  data: PreviewData;
  compact?: boolean;
}

/**
 * Map weather codes to emoji + description fallbacks.
 * WMO weather interpretation codes (Open-Meteo standard).
 */
function getWeatherIcon(code: number): string {
  if (code === 0) return "\u2600\uFE0F"; // Clear sky
  if (code === 1) return "\uD83C\uDF24\uFE0F"; // Mainly clear
  if (code === 2) return "\u26C5"; // Partly cloudy
  if (code === 3) return "\u2601\uFE0F"; // Overcast
  if (code >= 45 && code <= 48) return "\uD83C\uDF2B\uFE0F"; // Fog
  if (code >= 51 && code <= 57) return "\uD83C\uDF26\uFE0F"; // Drizzle
  if (code >= 61 && code <= 67) return "\uD83C\uDF27\uFE0F"; // Rain
  if (code >= 71 && code <= 77) return "\uD83C\uDF28\uFE0F"; // Snow
  if (code >= 80 && code <= 82) return "\uD83C\uDF27\uFE0F"; // Rain showers
  if (code >= 85 && code <= 86) return "\uD83C\uDF28\uFE0F"; // Snow showers
  if (code >= 95) return "\u26C8\uFE0F"; // Thunderstorm
  return "\uD83C\uDF24\uFE0F";
}

/**
 * Get the current day index (0 = Monday, 6 = Sunday) to highlight in forecast.
 */
function getCurrentDayIndex(days: string[]): number {
  const dayMap: Record<string, number> = {
    sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
  };
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" }).toLowerCase();
  return days.findIndex((d) => d.toLowerCase() === today);
}

export function WeatherPreview({ data, compact = false }: WeatherPreviewProps) {
  const { sampleResponse, previewConfig } = data;
  const { title } = previewConfig;

  const temperature = sampleResponse.temperature as number | undefined;
  const humidity = sampleResponse.humidity as number | undefined;
  const windspeed = sampleResponse.windspeed as number | undefined;
  const windspeedUnit = (sampleResponse.windspeed_unit as string) ?? "km/h";
  const tempUnit = (sampleResponse.temperature_unit as string) ?? "°C";
  const weatherCode = (sampleResponse.weathercode as number) ?? 1;
  const weatherDescription =
    (sampleResponse.weathercode_description as string) ?? "Clear";

  const forecast = sampleResponse.forecast as
    | { days: string[]; temperatures: number[] }
    | undefined;

  const days = forecast?.days ?? [];
  const temps = forecast?.temperatures ?? [];
  const minTemp = temps.length > 0 ? Math.min(...temps) : 0;
  const maxTemp = temps.length > 0 ? Math.max(...temps) : 1;
  const tempRange = maxTemp - minTemp || 1;
  const todayIndex = getCurrentDayIndex(days);

  const icon = getWeatherIcon(weatherCode);

  // ── Compact Mode ──────────────────────────────────────────────────
  if (compact) {
    return (
      <div
        className={cn(
          "relative flex flex-col justify-between overflow-hidden rounded-xl",
          "bg-gradient-to-br from-sky-400 to-blue-500",
          "dark:from-slate-700 dark:to-slate-800",
          "p-4 h-[160px]",
        )}
      >
        {/* Top: temp + icon + location */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-3xl font-bold text-white tracking-tight">
              {temperature !== undefined ? `${Math.round(temperature)}${tempUnit}` : "—"}
            </p>
            <p className="mt-0.5 text-xs font-medium text-white/80">
              {title}
            </p>
          </div>
          <span className="text-3xl" role="img" aria-label={weatherDescription}>
            {icon}
          </span>
        </div>

        {/* Bottom: mini forecast bars */}
        {temps.length > 0 && (
          <div className="flex items-end gap-1 mt-auto">
            {temps.map((temp, i) => {
              const height = ((temp - minTemp) / tempRange) * 32 + 8;
              const isToday = i === todayIndex;
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
                  <div
                    className={cn(
                      "w-full rounded-sm transition-all",
                      isToday
                        ? "bg-amber-300"
                        : "bg-white/40",
                    )}
                    style={{ height: `${height}px` }}
                  />
                  <span className="text-[8px] font-medium text-white/70 leading-none">
                    {days[i]?.[0]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── Full Mode ─────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl",
        "bg-gradient-to-br from-sky-400 to-blue-500",
        "dark:from-slate-700 dark:to-slate-800",
      )}
    >
      {/* Header section */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-5xl font-bold tracking-tight text-white">
              {temperature !== undefined ? Math.round(temperature) : "—"}
            </span>
            <span className="text-2xl font-medium text-white/70">{tempUnit}</span>
          </div>
          <p className="mt-1 text-sm text-white/80">{weatherDescription}</p>
        </div>
        <span className="text-5xl" role="img" aria-label={weatherDescription}>
          {icon}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex gap-6 px-6 pb-4">
        {humidity !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-white/60">Humidity</span>
            <span className="text-sm font-semibold text-white">{humidity}%</span>
          </div>
        )}
        {windspeed !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-white/60">Wind</span>
            <span className="text-sm font-semibold text-white">
              {windspeed} {windspeedUnit}
            </span>
          </div>
        )}
      </div>

      {/* 7-day forecast chart */}
      {temps.length > 0 && (
        <div className="mx-6 mb-6 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
          <p className="mb-3 text-xs font-medium text-white/60 uppercase tracking-wider">
            7-Day Forecast
          </p>
          <div className="flex items-end gap-2">
            {temps.map((temp, i) => {
              const height = ((temp - minTemp) / tempRange) * 64 + 16;
              const isToday = i === todayIndex;
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  {/* Temperature label */}
                  <span className="text-[10px] font-semibold text-white/80">
                    {Math.round(temp)}°
                  </span>
                  {/* Bar */}
                  <div
                    className={cn(
                      "w-full rounded-md transition-all",
                      isToday
                        ? "bg-gradient-to-t from-amber-400 to-amber-300 shadow-lg shadow-amber-400/30"
                        : "bg-white/30",
                    )}
                    style={{ height: `${height}px` }}
                  />
                  {/* Day label */}
                  <span
                    className={cn(
                      "text-[10px] font-medium leading-none",
                      isToday ? "text-amber-300" : "text-white/60",
                    )}
                  >
                    {days[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
