// eslint-disable-next-line @typescript-eslint/no-require-imports
const { WebSocketServer } = require("ws");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const WebSockets = require("ws");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { parse } = require("url");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { IncomingMessage } = require("http");


const wss = new WebSocketServer({ port: 8080 });

console.log("🚀 Servidor WebSocket rodando na porta 8080");


wss.on("connection", (clientSocket: WebSocket, req: typeof IncomingMessage) => {
  
  const coinMap:Record<string, string> = {
    "bitcoin": "btcusd",
    "ethereum": "ethusd",
    "ripple": "xrpusd",
    "litecoin": "ltcusd",
    "dogecoin": "dogeusd",
    "solana": "solusd"
  };
  
  const { query } = parse(req.url, true);
  const coinName = query.coin;
  const coinSymbol = coinMap[coinName]

  console.log(`✅ Cliente conectado para moeda: ${coinName} (${coinSymbol})`);


  const geminiSocket = new WebSockets(`wss://api.gemini.com/v1/marketdata/${coinSymbol}?top_of_book=true&trades=false`);

  geminiSocket.on("open", () => {
    console.log(`✅ Conectado à Gemini para ${coinSymbol}!`);
  });

  let lastSentTime = 0;
  const interval = 2000;


  geminiSocket.on("message", (data: WebSocket.RawData) => {
    const nowDate = Date.now();
    if(nowDate - lastSentTime >= interval){
      clientSocket.send(data.toString());
      lastSentTime = nowDate;
    }
  });


  geminiSocket.on("error", (error: Error) => {
    console.error("❌ Erro no WebSocket da Gemini:", error);
  });


  geminiSocket.on("close", () => {
    console.warn("⚠️ WebSocket da Gemini fechado");
    clientSocket.close();
  });


  clientSocket.on("close", () => {
    console.warn("⚠️ Cliente desconectado, fechando WebSocket da Gemini...");
    geminiSocket.close();
  });

  clientSocket.on("error", (error: Error) => {
    console.error("❌ Erro no WebSocket do cliente:", error);
  });
});
