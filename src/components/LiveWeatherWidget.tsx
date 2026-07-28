"use client";

import React, { useState, useEffect } from "react";

export function LiveWeatherWidget() {
  const [tempC, setTempC] = useState<number>(29);
  const [tempF, setTempF] = useState<number>(84);
  const [uvIndex, setUvIndex] = useState<number>(8);
  const [windSpeed, setWindSpeed] = useState<number>(12);
  const [condition, setCondition] = useState<string>("Tropical Sunshine");
  const [sunsetFormatted, setSunsetFormatted] = useState<string>("6:18 PM");
  const [timeToSunset, setTimeToSunset] = useState<string>("2h 45m");
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    // Fetch live weather data for Male, Maldives (Lat: 4.1755, Lon: 73.5093) from Open-Meteo
    const fetchLiveWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=4.1755&longitude=73.5093&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,uv_index&daily=sunset&timezone=auto"
        );
        const data = await res.json();
        if (data && data.current) {
          const c = Math.round(data.current.temperature_2m);
          const f = Math.round((c * 9) / 5 + 32);
          setTempC(c);
          setTempF(f);
          setWindSpeed(Math.round(data.current.wind_speed_10m));
          if (data.current.uv_index !== undefined) {
            setUvIndex(Math.round(data.current.uv_index));
          }

          // Weather Code Interpretation
          const code = data.current.weather_code;
          if (code === 0) setCondition("Clear Skies & Sunny");
          else if (code <= 3) setCondition("Partly Cloudy & Warm");
          else if (code >= 51) setCondition("Tropical Passing Rain");
          else setCondition("Mostly Sunny & Breeze");

          if (data.daily?.sunset?.[0]) {
            const sunsetDate = new Date(data.daily.sunset[0]);
            setSunsetFormatted(
              sunsetDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            );
          }

          setIsLive(true);
        }
      } catch (err) {
        console.warn("Live weather API fallback:", err);
      }
    };

    fetchLiveWeather();
    const weatherInterval = setInterval(fetchLiveWeather, 300000); // refresh every 5 mins

    // Countdown Timer to Sunset
    const timerInterval = setInterval(() => {
      const now = new Date();
      const sunset = new Date();
      sunset.setHours(18, 18, 0);
      const diffMs = sunset.getTime() - now.getTime();
      if (diffMs > 0) {
        const hrs = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        setTimeToSunset(`${hrs}h ${mins}m`);
      } else {
        setTimeToSunset("Golden Hour");
      }
    }, 60000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(timerInterval);
    };
  }, []);

  return (
    <div className="bg-white/85 dark:bg-[#1d1b20]/85 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-2xl p-4 aura-shadow max-w-4xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 text-[#1d1b20] dark:text-white shadow-lg">
      {/* Location & Live Temp */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#e9ddff] text-[#4f378a] flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-2xl">sunny</span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm text-[#4f378a]">Maldives Lagoon</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isLive ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
              }`}
              title={isLive ? "Live API Feed Active" : "Connecting..."}
            />
            {isLive && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded uppercase">
                LIVE
              </span>
            )}
          </div>
          <span className="text-base font-extrabold block leading-tight">
            {tempC}°C / {tempF}°F
          </span>
          <span className="text-[11px] text-gray-500 font-medium">
            {condition} • Wind {windSpeed} km/h
          </span>
        </div>
      </div>

      <div className="h-8 w-[1px] bg-[#cbc4d2]/40 hidden md:block" />

      {/* Ocean Temp & Scuba Visibility */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">waves</span>
        </div>
        <div>
          <span className="text-[11px] text-gray-500 font-semibold block">Ocean Water</span>
          <span className="text-xs font-bold text-[#1d1b20]">28°C (82°F)</span>
          <span className="text-[10px] text-emerald-600 font-bold block">Visibility: 25m (Crystal Clear)</span>
        </div>
      </div>

      <div className="h-8 w-[1px] bg-[#cbc4d2]/40 hidden md:block" />

      {/* Live UV Index */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">wb_sunny</span>
        </div>
        <div>
          <span className="text-[11px] text-gray-500 font-semibold block">UV Index</span>
          <span className="text-xs font-bold text-amber-600">UV {uvIndex} ({uvIndex > 6 ? "High Risk" : "Moderate"})</span>
          <span className="text-[10px] text-gray-400 font-medium block">SPF 50 Recommended</span>
        </div>
      </div>

      <div className="h-8 w-[1px] bg-[#cbc4d2]/40 hidden md:block" />

      {/* Sunset Timer */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">wb_twilight</span>
        </div>
        <div>
          <span className="text-[11px] text-gray-500 font-semibold block">Sunset</span>
          <span className="text-xs font-bold text-[#4f378a]">{timeToSunset} until {sunsetFormatted}</span>
          <span className="text-[10px] text-purple-600 font-bold block">Best Spot: Sunset Pavilion</span>
        </div>
      </div>
    </div>
  );
}

export default LiveWeatherWidget;
