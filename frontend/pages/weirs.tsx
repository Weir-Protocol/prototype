import { NextPage } from "next";
import WeirCard from "../components/WeirCard";
import DefaultLayout from "../layouts/DefaultLayout";

const Weir: NextPage = () => {
  return (
    <DefaultLayout>
      <div className="min-h-[90vh] flex flex-col justify-start items-start w-full mx-auto my-[50px]">
        <h1 className="text-2xl font-bold">Your Weirs</h1>
        <div className="flex flex-col w-full">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <WeirCard valueLocked={125600} numberOfTokens={1000000} key={i} />
            ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Weir;
