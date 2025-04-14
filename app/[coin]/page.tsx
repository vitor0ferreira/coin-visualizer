"use client";

import { useParams } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import { TiArrowBack } from "react-icons/ti";
import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "@/components/Chart/Chart";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoinPage() {
  const { coin: coin } = useParams()
  const coinUrl = coin as string;

  const [coinLastPrice, setCoinLastPrice] = useState<number>(0);
  const [coinCurrentPrice, setCoinCurrentPrice] = useState<number>(0);
  const lastUpdateRef = useRef<number>(0);


    const coinsList = useMemo<Record<string, string>>(
      () => ({
        bitcoin: "btcusdt",
        ethereum: "ethusdt",
        dogecoin: "dogeusdt",
        ripple: "xrpusdt",
        solana: "solusdt",
        litecoin: "ltcusdt",
        cardano: "adausdt",
        tron: "trxusdt",
        link: "linkusdt",
        polkadot: "dotusdt"
      }), []
    );


  useEffect(() => {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${coinsList[coinUrl]}@trade`
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
  }, [coinUrl, coinsList]);

  const priceChangeColor =
    coinLastPrice !== 0 && coinCurrentPrice !== 0
      ? coinCurrentPrice > coinLastPrice
        ? "text-green-600"
        : "text-red-500"
      : "text-black";

  return (
    <main className="w-full min-h-screen h-full mt-8 sm:mt-0 p-4 flex flex-col gap-4 items-center justify-center">
      <header className="flex gap-6 items-center justify-between">
        <Link
          href={"/"}
          className="size-8 sm:size-12 rounded-lg bg-gradient-to-b from-[#2e466e] from-5% to-[#415989] to-100% 
          hover:from-[#415989] hover:to-[#2e466e] shadow-md flex justify-center items-center"
        >
          <TiArrowBack size={50} color="#fff" />
        </Link>
        <div className="flex flex-col sm:flex-row max-w-[80%] items-center gap-4 justify-center">
          <Image
            src={`/coins-icons/${coin}.png`}
            width={150}
            height={150}
            sizes="(max-width: 768px) 10vw, (max-width: 1200px) 20vw, 15vw"
            alt={`${coin} logo`}
            priority
            className="drop-shadow-lg"
            style={{ maxWidth: "50%", height: "auto" }}
          ></Image>
          <span className="text-4xl sm:text-6xl md:text-8xl text-slate-900 font-bold italic">
            {coin?.toString().toLocaleUpperCase()}
          </span>
        </div>
      </header>

      {coinCurrentPrice == 0 ? (
        <Skeleton className="h-[4rem] aspect-[17/3] flex items-center justify-center">
            <div className="border-4 border-t-transparent border-slate-600 rounded-full size-8 bg-white animate-spin" />
        </Skeleton>
      ) : (
        <span
          id="price"
          className="font-bold text-2xl flex flex-col items-center sm:flex-row bg-slate-200 p-4 rounded-lg shadow-md"
        >
          Preço: USDT
          <span className={`${priceChangeColor} text-5xl`}>
            &nbsp;{coinCurrentPrice.toPrecision(7)}
          </span>
        </span>
      )}

      <span className="font-semibold italic text-center text-lg">Gráfico atualizado a cada 1 minuto.</span>

      <p className="font-semibold text-xl sm:text-2xl mb-4 block text-center">Preço médio nas últimas 24 horas. </p>
      <section className="w-[80%] min-w-[280px] max-w-[1440px] min-h-[400px] 
      h-[500px] max-h-[800px] p-4 rounded-2xl overflow-hidden bg-transparent">
        <Chart
          symbol={coinsList[coinUrl].toLocaleUpperCase()}
        />
      </section>
    </main>
  );
}
