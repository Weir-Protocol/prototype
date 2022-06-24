import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCelo } from "@celo/react-celo";
import useWeb3Utils from "../utils/Web3Utils";

import { NextPage } from "next";
import WeirCard from "../components/WeirCard";
import DefaultLayout from "../layouts/DefaultLayout";

import { BigNumber, ethers } from "ethers";

interface WeirData {
  releasedLiquidity: boolean;
  dao: string;
  daotoken: string;
  stablecoin: string;
  liquidityPool: string;
  amount: BigNumber;
  deadline: BigNumber;
  daoName: string;
}

const Weir: NextPage = () => {
  const [weirData, setWeirData] = useState<WeirData>();
  const [tokenPrice, setTokenPrice] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const { address, kit } = useCelo();
  const toast = useToast();

  const { loadWeb3Data, fetchWeirOfDAO, fetchWeirData, fetchTokenPrice } =
    useWeb3Utils() as any;

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!address) {
        toast({
          title: "Connect your wallet",
          description:
            "Please connect your wallet before accessing the Weirs page",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        router.push("/");
      }
      await loadWeb3Data(kit.connection.web3.currentProvider);
      const weir = await fetchWeirOfDAO(address);
      if (weir != null) {
        const weirD = await fetchWeirData(weir);
        setWeirData(weirD);
        const price = await fetchTokenPrice(weirD.liquidityPool);
        setTokenPrice(price);
      }
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, tokenPrice]);

  return loading ? (
    <DefaultLayout>
      <div className="min-h-[90vh] flex flex-col justify-start items-start w-full mx-auto my-[50px]">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    </DefaultLayout>
  ) : weirData !== undefined ? (
    <DefaultLayout>
      <div className="min-h-[90vh] flex flex-col justify-start items-start w-full mx-auto my-[50px]">
        <h1 className="text-2xl font-bold">Your Weirs</h1>
        <div className="flex flex-col w-full">
          <WeirCard weirData={weirData} price={tokenPrice} />
        </div>
      </div>
    </DefaultLayout>
  ) : (
    <DefaultLayout>
      <div className="min-h-[90vh] flex flex-col justify-start items-start w-full mx-auto my-[50px]">
        <h1 className="text-2xl font-bold">No Weirs found for your account</h1>
      </div>
    </DefaultLayout>
  );
};

export default Weir;
