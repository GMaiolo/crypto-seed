export type Status = "loading" | "ok" | "error";

export interface PlatformData {
  name: string;
  url: string;
  requestedAddress: string; // address de la billetera
  nativeTokenPrice: number; // precio del token de la plataforma (e.g. SWAMP en Swamp)
  pools: PoolInfo[]; // informacion de las pools
}
export interface PoolInfo {
  pid: number; // id de la pool
  name: string; // nombre de la pool
  symbol?: string; // simbolo de la pool
  walletBalance: number; // balance en la billetera del token de la pool
  userStaked: number; // cuantos tokens tiene stakeados (depositados en el pool)
  pendingHarvest: number; // cuantos tokens NATIVOS tiene para recolectar (tambien llamados rewards)
  price?: number; // precio del token si es una pool simple (si es token combinado LP esto va a ser undefined)
  addr: string; // address del contrato de la pool
  strat: string; // ni idea, es un address de la estrategia o algo asi
  allocPoint: number; // ni idea
  accNATIVEPerShare: number; // ni idea
  isLP: boolean; // es un token combinado? true/false (Liquidity Provider )
  lpInfo?: LPInfo;
}
export interface LPInfo {
  tvl: number; // total value locked, cantidad de plata "dentro" de la plataforma
  price: number; // precio del token (LP) combinado
  token0: {
    // primer token del par
    price: number; // precio del primer token del par
    addr: string; // address del contrato del token
    name: string; // nombre del token
    symbol: string; // simbolo del token
    quantity?: number; // cantidad del token constituido en la combinacion (si se separan cuanto del token quedaria)
  };
  token1: {
    // segundo token del par
    price: number;
    addr: string;
    name: string;
    symbol: string;
    quantity?: number;
  };
}
