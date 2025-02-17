import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full min-h-screen content-center place-items-center space-y-8 p-4">
      <span className="font-semibold text-slate-200 text-4xl">Select a coin:</span>
      <section className="grid grid-cols-3 gap-4">
        <Link href={'/bitcoin'} className="bg-gradient-to-br from-slate-700 to-blue-950 hover:saturate-150 hover:brightness-110 transition duration-300 p-4 rounded-md min-h-min h-40 min-w-min w-52 text-2xl text-center font-semibold text-white">
          Bitcoin
          <Image src={"/coins-icons/bitcoin.png"} width={500} height={500} alt="bitcoin logo" className="drop-shadow-lg"></Image>
        </Link>
        <Link href={'/ethereum'} className="bg-gradient-to-br from-slate-700 to-blue-950 hover:saturate-150 hover:brightness-110 transition duration-300 p-4 rounded-md min-h-min h-40 min-w-min w-52 text-2xl text-center font-semibold text-white">
          Ethereum
          <Image src={"/coins-icons/ethereum.png"} width={500} height={500} alt="ethereum logo" className="drop-shadow-lg"></Image>
        </Link>
        <Link href={'/dogecoin'} className="bg-gradient-to-br from-slate-700 to-blue-950 hover:saturate-150 hover:brightness-110 transition duration-300 p-4 rounded-md min-h-min h-40 min-w-min w-52 text-2xl text-center font-semibold text-white">
          Dogecoin
          <Image src={"/coins-icons/dogecoin.png"} width={500} height={500} alt="dogecoin logo" className="drop-shadow-lg"></Image>
        </Link>
        <Link href={'/ripple'} className="bg-gradient-to-br from-slate-700 to-blue-950 hover:saturate-150 hover:brightness-110 transition duration-300 p-4 rounded-md min-h-min h-40 min-w-min w-52 text-2xl text-center font-semibold text-white">
          Ripple
          <Image src={"/coins-icons/ripple.png"} width={500} height={500} alt="ripple logo" className="drop-shadow-lg"></Image>
        </Link>
        <Link href={'/solana'} className="bg-gradient-to-br from-slate-700 to-blue-950 hover:saturate-150 hover:brightness-110 transition duration-300 p-4 rounded-md min-h-min h-40 min-w-min w-52 text-2xl text-center font-semibold text-white">
          Solana
          <Image src={"/coins-icons/solana.png"} width={500} height={500} alt="solana logo" className="drop-shadow-lg"></Image>
        </Link>
        <Link href={'/litecoin'} className="bg-gradient-to-br from-slate-700 to-blue-950 hover:saturate-150 hover:brightness-110 transition duration-300 p-4 rounded-md min-h-min h-40 min-w-min w-52 text-2xl text-center font-semibold text-white">
          Litecoin
          <Image src={"/coins-icons/litecoin.png"} width={500} height={500} alt="litecoin logo" className="drop-shadow-lg"></Image>
        </Link>
      </section>
    </main>
  );
}