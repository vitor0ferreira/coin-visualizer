"use client";

import { useLanguage } from "./LanguageProvider";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "pt" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative p-2 rounded-xl border border-border/80 bg-card hover:bg-accent text-foreground transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 flex items-center gap-1.5 group"
      aria-label={t("selectLanguage")}
      title={t("selectLanguage")}
    >
      <Globe className="w-4 h-4 text-cyan-500 group-hover:rotate-45 transition-transform duration-300" />
      <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
        {language === "en" ? "EN" : "PT"}
      </span>
    </button>
  );
}
