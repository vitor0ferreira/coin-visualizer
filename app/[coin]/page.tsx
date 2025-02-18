'use client'

import { useParams } from 'next/navigation';
import useWebSocket from '../hooks/useWebSocket';

import Image from 'next/image';
import Link from 'next/link';
import { TiArrowBack } from 'react-icons/ti';


export default function CoinPage() {

    const { "coin": coin } = useParams()
    const { data } = useWebSocket()
    const priceColor:Record<string, string> = {
        "ask": "text-red-600",
        "bid": "text-green-700"
    }

    return (
        <main className='w-full min-h-screen h-full flex flex-col gap-4 items-center justify-center'>
            <Image src={`/coins-icons/${coin}.png`} width={300} height={300} alt={`${coin} logo`} className="drop-shadow-lg"></Image>
            <header className='flex gap-6 items-center'>
                <Link href={'/'} className='size-12 rounded-lg bg-gradient-to-b from-[#2e466e] from-5% to-[#415989] to-100% hover:from-[#415989] hover:to-[#2e466e] shadow-md flex justify-center items-center'>
                    <TiArrowBack size={50} color='#fff'/>
                </Link>
                <span className='text-8xl text-white font-bold italic'>{coin?.toString().toLocaleUpperCase()}</span>
            </header>
            <section className='p-8 min-w-[720px] bg-slate-100 border-4 border-[#0e194b] rounded-lg flex items-center justify-center'>
                {data &&<span className='text-4xl text-[#132453] font-bold drop-shadow-md'>Current Price: U$ <span className={`${priceColor[data.events[0].side]}`}> {data.events[0].price}</span></span>}
            </section>
        </main>
    )
    
}