import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { WsData } from "../types/GeminiWebsocketData";


export default function useWebSocket () {
  
  const [data, setData] = useState<WsData>();
  const lastUpdatedRef = useRef(0);
  const interval = 2000; // 2 segundos
  const { "coin": coin } = useParams()


  useEffect(() => {

    if(!coin) return;

    const socket = new WebSocket(`ws://localhost:8080?coin=${coin}`);

    socket.onopen = () => console.log("✅ Conectado ao WebSocket local!");

    socket.onmessage = (event) => {
      const now = Date.now();
      if (now - lastUpdatedRef.current >= interval) {
        setData(JSON.parse(event.data));
        lastUpdatedRef.current = now;
      }
    };

    socket.onclose = () => console.log("⚠️ WebSocket fechado precocemente");

    return () => socket.close();
  }, [coin]);

  return { data };
};
