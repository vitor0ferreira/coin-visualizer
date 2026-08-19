"use client";

import Link from "next/link";
import Image from "next/image";
import { CryptoCurrency, getCoinLogo } from "@/lib/cryptoData";
import { TickerData, TickerMap } from "@/lib/useBinanceWebSocket";
import { useLanguage } from "@/components/LanguageProvider";
import { TrendingUp, TrendingDown, Star, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface CryptoTableViewProps {
  cryptos: CryptoCurrency[];
  tickers: TickerMap;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function CryptoTableView({
  cryptos,
  tickers,
  favorites,
  onToggleFavorite,
}: CryptoTableViewProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full overflow-x-auto rounded-2xl glass-panel border border-border/60">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-border/60 text-[11px] font-mono uppercase tracking-wider text-muted-foreground bg-muted/20">
            <th className="py-3.5 px-4 text-center w-12">#</th>
            <th className="py-3.5 px-4">{t("asset")}</th>
            <th className="py-3.5 px-4 text-right">{t("priceUsdt")}</th>
            <th className="py-3.5 px-4 text-right">{t("sortChange")}</th>
            <th className="py-3.5 px-4 text-center hidden md:table-cell">{t("range24h")}</th>
            <th className="py-3.5 px-4 text-right hidden lg:table-cell">{t("volume24h")}</th>
            <th className="py-3.5 px-4 text-center w-24">{t("action")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40 text-sm">
          {cryptos.map((crypto) => {
            const ticker = tickers[crypto.binanceSymbol.toLowerCase()];
            const isFavorite = favorites.includes(crypto.id);

            return (
              <TableRow
                key={crypto.id}
                crypto={crypto}
                ticker={ticker}
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({
  crypto,
  ticker,
  isFavorite,
  onToggleFavorite,
}: {
  crypto: CryptoCurrency;
  ticker?: TickerData;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  const { t } = useLanguage();
  const [flashClass, setFlashClass] = useState<string>("");

  const priceDirection = ticker?.priceDirection;
  const lastUpdated = ticker?.lastUpdated;

  useEffect(() => {
    if (!priceDirection || priceDirection === "neutral") return;

    const flash = priceDirection === "up" ? "tick-flash-up" : "tick-flash-down";
    setFlashClass(flash);

    const timer = setTimeout(() => {
      setFlashClass("");
    }, 750);

    return () => clearTimeout(timer);
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
    <tr className="hover:bg-accent/40 transition-colors group">
      {/* Rank & Favorite */}
      <td className="py-4 px-4 text-center font-mono text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={() => onToggleFavorite(crypto.id)}
            className={`transition-colors ${
              isFavorite
                ? "text-amber-400 fill-amber-400"
                : "text-muted-foreground/30 hover:text-amber-400"
            }`}
          >
            <Star className="w-3.5 h-3.5" fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <span>{crypto.rank}</span>
        </div>
      </td>

      {/* Asset Logo & Name */}
      <td className="py-4 px-4">
        <Link href={`/${crypto.id}`} className="flex items-center gap-3 group-hover:text-cyan-500 transition-colors">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-muted/40 p-1 flex items-center justify-center shrink-0 border border-border/40">
            <Image
              src={getCoinLogo(crypto.id)}
              alt={`${crypto.name} logo`}
              width={28}
              height={28}
              className="object-contain"
              unoptimized
            />
          </div>
          <div>
            <div className="font-bold text-foreground group-hover:text-cyan-500 transition-colors">
              {crypto.name}
            </div>
            <span className="font-mono text-xs text-muted-foreground uppercase">
              {crypto.symbol}
            </span>
          </div>
        </Link>
      </td>

      {/* Price */}
      <td className={`py-4 px-4 text-right font-mono font-bold text-foreground transition-all duration-300 ${flashClass}`}>
        {ticker ? `$${formattedPrice}` : <span className="text-muted-foreground font-normal animate-pulse">{t("fetching")}</span>}
      </td>

      {/* 24h Change */}
      <td className="py-4 px-4 text-right font-mono font-semibold">
        <div
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs ${
            isPositive
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-rose-500/10 text-rose-500"
          }`}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>
            {isPositive ? "+" : ""}
            {change24h.toFixed(2)}%
          </span>
        </div>
      </td>

      {/* 24h Range L / H */}
      <td className="py-4 px-4 text-center font-mono text-xs text-muted-foreground hidden md:table-cell">
        {ticker && ticker.high24h > 0 ? (
          <div className="space-y-1 max-w-[140px] mx-auto">
            <div className="flex justify-between text-[10px]">
              <span>${ticker.low24h.toLocaleString("en-US")}</span>
              <span>${ticker.high24h.toLocaleString("en-US")}</span>
            </div>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full"
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
        ) : (
          "---"
        )}
      </td>

      {/* 24h Volume */}
      <td className="py-4 px-4 text-right font-mono text-xs font-medium text-foreground hidden lg:table-cell">
        {formattedVolume}
      </td>

      {/* Action */}
      <td className="py-4 px-4 text-center">
        <Link
          href={`/${crypto.id}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-card hover:bg-primary hover:text-primary-foreground border border-border transition-all"
        >
          <span>{t("view")}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </td>
    </tr>
  );
}
