interface Props {
  weirData: any;
  price: number;
}

import { useToast } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import Link from "next/link";

const WeirCard = ({ weirData, price }: Props) => {
  const toast = useToast();

  const copyShareableLink = () => {
    const baseURL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "PRODUCTION_URL_HERE";
    navigator.clipboard.writeText(`${baseURL}/vote/${weirData?.daotoken}`);
    toast({
      title: "Copied to clipboard!",
      description: "Copied the shareable link to clipboard",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <>
      {" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-[20px] lg:gap-[50px] mt-[32px]">
        <div className="col-span-1 flex items-center justify-center flex-col w-full p-[30px] rounded-[6px] bg-zinc-800">
          <h2 className="text-sm uppercase font-extrabold">
            Total Value Locked
          </h2>
          <h3 className="font-semibold text-primary text-lg xl:text-3xl">
            ${price * parseFloat(ethers.utils.formatEther(weirData.amount))}
          </h3>
          <h2 className="text-sm uppercase font-extrabold mt-[20px]">
            Number of Tokens
          </h2>
          <h3 className="font-semibold text-lg xl:text-3xl">
            <span className="text-primary">
              {ethers.utils.formatEther(weirData.amount)}
            </span>{" "}
            DAO tokens
          </h3>
        </div>
        <div className="col-span-1 lg:col-span-2 flex flex-col lg:justify-center mb-[32px] lg:mb-0">
          <h2 className="uppercase font-bold text-xl">
            Your Bonus Contribution: &nbsp;
            <span className="text-primary">
              {(
                parseFloat(ethers.utils.formatEther(weirData.amount)) / 2
              ).toString()}{" "}
              DAO tokens
            </span>{" "}
            <br /> <br />
            Bonus DAO Tokens Utilization
          </h2>
          <div className="mt-[20px] grid grid-cols-1 md:grid-cols-2">
            <div className="border border-zinc-800 px-[20px] py-[10px] rounded-t md:rounded-t-none md:rounded-tl flex items-center justify-between w-full">
              <span className="font-semibold">Platform Fee</span>
              <span>20%</span>
            </div>
            <div className="border border-zinc-800 px-[20px] py-[10px] md:rounded-tr flex items-center justify-between w-full">
              <span className="font-semibold">
                Collateral mechanism of tUSD
              </span>
              <span>30%</span>
            </div>
            <div className="border border-zinc-800 px-[20px] py-[10px] md:rounded-bl flex items-center justify-between w-full">
              <span className="font-semibold">Purchase of Carbon Credits</span>
              <span>50%</span>
            </div>
            <div className="border border-zinc-800 px-[20px] py-[10px] rounded-b md:rounded-b-none md:rounded-br flex items-center justify-between w-full">
              <span className="font-semibold">Total</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
      <p className="font-bold text-lg my-[20px]">
        Your DAO tokens have been used to purchase carbon credits and offset x
        tons of CO2
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px] mt-[20px]">
        <div className="flex h-full flex-col flex-1">
          <span className="font-bold uppercase">Voting status</span>
          <span
            className={`font-bold ${
              parseInt(weirData?.deadline?._hex) * 1000 > new Date().getTime()
                ? "text-green-400"
                : "text-indigo-400"
            }`}
          >
            {parseInt(weirData?.deadline?._hex) * 1000 > new Date().getTime()
              ? "Voting active"
              : "Voting closed"}
          </span>
        </div>
        <div className="font-semibold flex h-full flex-col flex-1">
          <span>
            {weirData?.releasedLiquidity
              ? "Liquidity Released to the Pool"
              : "Liquidity not Released"}
          </span>
        </div>
        <div className="flex flex-col flex-1">
          <Link href={`/vote/${weirData?.daotoken}`}>
            <a className="block font-bold w-full bg-primary rounded text-center px-[20px] py-[10px]">
              Vote
            </a>
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <a
            onClick={copyShareableLink}
            className="block font-bold w-full bg-green-500 rounded text-center px-[20px] py-[10px]"
          >
            Copy link
          </a>
        </div>
      </div>
    </>
  );
};

export default WeirCard;
