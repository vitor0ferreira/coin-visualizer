export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  binanceSymbol: string;
  category: "layer1" | "defi" | "meme" | "infrastructure";
  rank: number;
  color: string;
  svgLogo: string;
  description: string;
}

export const CRYPTO_LIST: CryptoCurrency[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    binanceSymbol: "btcusdt",
    category: "layer1",
    rank: 1,
    color: "#F7931A",
    svgLogo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    description: "The first decentralized digital currency, created by Satoshi Nakamoto."
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    binanceSymbol: "ethusdt",
    category: "layer1",
    rank: 2,
    color: "#627EEA",
    svgLogo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    description: "Decentralized smart contract platform powering web3 and DeFi."
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    binanceSymbol: "solusdt",
    category: "layer1",
    rank: 3,
    color: "#14F195",
    svgLogo: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    description: "High-performance blockchain built for fast and cheap transactions."
  },
  {
    id: "binancecoin",
    name: "BNB",
    symbol: "BNB",
    binanceSymbol: "bnbusdt",
    category: "layer1",
    rank: 4,
    color: "#F3BA2F",
    svgLogo: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    description: "Ecosystem token powering BNB Chain and Binance exchange ecosystem."
  },
  {
    id: "ripple",
    name: "XRP",
    symbol: "XRP",
    binanceSymbol: "xrpusdt",
    category: "layer1",
    rank: 5,
    color: "#23292F",
    svgLogo: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    description: "Real-time gross settlement system and remittance network."
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    binanceSymbol: "adausdt",
    category: "layer1",
    rank: 6,
    color: "#0033AD",
    svgLogo: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    description: "Proof-of-stake blockchain network based on peer-reviewed research."
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    binanceSymbol: "dogeusdt",
    category: "meme",
    rank: 7,
    color: "#C2A633",
    svgLogo: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    description: "Open-source peer-to-peer cryptocurrency born from internet culture."
  },
  {
    id: "avalanche",
    name: "Avalanche",
    symbol: "AVAX",
    binanceSymbol: "avaxusdt",
    category: "layer1",
    rank: 8,
    color: "#E84142",
    svgLogo: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    description: "Layer-1 smart contracts platform designed for speed and sub-second finality."
  },
  {
    id: "chainlink",
    name: "Chainlink",
    symbol: "LINK",
    binanceSymbol: "linkusdt",
    category: "infrastructure",
    rank: 9,
    color: "#375BD2",
    svgLogo: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    description: "Decentralized oracle network connecting smart contracts with real-world data."
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    binanceSymbol: "dotusdt",
    category: "infrastructure",
    rank: 10,
    color: "#E6007A",
    svgLogo: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    description: "Sharded multichain protocol connecting specialized blockchains."
  },
  {
    id: "polygon",
    name: "Polygon",
    symbol: "POL",
    binanceSymbol: "maticusdt",
    category: "infrastructure",
    rank: 11,
    color: "#8247E5",
    svgLogo: "https://assets.coingecko.com/coins/images/4713/large/polygon.png",
    description: "Ethereum scaling framework and Zero-Knowledge Layer 2 ecosystem."
  },
  {
    id: "shiba-inu",
    name: "Shiba Inu",
    symbol: "SHIB",
    binanceSymbol: "shibusdt",
    category: "meme",
    rank: 12,
    color: "#FFA409",
    svgLogo: "https://assets.coingecko.com/coins/images/11939/large/shiba.png",
    description: "Decentralized community-building token with Shibarium ecosystem."
  },
  {
    id: "litecoin",
    name: "Litecoin",
    symbol: "LTC",
    binanceSymbol: "ltcusdt",
    category: "layer1",
    rank: 13,
    color: "#345D9D",
    svgLogo: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
    description: "Early bitcoin spinoff created for fast and low-cost payments."
  },
  {
    id: "tron",
    name: "TRON",
    symbol: "TRX",
    binanceSymbol: "trxusdt",
    category: "layer1",
    rank: 14,
    color: "#FF0013",
    svgLogo: "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png",
    description: "High-throughput blockchain network focused on content sharing and stablecoins."
  },
  {
    id: "near",
    name: "NEAR Protocol",
    symbol: "NEAR",
    binanceSymbol: "nearusdt",
    category: "layer1",
    rank: 15,
    color: "#000000",
    svgLogo: "https://assets.coingecko.com/coins/images/10365/large/near.png",
    description: "User-friendly AI-ready layer 1 blockchain designed for mass adoption."
  },
  {
    id: "uniswap",
    name: "Uniswap",
    symbol: "UNI",
    binanceSymbol: "uniusdt",
    category: "defi",
    rank: 16,
    color: "#FF007A",
    svgLogo: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
    description: "Leading decentralized Automated Market Maker (AMM) protocol."
  },
  {
    id: "cosmos",
    name: "Cosmos",
    symbol: "ATOM",
    binanceSymbol: "atomusdt",
    category: "infrastructure",
    rank: 17,
    color: "#2E3148",
    svgLogo: "https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png",
    description: "An ecosystem of independent interconnected blockchains (IBC)."
  },
  {
    id: "stellar",
    name: "Stellar",
    symbol: "XLM",
    binanceSymbol: "xlmusdt",
    category: "layer1",
    rank: 18,
    color: "#14B6E7",
    svgLogo: "https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png",
    description: "Open network that allows money to be moved and stored efficiently."
  },
  {
    id: "sui",
    name: "Sui",
    symbol: "SUI",
    binanceSymbol: "suiusdt",
    category: "layer1",
    rank: 19,
    color: "#4DA2FF",
    svgLogo: "https://assets.coingecko.com/coins/images/26375/large/sui-ocean-square.png",
    description: "Object-centric Layer 1 blockchain powered by Move programming language."
  },
  {
    id: "aptos",
    name: "Aptos",
    symbol: "APT",
    binanceSymbol: "aptusdt",
    category: "layer1",
    rank: 20,
    color: "#222222",
    svgLogo: "https://assets.coingecko.com/coins/images/26455/large/aptos_round.png",
    description: "Layer 1 blockchain with parallel execution engine built for safety and scalability."
  }
];

export const LOCAL_COIN_MAP: Record<string, string> = {
  bitcoin: "/coins-icons/bitcoin.png",
  ethereum: "/coins-icons/ethereum.png",
  solana: "/coins-icons/solana.png",
  ripple: "/coins-icons/ripple.png",
  cardano: "/coins-icons/cardano.png",
  dogecoin: "/coins-icons/dogecoin.png",
  chainlink: "/coins-icons/link.png",
  polkadot: "/coins-icons/polkadot.png",
  litecoin: "/coins-icons/litecoin.png",
  tron: "/coins-icons/tron.png",
};

export function getCoinLogo(id: string): string {
  if (LOCAL_COIN_MAP[id]) {
    return LOCAL_COIN_MAP[id];
  }
  const crypto = CRYPTO_LIST.find((c) => c.id === id);
  return crypto ? crypto.svgLogo : "/favicon.ico";
}
