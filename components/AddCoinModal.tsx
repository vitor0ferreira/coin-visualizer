"use client";

import { CRYPTO_LIST, getCoinLogo } from "@/lib/cryptoData";
import { useLanguage } from "./LanguageProvider";
import { X, Check, RotateCcw } from "lucide-react";
import Image from "next/image";

interface AddCoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCoinIds: string[];
  onToggleCoin: (id: string) => void;
  onResetCoins: () => void;
  onSelectAll: () => void;
}

export function AddCoinModal({
  isOpen,
  onClose,
  activeCoinIds,
  onToggleCoin,
  onResetCoins,
  onSelectAll,
}: AddCoinModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel border border-border/80 bg-background/95 p-6 shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">{t("manageTitle")}</h2>
            <p className="text-xs text-muted-foreground">
              {t("manageDesc")} ({activeCoinIds.length}/{CRYPTO_LIST.length} {t("active")}).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex gap-2">
            <button
              onClick={onSelectAll}
              className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent text-foreground font-medium transition-colors"
            >
              {t("selectAll")}
            </button>
            <button
              onClick={onResetCoins}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent text-foreground font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t("resetDefaults")}
            </button>
          </div>
        </div>

        {/* Cryptos Grid List */}
        <div className="overflow-y-auto flex-1 pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {CRYPTO_LIST.map((crypto) => {
            const isActive = activeCoinIds.includes(crypto.id);

            return (
              <div
                key={crypto.id}
                onClick={() => onToggleCoin(crypto.id)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? "border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-sm"
                    : "border-border/60 bg-card/40 opacity-60 hover:opacity-100 hover:border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-muted/40 p-1 flex items-center justify-center border border-border/40 shrink-0">
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
                    <div className="font-bold text-sm text-foreground">{crypto.name}</div>
                    <div className="font-mono text-xs text-muted-foreground uppercase">
                      {crypto.symbol}
                    </div>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-emerald-500 text-white"
                      : "border border-border/80 bg-background"
                  }`}
                >
                  {isActive && <Check className="w-4 h-4" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 font-semibold text-xs rounded-xl bg-primary text-primary-foreground hover:opacity-90 shadow-md transition-all"
          >
            {t("saveAndDone")}
          </button>
        </div>
      </div>
    </div>
  );
}
