"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { CRYPTO_LIST } from "./cryptoData";

export interface TickerData {
  symbol: string; // e.g. "BTCUSDT"
  price: number;
  change24h: number;
  percent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  priceDirection: "up" | "down" | "neutral";
  lastUpdated: number;
}

export type TickerMap = Record<string, TickerData>; // keyed by lowercase binanceSymbol e.g. "btcusdt"

interface Binance24hrTickerItem {
  symbol: string;
  lastPrice?: string;
  c?: string;
  priceChange?: string;
  p?: string;
  priceChangePercent?: string;
  P?: string;
  highPrice?: string;
  h?: string;
  lowPrice?: string;
  l?: string;
  quoteVolume?: string;
  q?: string;
}

export function useBinanceWebSocket(symbols?: string[]) {
  const [tickers, setTickers] = useState<TickerMap>({});
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<boolean>(false);

  const prevPricesRef = useRef<Record<string, number>>({});
  const pendingUpdatesRef = useRef<TickerMap>({});
  const animationFrameRef = useRef<number | null>(null);

  const targetSymbols = symbols || CRYPTO_LIST.map((c) => c.binanceSymbol);
  const targetSymbolsKey = targetSymbols.map((s) => s.toLowerCase()).join(",");

  const flushUpdates = useCallback(() => {
    if (Object.keys(pendingUpdatesRef.current).length > 0) {
      setTickers((prev) => ({
        ...prev,
        ...pendingUpdatesRef.current,
      }));
      pendingUpdatesRef.current = {};
    }
    animationFrameRef.current = null;
  }, []);

  // 1. Initial REST Snapshot to populate all prices immediately without waiting for first WS tick
  useEffect(() => {
    let isMounted = true;
    const symbolSet = new Set(targetSymbols.map((s) => s.toLowerCase()));

    const fetchInitialSnapshot = async () => {
      try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
        if (!res.ok) return;
        const data = await res.json();

        if (Array.isArray(data) && isMounted) {
          const snapshotMap: TickerMap = {};

          data.forEach((item: Binance24hrTickerItem) => {
            const symLower = item.symbol.toLowerCase();
            if (symbolSet.has(symLower)) {
              const price = parseFloat(item.lastPrice || item.c || "0");
              prevPricesRef.current[symLower] = price;

              snapshotMap[symLower] = {
                symbol: item.symbol,
                price: price,
                change24h: parseFloat(item.priceChange || item.p || "0"),
                percent24h: parseFloat(item.priceChangePercent || item.P || "0"),
                high24h: parseFloat(item.highPrice || item.h || "0"),
                low24h: parseFloat(item.lowPrice || item.l || "0"),
                volume24h: parseFloat(item.quoteVolume || item.q || "0"),
                priceDirection: "neutral",
                lastUpdated: Date.now(),
              };
            }
          });

          setTickers((prev) => ({
            ...snapshotMap,
            ...prev,
          }));
        }
      } catch (err) {
        console.error("Error fetching initial Binance 24hr ticker snapshot:", err);
      }
    };

    fetchInitialSnapshot();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetSymbolsKey]);

  // 2. Real-Time Binance WebSocket Streaming
  useEffect(() => {
    if (!targetSymbols || targetSymbols.length === 0) return;

    const streamList = targetSymbols.map((s) => `${s.toLowerCase()}@ticker`).join("/");
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streamList}`;

    let socket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          setIsConnected(true);
          setConnectionError(false);
        };

        socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (!message || !message.data) return;

            const data = message.data;
            const symbol = data.s.toLowerCase();
            const currentPrice = parseFloat(data.c);
            const prevPrice = prevPricesRef.current[symbol] || currentPrice;

            let direction: "up" | "down" | "neutral" = "neutral";
            if (currentPrice > prevPrice) {
              direction = "up";
            } else if (currentPrice < prevPrice) {
              direction = "down";
            }

            prevPricesRef.current[symbol] = currentPrice;

            const tickerUpdate: TickerData = {
              symbol: data.s,
              price: currentPrice,
              change24h: parseFloat(data.p),
              percent24h: parseFloat(data.P),
              high24h: parseFloat(data.h),
              low24h: parseFloat(data.l),
              volume24h: parseFloat(data.q),
              priceDirection: direction,
              lastUpdated: Date.now(),
            };

            pendingUpdatesRef.current[symbol] = tickerUpdate;

            if (!animationFrameRef.current) {
              animationFrameRef.current = requestAnimationFrame(flushUpdates);
            }
          } catch (e) {
            console.error("Error parsing Binance ws message", e);
          }
        };

        socket.onerror = (err) => {
          console.error("Binance WebSocket error", err);
          setConnectionError(true);
        };

        socket.onclose = () => {
          setIsConnected(false);
          reconnectTimeout = setTimeout(connect, 3000);
        };
      } catch (e) {
        console.error("Binance WebSocket connection error", e);
        setConnectionError(true);
      }
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (socket) {
        socket.onclose = null;
        socket.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetSymbolsKey, flushUpdates]);

  return { tickers, isConnected, connectionError };
}
