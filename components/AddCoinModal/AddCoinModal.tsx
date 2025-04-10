import { Dispatch, SetStateAction } from "react";


export default function AddCoinModal({addCoin}: {addCoin:Dispatch<SetStateAction<string[]>>}){

    return (
        <dialog open className="bg-slate-500 rounded-md min-w-fit min-h-fit absolute top-1/2 p-2 text-white font-semibold text-2xl">
            <form onSubmit={(e)=>{
                e.preventDefault()
            }}>
                <input type="text" className="outline-none appearance-none bg-slate-500" />
                <button type="submit" className="px-1 hover:text-slate-300"> X </button>
            </form>
        </dialog>
    )
}