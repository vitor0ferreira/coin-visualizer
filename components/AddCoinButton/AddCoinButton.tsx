'use client'

import { Jersey10Font } from "@/lib/fonts"
import { Dispatch, SetStateAction, useState} from "react";

import { 
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
 } from "../ui/dialog";

export default function AddCoinButton({addCoin}: {addCoin:Dispatch<SetStateAction<string[]>>}){

    const [selectedCoin, setSelectedCoin] = useState<string>("")
    let coinsRecord: string[] = [
        "cardano",
        "tron",
        "polkadot",
        "link",
    ]
    const addedCoin = coinsRecord.find((e)=>e == selectedCoin)


    return (
      <div 
      className="max-w-[min] w-full min-h-36 md:min-h-52 h-full 
      flex flex-col items-center justify-center transition duration-300 hover:border-emerald-600 hover:border-2
      gap-2 bg-slate-300 group hover:bg-slate-100 
      cursor-pointer rounded-md text-3xl overflow-hidden">
        <Dialog onOpenChange={() => setSelectedCoin("")}>
          <DialogTrigger asChild>
            <button className="w-full h-full">
              <span
                className={`${Jersey10Font.className} tracking-wide leading-7 text-3xl md:text-4xl group-hover:text-green-800 text-slate-600`}
              >
                Add <br /> Crypto
              </span>
            </button>
          </DialogTrigger>
          <DialogContent className="flex flex-col whitespace-nowrap">
            <DialogHeader>
              <DialogTitle>Choose one of the coins below:</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <fieldset className="flex justify-center items-start gap-2">
              {coinsRecord.map((coin) => {
                return (
                  <label
                    htmlFor={`select${coin}`}
                    className={`cursor-pointer px-4 py-2 flex justify-center items-center text-white font-semibold rounded-sm ${
                      selectedCoin == coin ? "bg-red-600" : "bg-blue-600"
                    } hover:brightness-125`}
                    onClick={() => setSelectedCoin(coin)}
                    key={coin}
                  >
                    {coin.toLocaleUpperCase()}
                    <input
                      type="radio"
                      name="coinSelector"
                      id={`select${coin}`}
                      className="hidden"
                      readOnly
                    />
                  </label>
                );
              })}
            </fieldset>
            <DialogClose asChild>
              <button
                className="bg-blue-700 p-2 rounded-md text-white font-semibold h-min"
                onClick={() => {
                  if (addedCoin) {
                    addCoin((previous) => [...previous, addedCoin]);
                    coinsRecord = coinsRecord.filter((coin)=> coin !== addedCoin)
                  }
                }}
              >
                Add
              </button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    );

}