"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CRYPTO_LIST, getCoinLogo } from "@/lib/cryptoData";
import { useBinanceWebSocket } from "@/lib/useBinanceWebSocket";
import { useLanguage } from "@/components/LanguageProvider";
import Chart from "@/components/Chart/Chart";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  Calculator,
  ShieldCheck,
} from "lucide-react";

export default function CoinPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();

  const coinParam = (params?.coin as string)?.toLowerCase() || "";

  // Match coin from dataset by id, symbol, or binanceSymbol
  const crypto = useMemo(() => {
    return (
      CRYPTO_LIST.find((c) => c.id === coinParam) ||
      CRYPTO_LIST.find((c) => c.symbol.toLowerCase() === coinParam) ||
      CRYPTO_LIST.find((c) => c.binanceSymbol === coinParam) ||
      CRYPTO_LIST[0]
    );
  }, [coinParam]);

  // Connect single websocket for this coin
  const { tickers, isConnected } = useBinanceWebSocket([crypto.binanceSymbol.toLowerCase()]);
  const ticker = tickers[crypto.binanceSymbol.toLowerCase()];

  // Quick converter calculator state
  const [calcAmount, setCalcAmount] = useState<string>("1");
  const [calcDirection, setCalcDirection] = useState<"cryptoToUsdt" | "usdtToCrypto">(
    "cryptoToUsdt"
  );

  const price = ticker?.price ?? 0;
  const change24h = ticker?.percent24h ?? 0;
  const isPositive = change24h >= 0;

  const formattedPrice =
    price >= 1
      ? price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });

  // Calculation logic
  const calculatedResult = useMemo(() => {
    const inputVal = parseFloat(calcAmount) || 0;
    if (price === 0) return "0.00";

    if (calcDirection === "cryptoToUsdt") {
      return (inputVal * price).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      return (inputVal / price).toLocaleString("en-US", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      });
    }
  }, [calcAmount, calcDirection, price]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Detail Header / Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 bg-card hover:bg-accent text-foreground text-xs font-semibold transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{t("backToDashboard")}</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-card text-xs font-mono text-muted-foreground">
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <span>{t("wsLive")}</span>
            </div>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Detail Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Crypto Overview Banner */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-border/80 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Asset Identity */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-card p-2 flex items-center justify-center border border-border/60 shadow-lg shrink-0">
                <Image
                  src={getCoinLogo(crypto.id)}
                  alt={`${crypto.name} logo`}
                  width={56}
                  height={56}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-foreground">{crypto.name}</h1>
                  <span className="text-xs font-mono font-bold tracking-widest text-muted-foreground uppercase px-2 py-0.5 rounded-md bg-muted">
                    #{crypto.rank}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground mt-0.5">
                  <span className="uppercase font-bold">{crypto.symbol} / USDT</span>
                  <span>•</span>
                  <span className="capitalize">{crypto.category}</span>
                </div>
              </div>
            </div>

            {/* Live Price & Change % */}
            <div className="flex flex-col md:items-end">
              <span className="text-xs font-mono text-muted-foreground mb-1">
                {t("realTimeSpotPrice")}
              </span>
              <div className="flex items-baseline gap-3">
                <span className="font-mono font-black text-3xl sm:text-4xl text-foreground tracking-tight">
                  {ticker ? `$${formattedPrice}` : <span className="animate-pulse">{t("fetching")}</span>}
                </span>

                <div
                  className={`flex items-center gap-1 text-sm font-mono font-bold px-2.5 py-1 rounded-xl ${
                    isPositive
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/60 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-card/60 border border-border/60">
              <span className="text-muted-foreground block mb-1">{t("high24h")}</span>
              <span className="text-sm font-bold text-foreground">
                ${ticker?.high24h.toLocaleString("en-US") || "---"}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-card/60 border border-border/60">
              <span className="text-muted-foreground block mb-1">{t("low24h")}</span>
              <span className="text-sm font-bold text-foreground">
                ${ticker?.low24h.toLocaleString("en-US") || "---"}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-card/60 border border-border/60">
              <span className="text-muted-foreground block mb-1">{t("volume24h")}</span>
              <span className="text-sm font-bold text-foreground">
                {ticker?.volume24h
                  ? `$${(ticker.volume24h / 1e6).toFixed(2)}M`
                  : "---"}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-card/60 border border-border/60">
              <span className="text-muted-foreground block mb-1">{t("binanceStream")}</span>
              <span className="text-sm font-bold text-cyan-500 uppercase">
                {crypto.binanceSymbol}@trade
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid Layout: Interactive Chart & Sidebar Converter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Main Interactive Chart */}
          <div className="lg:col-span-2 rounded-3xl glass-panel p-6 border border-border/80 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
              <Activity className="w-4 h-4 text-cyan-500" />
              <span>{t("klineChartTitle")}</span>
            </div>

            <div className="h-[420px] w-full">
              <Chart symbol={crypto.binanceSymbol.toUpperCase()} color={crypto.color} />
            </div>
          </div>

          {/* Right Col: Converter & Info */}
          <div className="space-y-6">
            {/* Quick Currency Converter */}
            <div className="rounded-3xl glass-panel p-6 border border-border/80 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Calculator className="w-4 h-4 text-emerald-500" />
                <span>{t("instantConverter")}</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-muted-foreground block mb-1">
                    {calcDirection === "cryptoToUsdt" ? `${crypto.symbol} Amount` : "USDT Amount"}
                  </label>
                  <input
                    type="number"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-card font-mono text-base font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="1"
                    min="0"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() =>
                      setCalcDirection((d) =>
                        d === "cryptoToUsdt" ? "usdtToCrypto" : "cryptoToUsdt"
                      )
                    }
                    className="p-2 rounded-xl border border-border bg-accent hover:bg-card text-xs font-mono font-bold transition-all"
                  >
                    {t("switchDirection")}
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-card border border-border/60 space-y-1">
                  <span className="text-[11px] text-muted-foreground block">
                    {t("estimatedValue")} ({calcDirection === "cryptoToUsdt" ? "USDT" : crypto.symbol})
                  </span>
                  <div className="text-xl font-mono font-extrabold text-emerald-500">
                    {calcDirection === "cryptoToUsdt" ? `$${calculatedResult}` : calculatedResult}
                  </div>
                </div>
              </div>
            </div>

            {/* Asset Description Card */}
            <div className="rounded-3xl glass-panel p-6 border border-border/80 shadow-xl space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <span>{t("about")} {crypto.name}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {crypto.description}
              </p>
              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-muted-foreground font-mono">
                <span>{t("category")}</span>
                <span className="font-semibold text-foreground uppercase">{crypto.category}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground bg-card/20 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span>Coin Visualizer — {crypto.name} Analytics</span>
          <Link href="/" className="hover:text-foreground transition-colors font-medium">
            {t("returnToAllCoins")}
          </Link>
        </div>
      </footer>
    </div>
  );
}
