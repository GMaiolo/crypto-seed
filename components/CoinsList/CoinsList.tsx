export function CoinsList({ tokens, selectedToken, onSelectToken }) {
  return (
    <div className="mt-2">
      {tokens.map((token) => (
        <img
          key={token.key}
          className={`cursor-pointer transition-transform inline-block h-10 w-10 rounded-full ${
            selectedToken.key === token.key ? "transform scale-125" : ""
          }`}
          src={`/icons/${token.key}`}
          alt="Token"
          onClick={() => onSelectToken(token)}
        />
      ))}
    </div>
  );
}
