

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { WebSocketServer } = require("ws");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const WebSockets = require("ws");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { parse } = require("url")

// Criar um WebSocket Server local na porta 8080
const wss = new WebSocketServer({ port: 8080 });

console.log("🚀 Servidor WebSocket rodando na porta 8080");

// Quando um cliente se conecta ao WebSocket local
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
  const coinSymbol = coinMap[coinName] // Converte para símbolo da API

  console.log(`✅ Cliente conectado para moeda: ${coinName} (${coinSymbol})`);

  // Conectar ao WebSocket da Gemini
  const geminiSocket = new WebSockets(`wss://api.gemini.com/v1/marketdata/${coinSymbol}?top_of_book=true&trades=false`);

  geminiSocket.on("open", () => {
    console.log(`✅ Conectado à Gemini para ${coinSymbol}!`);
  });

  let lastSentTime = 0;
  const interval = 2000;

  // Quando recebemos dados da Gemini, enviamos para o cliente
  geminiSocket.on("message", (data) => {
    const nowDate = Date.now();
    if(nowDate - lastSentTime >= interval){
      clientSocket.send(data.toString()); // Repassar os dados para o frontend
      lastSentTime = nowDate;
    }
  });

  // Se houver um erro na conexão com a Gemini
  geminiSocket.on("error", (error) => {
    console.error("❌ Erro no WebSocket da Gemini:", error);
  });

  // Se o WebSocket da Gemini fechar, desconectar o cliente também
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
