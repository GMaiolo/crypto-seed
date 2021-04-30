import { useRouter } from "next/router";
import { useEffect } from "react";

export const useWalletAddress = () => {
  const router = useRouter();
  console.log({ hello: router.query });
  const { walletAddress } = router.query;

  useEffect(() => {
    if (!walletAddress) {
      router.push("/");
    }
  }, [router, walletAddress]);

  return walletAddress as string;
};
