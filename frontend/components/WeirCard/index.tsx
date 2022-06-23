interface Props {
  valueLocked: number;
  numberOfTokens: number;
}

const WeirCard = ({ valueLocked, numberOfTokens }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-[20px] lg:gap-[50px] mt-[32px]">
      <div className="col-span-1 flex items-center justify-center flex-col w-full p-[30px] rounded-[6px] bg-zinc-800">
        <h2 className="text-sm uppercase font-extrabold">Total Value Locked</h2>
        <h3 className="font-semibold text-primary text-lg xl:text-3xl">
          ${valueLocked.toLocaleString()}
        </h3>
        <h2 className="text-sm uppercase font-extrabold mt-[20px]">
          Number of Tokens
        </h2>
        <h3 className="font-semibold text-lg xl:text-3xl">
          <span className="text-primary">
            {numberOfTokens.toLocaleString()}
          </span>{" "}
          tokens
        </h3>
      </div>
      <div className="col-span-1 lg:col-span-2 flex flex-col lg:justify-center mb-[32px] lg:mb-0">
        <h2 className="uppercase font-bold text-xl">
          Decentralized <span className="text-primary">stablecoin</span> <br />{" "}
          With an algorithimic central bank
        </h2>
        <div className="mt-[20px] grid grid-cols-1 md:grid-cols-2">
          <div className="border border-zinc-800 px-[20px] py-[10px] rounded-tl flex items-center justify-between w-full">
            <span className="font-semibold">Collateral</span>
            <span>30%</span>
          </div>
          <div className="border border-zinc-800 px-[20px] py-[10px] rounded-tr flex items-center justify-between w-full">
            <span className="font-semibold">Carbon Credits</span>
            <span>50%</span>
          </div>
          <div className="border border-zinc-800 px-[20px] py-[10px] rounded-bl flex items-center justify-between w-full">
            <span className="font-semibold">Platform Fee</span>
            <span>20%</span>
          </div>
          <div className="border border-zinc-800 px-[20px] py-[10px] rounded-br flex items-center justify-between w-full">
            <span className="font-semibold">Total</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeirCard;