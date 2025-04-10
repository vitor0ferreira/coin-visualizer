'use client'

import { Jersey10Font } from "@/lib/fonts"
import { Dispatch, SetStateAction, useState } from "react";
import AddCoinModal from "../AddCoinModal/AddCoinModal";
import { createPortal } from "react-dom";

export default function AddCoinButton({addCoin}: {addCoin:Dispatch<SetStateAction<string[]>>}){

    const [showModal, setShowModal] = useState<boolean>(false)

    return (
        <div 
        className="max-w-[min] w-full min-h-40 h-full flex flex-col items-center justify-center gap-2 bg-slate-300 group hover:bg-slate-200 hover:outline-1 hover:outline-slate-400 cursor-pointer rounded-md text-3xl overflow-hidden"
        >
            <button className="w-full h-full" onClick={()=>setShowModal(previousValue=>!previousValue)}>
                <span className={`${Jersey10Font.className} tracking-wide leading-7 text-3xl md:text-4xl group-hover:text-blue-400 text-slate-600`}>
                Adicionar <br/> moeda
                </span>
            </button>
            {showModal && 
                createPortal(<AddCoinModal addCoin={addCoin} />, document.body, "modal")
            }
        </div>
    )

}