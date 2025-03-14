
import { Jersey_10, Roboto } from "next/font/google";


export const Jersey10Font = Jersey_10({
    variable:"--font-Jersey-10",
    style:["normal"],
    weight:["400"],
    preload:true
})

export const robotoFont = Roboto({
    variable: "--font-Roboto",
    style: ["italic", "normal"],
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"]
  })