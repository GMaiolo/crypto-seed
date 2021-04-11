import * as icons from "../icons/";

export function Home() {
  return (
    <div className="h-full pt-2">
      <img
        className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
        src={icons["pk"]}
        alt=""
      />
      <img
        className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
        src={icons["bt"]}
        alt=""
      />
      <img
        className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
        src={icons["eth"]}
        alt=""
      />
      <img
        className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
        src={icons["ada"]}
        alt=""
      />
    </div>
  );
}
