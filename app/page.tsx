"use client";

import { useState, useEffect, useMemo } from "react";
import { CRYPTO_LIST, CryptoCurrency } from "@/lib/cryptoData";
import { useBinanceWebSocket } from "@/lib/useBinanceWebSocket";
import { useLanguage } from "@/components/LanguageProvider";
import { Navbar } from "@/components/Navbar";
import { CryptoGridCard } from "@/components/CryptoGridCard";
import { CryptoTableView } from "@/components/CryptoTableView";
import { AddCoinModal } from "@/components/AddCoinModal";
import { TrendingUp, TrendingDown, Layers, Sparkles, Filter, ArrowUpDown } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();
  const [activeCoinIds, setActiveCoinIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"rank" | "price" | "change" | "volume" | "name">("rank");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Load state from localStorage on client side
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        const savedCoins = localStorage.getItem("coin_visualizer_active_coins");
        if (savedCoins) {
          try {
            setActiveCoinIds(JSON.parse(savedCoins));
          } catch {
            setActiveCoinIds(CRYPTO_LIST.map((c) => c.id));
          }
        } else {
          setActiveCoinIds(CRYPTO_LIST.map((c) => c.id));
        }

        const savedFavs = localStorage.getItem("coin_visualizer_favorites");
        if (savedFavs) {
          try {
            setFavorites(JSON.parse(savedFavs));
          } catch {
            setFavorites(["bitcoin", "ethereum", "solana"]);
          }
        } else {
          setFavorites(["bitcoin", "ethereum", "solana"]);
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save active coins to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && activeCoinIds.length > 0) {
      localStorage.setItem("coin_visualizer_active_coins", JSON.stringify(activeCoinIds));
    }
  }, [activeCoinIds]);

  // Save favorites to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("coin_visualizer_favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const activeCryptos = useMemo(() => {
    return CRYPTO_LIST.filter((c) => activeCoinIds.includes(c.id));
  }, [activeCoinIds]);

  const activeBinanceSymbols = useMemo(() => {
    return activeCryptos.map((c) => c.binanceSymbol);
  }, [activeCryptos]);

  // Multiplexed WebSocket streaming
  const { tickers, isConnected } = useBinanceWebSocket(activeBinanceSymbols);

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle active coin
  const handleToggleCoin = (id: string) => {
    setActiveCoinIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter & Sort Cryptos
  const filteredAndSortedCryptos = useMemo(() => {
    let result = activeCryptos;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory === "favorites") {
      result = result.filter((c) => favorites.includes(c.id));
    } else if (selectedCategory !== "all") {
      result = result.filter((c) => c.category === selectedCategory);
    }

    // Sorting
    return result.sort((a, b) => {
      const tickerA = tickers[a.binanceSymbol.toLowerCase()];
      const tickerB = tickers[b.binanceSymbol.toLowerCase()];

      let valA: number | string = a.rank;
      let valB: number | string = b.rank;

      if (sortBy === "price") {
        valA = tickerA?.price ?? 0;
        valB = tickerB?.price ?? 0;
      } else if (sortBy === "change") {
        valA = tickerA?.percent24h ?? 0;
        valB = tickerB?.percent24h ?? 0;
      } else if (sortBy === "volume") {
        valA = tickerA?.volume24h ?? 0;
        valB = tickerB?.volume24h ?? 0;
      } else if (sortBy === "name") {
        valA = a.name;
        valB = b.name;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [activeCryptos, searchQuery, selectedCategory, sortBy, sortOrder, tickers, favorites]);

  // Market stats highlights
  const topGainer = useMemo<{ crypto: CryptoCurrency; percent: number } | null>(() => {
    let best: { crypto: CryptoCurrency; percent: number } | null = null;
    activeCryptos.forEach((c) => {
      const ticker = tickers[c.binanceSymbol.toLowerCase()];
      if (ticker && (best === null || ticker.percent24h > best.percent)) {
        best = { crypto: c, percent: ticker.percent24h };
      }
    });
    return best;
  }, [activeCryptos, tickers]);

  const topLoser = useMemo<{ crypto: CryptoCurrency; percent: number } | null>(() => {
    let worst: { crypto: CryptoCurrency; percent: number } | null = null;
    activeCryptos.forEach((c) => {
      const ticker = tickers[c.binanceSymbol.toLowerCase()];
      if (ticker && (worst === null || ticker.percent24h < worst.percent)) {
        worst = { crypto: c, percent: ticker.percent24h };
      }
    });
    return worst;
  }, [activeCryptos, tickers]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isConnected={isConnected}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Market Banner */}
        <section className="relative rounded-3xl glass-panel p-6 md:p-8 overflow-hidden border border-border/80 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Title & Headline */}
            <div className="lg:col-span-2 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t("heroBadge")}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                {t("heroTitle")}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
                  {t("heroGradient")}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
                {t("heroDesc")}
              </p>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-sm">
                <div className="text-[11px] font-mono text-muted-foreground mb-1">
                  {t("topGainer")}
                </div>
                {topGainer ? (
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">
                      {topGainer.crypto.symbol}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-500 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />+
                      {topGainer.percent.toFixed(2)}%
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">{t("syncing")}</span>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-sm">
                <div className="text-[11px] font-mono text-muted-foreground mb-1">
                  {t("topMover")}
                </div>
                {topLoser ? (
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">
                      {topLoser.crypto.symbol}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold flex items-center gap-0.5 ${
                        topLoser.percent >= 0 ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {topLoser.percent >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {topLoser.percent.toFixed(2)}%
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">{t("syncing")}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Filter Tags & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-border/60 pb-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0 mr-1" />
            {[
              { id: "all", label: t("allCoins") },
              { id: "favorites", label: `${t("favorites")} (${favorites.length})` },
              { id: "layer1", label: t("layer1") },
              { id: "defi", label: t("defi") },
              { id: "meme", label: t("memes") },
              { id: "infrastructure", label: t("infra") },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{t("sortBy")}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "rank" | "price" | "change" | "volume" | "name")}
              className="bg-card border border-border/80 rounded-xl px-2.5 py-1 text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-primary/40"
            >
              <option value="rank">{t("sortRank")}</option>
              <option value="price">{t("sortPrice")}</option>
              <option value="change">{t("sortChange")}</option>
              <option value="volume">{t("sortVolume")}</option>
              <option value="name">{t("sortName")}</option>
            </select>
            <button
              onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
              className="p-1 rounded-lg border border-border/80 bg-card hover:bg-accent font-mono text-[10px] uppercase font-bold"
              title="Toggle sort direction"
            >
              {sortOrder}
            </button>
          </div>
        </div>

        {/* Catalog Showcase (Grid or Table View) */}
        {filteredAndSortedCryptos.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-2xl border border-dashed border-border/80 bg-card/20">
            <Layers className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <h3 className="text-lg font-bold text-foreground">{t("noCryptosFound")}</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {t("noCryptosDesc")}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredAndSortedCryptos.map((crypto) => (
              <CryptoGridCard
                key={crypto.id}
                crypto={crypto}
                ticker={tickers[crypto.binanceSymbol.toLowerCase()]}
                isFavorite={favorites.includes(crypto.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <CryptoTableView
            cryptos={filteredAndSortedCryptos}
            tickers={tickers}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground bg-card/20 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            {t("footerText")}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="hover:text-foreground transition-colors"
            >
              {t("manageCoins")} ({activeCoinIds.length}/20)
            </button>
          </div>
        </div>
      </footer>

      {/* Manage Coins Modal */}
      <AddCoinModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        activeCoinIds={activeCoinIds}
        onToggleCoin={handleToggleCoin}
        onResetCoins={() => setActiveCoinIds(CRYPTO_LIST.map((c) => c.id))}
        onSelectAll={() => setActiveCoinIds(CRYPTO_LIST.map((c) => c.id))}
      />
    </div>
  );
}