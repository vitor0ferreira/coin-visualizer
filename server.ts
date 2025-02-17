// eslint-disable-next-line @typescript-eslint/no-require-imports
const { WebSocketServer } = require("ws");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const WebSockets = require("ws");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { parse } = require("url")


const wss = new WebSocketServer({ port: 8080 });

console.log("🚀 Servidor WebSocket rodando na porta 8080");


wss.on("connection", (clientSocket, req) => {
  
  const coinMap = {
    bitcoin: "btcusd",
    ethereum: "ethusd",
    ripple: "xrpusd",
    litecoin: "ltcusd",
    dogecoin: "dogeusd",
    solana: "solusd"
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


  geminiSocket.on("message", (data) => {
    const nowDate = Date.now();
    if(nowDate - lastSentTime >= interval){
      clientSocket.send(data.toString());
      lastSentTime = nowDate;
    }
  });


  geminiSocket.on("error", (error) => {
    console.error("❌ Erro no WebSocket da Gemini:", error);
  });


  geminiSocket.on("close", () => {
    console.warn("⚠️ WebSocket da Gemini fechado");
    clientSocket.close();
  });

  // Se o cliente fechar a conexão, fechamos a conexão com a Gemini
  clientSocket.on("close", () => {
    console.warn("⚠️ Cliente desconectado, fechando WebSocket da Gemini...");
    geminiSocket.close();
  });

  clientSocket.on("error", (error) => {
    console.error("❌ Erro no WebSocket do cliente:", error);
  });
});
