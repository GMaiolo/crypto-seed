export interface ApeResponse {
  farms: Farm[];
}

export type Status = "loading" | "ok" | "error";

export interface WalletToken {
  id: string;
  symbol: string;
  name: string;
  platform: string;
  logo: string;
  decimals: number;
  address: string;
  balance: number;
  price: number;
}

export interface Farm {
  tokens: Token[];
  balance: number;
  reward: {
    symbol: string;
    address: string;
    logo: string;
    balance: number;
    price: number;
  };
}

export interface Token {
  symbol: string;
  address: string;
  logo: string;
  balance: number;
  price: number;
}
