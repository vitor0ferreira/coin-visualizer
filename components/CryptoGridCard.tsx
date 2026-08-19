"use client";

import Link from "next/link";
import Image from "next/image";
import { CryptoCurrency, getCoinLogo } from "@/lib/cryptoData";
import { TickerData } from "@/lib/useBinanceWebSocket";
import { useLanguage } from "@/components/LanguageProvider";
import { TrendingUp, TrendingDown, ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface CryptoGridCardProps {
  crypto: CryptoCurrency;
  ticker?: TickerData;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function CryptoGridCard({
  crypto,
  ticker,
  isFavorite,
  onToggleFavorite,
}: CryptoGridCardProps) {
  const { t } = useLanguage();
  const [flashClass, setFlashClass] = useState<string>("");

  const priceDirection = ticker?.priceDirection;
  const lastUpdated = ticker?.lastUpdated;

  useEffect(() => {
    if (!priceDirection || priceDirection === "neutral") return;

    const flash = priceDirection === "up" ? "tick-flash-up" : "tick-flash-down";
    const flashTimer = setTimeout(() => {
      setFlashClass(flash);
    }, 0);

    const resetTimer = setTimeout(() => {
      setFlashClass("");
    }, 750);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(resetTimer);
    };
  }, [lastUpdated, priceDirection]);

  const price = ticker?.price ?? 0;
  const change24h = ticker?.percent24h ?? 0;
  const isPositive = change24h >= 0;

  const formattedPrice =
    price >= 1
      ? price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });

  const formattedVolume = ticker?.volume24h
    ? ticker.volume24h >= 1e9
      ? `$${(ticker.volume24h / 1e9).toFixed(2)}B`
      : `$${(ticker.volume24h / 1e6).toFixed(2)}M`
    : "---";

  return (
    <div className="group relative rounded-2xl glass-panel p-5 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none group-hover:opacity-25 transition-opacity"
        style={{ backgroundColor: crypto.color }}
      />

      {/* Header Row: Rank, Logo, Symbol, Favorite */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-muted/30 p-1 flex items-center justify-center shrink-0 border border-border/40">
              <Image
                src={getCoinLogo(crypto.id)}
                alt={`${crypto.name} logo`}
                width={36}
                height={36}
                className="object-contain"
                unoptimized
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-foreground leading-tight group-hover:text-cyan-500 transition-colors">
                  {crypto.name}
                </h3>
                <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase px-1.5 py-0.5 rounded bg-muted/60">
                  #{crypto.rank}
                </span>
              </div>
              <span className="font-mono text-xs text-muted-foreground uppercase">
                {crypto.symbol}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(crypto.id);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              isFavorite
                ? "text-amber-400 fill-amber-400 bg-amber-400/10"
                : "text-muted-foreground/40 hover:text-amber-400 hover:bg-muted/50"
            }`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Real-Time Live Price */}
        <div className={`p-2.5 rounded-xl transition-all duration-300 mb-4 ${flashClass}`}>
          <span className="text-[11px] font-medium text-muted-foreground block mb-0.5">
            {t("priceUsdt")}
          </span>
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-mono font-extrabold text-2xl tracking-tight text-foreground">
              {ticker ? `$${formattedPrice}` : <span className="animate-pulse">{t("fetching")}</span>}
            </span>

            {/* 24h Change percentage badge */}
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg font-mono ${
                isPositive
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {change24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* 24h High & Low range stats bar */}
        {ticker && ticker.high24h > 0 && (
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
              <span>L: ${ticker.low24h.toLocaleString("en-US")}</span>
              <span>H: ${ticker.high24h.toLocaleString("en-US")}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted/60 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      5,
                      ((ticker.price - ticker.low24h) /
                        (ticker.high24h - ticker.low24h || 1)) *
                        100
                    )
                  )}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Detail Link */}
      <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <div>
          <span className="text-[10px] block">{t("volume24h")}</span>
          <span className="font-mono font-semibold text-foreground">{formattedVolume}</span>
        </div>

        <Link
          href={`/${crypto.id}`}
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-cyan-500 transition-colors group-hover:translate-x-1 duration-200"
        >
          <span>{t("chartAndStats")}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
