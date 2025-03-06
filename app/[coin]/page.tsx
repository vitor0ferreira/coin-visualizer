"use client";

import { useParams } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import { TiArrowBack } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";
import Chart from "@/components/Chart/Chart";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoinPage() {
  const { coin: coin } = useParams();

  const [coinLastPrice, setCoinLastPrice] = useState<number>(0);
  const [coinCurrentPrice, setCoinCurrentPrice] = useState<number>(0);
  const lastUpdateRef = useRef<number>(0);

  const coinsList: Record<string, string> = {
    bitcoin: "btcusdt",
    ethereum: "ethusdt",
    dogecoin: "dogeusdt",
    ripple: "xrpusdt",
    solana: "solusdt",
    litecoin: "ltcusdt",
  };


  useEffect(() => {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${coinsList[coin?.toLocaleString()!]}@trade`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p);
      const newTimestamp = data.T;

      if (newTimestamp - lastUpdateRef.current >= 1000) {
        setCoinCurrentPrice((previousPrice) => {
          setCoinLastPrice(previousPrice);
          return price;
        });
        lastUpdateRef.current = newTimestamp;
      }
    };

    return () => {
      ws.close();
    };
  }, [coin]);

  const priceChangeColor =
    coinLastPrice !== 0 && coinCurrentPrice !== 0
      ? coinCurrentPrice > coinLastPrice
        ? "text-green-600"
        : "text-red-500"
      : "text-black";

  return (
    <main className="w-full min-h-screen h-full p-4 flex flex-col gap-4 items-center justify-center">
      <header className="flex gap-6 items-center">
        <Link
          href={"/"}
          className="size-12 rounded-lg bg-gradient-to-b from-[#2e466e] from-5% to-[#415989] to-100% hover:from-[#415989] hover:to-[#2e466e] shadow-md flex justify-center items-center"
        >
          <TiArrowBack size={50} color="#fff" />
        </Link>
        <Image
          src={`/coins-icons/${coin}.png`}
          width={150}
          height={150}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={`${coin} logo`}
          priority
          className="drop-shadow-lg"
        ></Image>
        <span className="text-4xl md:text-8xl text-slate-900 font-bold italic">
          {coin?.toString().toLocaleUpperCase()}
        </span>
      </header>

      {coinCurrentPrice == 0 ? (
        <Skeleton className="h-[5rem] aspect-[17/3]" />
      ) : (
        <span
          id="price"
          className="font-bold text-4xl bg-slate-200 p-4 rounded-lg shadow-md"
        >
          Price: USDT
          <span className={`${priceChangeColor} text-5xl`}>
            &nbsp;{coinCurrentPrice.toPrecision(7)}
          </span>
        </span>
      )}

      <section className="w-[80%] min-w-[280px] max-w-[1440px] min-h-fit p-4 rounded-2xl overflow-hidden bg-slate-200 shadow-[0_5px_10px_5px_rgba(0,0,0,0.15)]">
        <Chart
          symbol={coinsList[
            coin?.toLocaleString() ? coin?.toLocaleString() : "btcusdt"
          ].toLocaleUpperCase()}
        />
      </section>
    </main>
  );
}
