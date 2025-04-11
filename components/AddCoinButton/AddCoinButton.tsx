'use client'

import { Jersey10Font } from "@/lib/fonts"

export default function AddCoinButton(){

    const date = new Date();

    return (
        <button 
        className="max-w-[min] w-full min-h-20 h-full p-4 flex flex-col items-center justify-center gap-2 bg-slate-300 hover:brightness-110 rounded-md text-3xl"
        onClick={()=>{console.warn(`Função ainda não adicionada até o dia de hoje (${date.toLocaleDateString()})`)}}
        >
            <span className={`${Jersey10Font.className} tracking-wide leading-7 text-2xl md:text-4xl text-slate-600 hover:animate-pulse`}>
            Adicionar <br/> moeda
            </span>
        </button>
    )

}