import Image from "next/image";
import Link from "next/link";
import { coinList } from "@/lib/coinDetails";
import { Jersey10Font } from "@/lib/fonts";
import faviconCoin from "@/public/coinIcon.png"
import AddCoinButton from "@/components/AddCoinButton/AddCoinButton";

export default function Home() {


  return (
    <main className="w-full min-h-screen content-center place-items-center space-y-4 p-4 select-none">
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
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {coinList.map((coin) => {
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
        <AddCoinButton />
      </section>
    </main>
  );
}
