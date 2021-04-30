import { useRouter } from "next/router";

export const useWalletAddress = () => {
  const router = useRouter();
  const { walletAddress } = router.query;

  return walletAddress as string;
};
