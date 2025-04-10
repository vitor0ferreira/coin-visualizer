"use client"
import Image from "next/image";
import Link from "next/link";
import AddCoinButton from "@/components/AddCoinButton/AddCoinButton";
import { useEffect, useState } from "react";

export default function CoinListSection({coins} : {coins: string[]}){
    
    const [coinsList, setCoinsList] = useState(coins)

    useEffect(()=>{

        if(typeof window !== "undefined"){
          setCoinsList(() => {
            const localData = localStorage.getItem("coins");

            if (localData) {
              return JSON.parse(localData);
            } else {
              localStorage.setItem("coins", JSON.stringify(coins));
              return coins;
            }
          });
        }
    }, [coins])

    return (
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        {coinsList.map((coin:string) => {
          return (
            <Link
              href={`/${coin}`}
              className="bg-gradient-to-br flex flex-col items-center gap-1 from-slate-50 to-neutral-200
              hover:saturate-150 hover:brightness-110 hover:border-slate-500
              transition duration-300 p-2 md:p-4 rounded-md
              max-h-min h-max max-w-fit w-32 md:w-48
              border-2 border-slate-300 hover
              text-xl md:text-3xl text-center font-extrabold text-blue-900 group"
              key={coin}
            >
              {coin.toLocaleUpperCase()}
              <Image
                src={`/coins-icons/${coin}.png`}
                width={200}
                height={200}
                alt={`${coin} logo`}
                className="drop-shadow-lg max-w-[90%]"
              ></Image>
            </Link>
          );
        })}
        <AddCoinButton addCoin={setCoinsList}/>
      </section>
    )
}