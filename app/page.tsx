
import Image from "next/image";
import { coinList } from "@/lib/coinDetails";
import { Jersey10Font } from "@/lib/fonts";
import faviconCoin from "@/public/coinIcon.png"
import CoinListSection from "@/components/CoinListSection/CoinListSection";

export default function Home() {


  return (
    <main className="relative w-full min-h-screen content-center place-items-center space-y-4 p-4 select-none">
      <h1 className={`flex flex-col md:flex-row items-center gap-4 whitespace-nowrap text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] xl:text-[10rem] text-blue-900 ${Jersey10Font.className}`}>
        <Image 
          src={faviconCoin}
          alt="coin-Icon"
          width={150}
          height={50}
          className="w-28 md:w-32"
        />
        COIN VISUALIZER
      </h1>
      <span className={`text-slate-800 text-4xl sm:text-5xl md:text-6xl tracking-wide ${Jersey10Font.className} p-2`}>
        Select a coin:
      </span>
      <CoinListSection coins={coinList}/>
    </main>
  );
}