import { useState, useEffect } from "react";

export default function useGetPrice(coin:string) {

    const [coinPrice, setCoinPrice] = useState(null)

    useEffect(()=>{
        fetch(`https://api.gemini.com/v1/pricefeed/${coin}`)
        .then((response)=>response.json())
        .then((data)=>setCoinPrice(data))
    },[coin])

    return coinPrice
}