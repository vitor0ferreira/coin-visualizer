import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

interface ChartProps {
  symbol: string;
}

export type CandleData = [
  klineOpenTime: number,
  openPrice: string,
  highPrice: string,
  lowPrice: string,
  closePrice: string,
  volume: string,
  klineCloseTime: number,
  quoteAssetVolume: string,
  numberOfTrades: number,
  takerBuyBaseAssetVolume: string,
  takerBuyQuoteAssetVolume: string,
  unusedField_ignore: string
]

export default function Chart({ symbol }: ChartProps) {
  const [data, setData] = useState<{ time: string; price: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=24`);
      const jsonData = await res.json();

      const formattedData = jsonData.map((entry: CandleData) => ({
        time: new Date(entry[0]).toLocaleTimeString(),
        price: parseFloat(entry[4]),
      }));

      setData(formattedData);
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Atualiza a cada 60 segundos

    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <ResponsiveContainer width="98%" height="80%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" fontWeight={"700"} tickFormatter={(value) => `${value.slice(0, 2)}h`}/>
        <YAxis domain={["auto", "auto"]} fontWeight={700} color="#ff0000" padding={{ bottom: 40 }} />
        <Tooltip labelStyle={{fontWeight: "bold"}} />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#22aaff"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
