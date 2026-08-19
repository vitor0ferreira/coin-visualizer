"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/LanguageProvider";

interface ChartProps {
  symbol: string; // e.g. "BTCUSDT"
  color?: string;
}

export type Timeframe = "1H" | "24H" | "7D" | "30D";

export type CandleData = [
  klineOpenTime: number,
  openPrice: string,
  highPrice: string,
  lowPrice: string,
  closePrice: string,
  volume: string,
  klineCloseTime: number,
  quoteAssetVolume: string,
  numberOfTrades: number,
  takerBuyBaseAssetVolume: string,
  takerBuyQuoteAssetVolume: string,
  unusedField_ignore: string
];

export default function Chart({ symbol, color = "#10b981" }: ChartProps) {
  const { t } = useLanguage();
  const [data, setData] = useState<{ time: string; price: number; rawTime: number }[]>([]);
  const [timeframe, setTimeframe] = useState<Timeframe>("24H");
  const [loading, setLoading] = useState<boolean>(true);
  const { theme } = useTheme();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        let interval = "1h";
        let limit = 24;

        if (timeframe === "1H") {
          interval = "1m";
          limit = 60;
        } else if (timeframe === "24H") {
          interval = "1h";
          limit = 24;
        } else if (timeframe === "7D") {
          interval = "4h";
          limit = 42;
        } else if (timeframe === "30D") {
          interval = "1d";
          limit = 30;
        }

        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
        );
        const jsonData = await res.json();

        if (Array.isArray(jsonData) && isMounted) {
          const formatted = jsonData.map((entry: CandleData) => {
            const dateObj = new Date(entry[0]);
            let timeStr = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            if (timeframe === "7D" || timeframe === "30D") {
              timeStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()} ${dateObj.getHours()}:00`;
            }

            return {
              time: timeStr,
              price: parseFloat(entry[4]),
              rawTime: entry[0],
            };
          });

          setData(formatted);
        }
      } catch (err) {
        console.error("Error fetching klines", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    // Refresh chart data periodically
    const refreshMs = timeframe === "1H" ? 10000 : 30000;
    const intervalId = setInterval(fetchData, refreshMs);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [symbol, timeframe]);

  // Determine line gain/loss color
  const isGain = data.length > 1 ? data[data.length - 1].price >= data[0].price : true;
  const strokeColor = color || (isGain ? "#10b981" : "#ef4444");
  const gradientId = `chartGradient-${symbol}-${timeframe}`;

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      {/* Timeframe Controls */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {t("priceHistory")} ({timeframe})
        </span>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-card border border-border/80 text-xs">
          {(["1H", "24H", "7D", "30D"] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg font-mono font-semibold transition-all ${
                timeframe === tf
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div className="w-full flex-1 min-h-[360px] relative">
        {loading && data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10 rounded-2xl">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono">{t("loadingChartData")}</span>
            </div>
          </div>
        ) : null}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
            />

            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: theme === "dark" ? "#94a3b8" : "#64748b" }}
              dy={5}
            />

            <YAxis
              domain={["auto", "auto"]}
              tickLine={false}
              axisLine={false}
              orientation="right"
              tick={{ fontSize: 11, fill: theme === "dark" ? "#94a3b8" : "#64748b" }}
              tickFormatter={(val) =>
                val >= 1000
                  ? `$${(val / 1000).toFixed(1)}k`
                  : val >= 1
                  ? `$${val.toFixed(2)}`
                  : `$${val.toFixed(4)}`
              }
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="rounded-xl glass-panel border border-border p-3 shadow-xl text-xs space-y-1 font-mono">
                      <div className="text-muted-foreground">{dataPoint.time}</div>
                      <div className="font-bold text-base text-foreground">
                        ${dataPoint.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
