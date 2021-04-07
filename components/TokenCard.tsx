import { Token } from "../types";
import { formatMoney } from "../utils/formatMoney";

interface Props {
  token: Token;
  bgColor?: string;
}
export const TokenCard = ({ token, bgColor = "bg-purple-50" }: Props) => (
  <div className={`my-4 rounded-xl px-8 py-4 shadow-xl ${bgColor}`}>
    <p className="font-semibold uppercase">{token.symbol}</p>
    <div className="inline-grid grid-cols-2 gap-x-2">
      <span className="font-light text-gray-700 text-sm mr-1">Tokens</span>
      <span>{token.balance.toFixed(3)}</span>
      <span className="font-light text-gray-700 text-sm mr-1">
        Price per token
      </span>
      <span>{formatMoney(token.price)}</span>
      <span className="font-light text-gray-700 text-sm mr-1">Total</span>
      <span>{formatMoney(token.balance * token.price)}</span>
    </div>
  </div>
);
