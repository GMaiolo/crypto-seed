import { useEffect, useState } from "react";
import { PlatformData, Status } from "../shared/types";
import axios from "axios";

type PlatformHook = [status: Status, data: PlatformData];
export const usePlatform = (
  walletAddr: string,
  platform: string // la string EXACTA del endpoint
): PlatformHook => {
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!walletAddr) {
      return;
    }
    const getSwampInfo = async () => {
      setStatus("loading");
      try {
        const { data } = await axios.get(
          `http://localhost:4000/${walletAddr}/${platform}`,
          {
            params: {
              onlyStaked: true,
            },
          }
        );
        setData(data);
        setStatus("ok");
      } catch (err) {
        console.log(err);
        setStatus("error");
        setData(null);
      }
    };
    getSwampInfo();
  }, [walletAddr, platform]);

  return [status, data];
};
