"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "./LanguageProvider";
import { Search, LayoutGrid, List, Activity, Plus } from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: "grid" | "table";
  setViewMode: (mode: "grid" | "table") => void;
  isConnected: boolean;
  onOpenAddModal: () => void;
}

export function Navbar({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  isConnected,
  onOpenAddModal,
}: NavbarProps) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-blue-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-500 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-lg sm:text-xl text-foreground flex items-center gap-1.5">
              COIN<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500">VISUALIZER</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase -mt-1 hidden sm:inline-block">
              {t("brandSubtitle")}
            </span>
          </div>
        </Link>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
          {/* Search input */}
          <div className="relative max-w-xs w-full hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm rounded-xl border border-border/80 bg-card/60 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-card transition-all"
            />
          </div>

          {/* Connection status badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-card text-xs font-mono text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isConnected ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isConnected ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
            </span>
            <span>{isConnected ? t("wsLive") : t("wsConnecting")}</span>
          </div>

          {/* View toggle switch */}
          <div className="flex items-center p-1 rounded-xl border border-border/80 bg-card/80 text-muted-foreground">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:text-foreground"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "table"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:text-foreground"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Cryptos Modal trigger */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t("manageCoins")}</span>
          </button>

          {/* Language Selector Toggle */}
          <LanguageToggle />

          {/* Dark / Light Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Search bar */}
      <div className="px-4 py-2 border-t border-border/40 md:hidden bg-card/40">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("searchMobilePlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm rounded-xl border border-border/80 bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>
    </header>
  );
}
