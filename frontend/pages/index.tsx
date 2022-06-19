import type { NextPage } from "next";
import Card from "../components/Card";
import DefaultLayout from "../layouts/DefaultLayout";

import CommunityIcon from "../public/assets/weir-community.svg";
import DocumentIcon from "../public/assets/weir-doc.svg";
import LockIcon from "../public/assets/weir-lock.svg";
import OracleIcon from "../public/assets/weir-oo.svg";

const cardData: { icon: any; title: string; description: string }[] = [
  {
    title: "Community friendly",
    description: "Weir is a Web3 native protocol with a community-first focus",
    icon: CommunityIcon,
  },
  {
    title: "No limits on design",
    description: "Request any arbitrary data to power your protocol",
    icon: DocumentIcon,
  },
  {
    title: "Provably secure",
    description:
      "Weir's oracle is the only one that offers economic guarantees",
    icon: LockIcon,
  },
  {
    title: "Minimize oracle usage",
    description: "Fewer calls means a smaller attack vector and lower fees",
    icon: OracleIcon,
  },
];

const Home: NextPage = () => {
  return (
    <DefaultLayout>
      <div className="h-[90vh] flex items-center justify-center flex-col">
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-6xl font-black mb-[32px] lg:mb-[64px] max-w-[900px] text-center mx-auto">
          Weir is a{" "}
          <span className="text-primary">DAO2Stablecoin Protocol</span> for
          sustainable liquidity
        </h1>
        <button className="text-lg font-bold px-[50px] py-[10px] bg-primary rounded">
          Get Started
        </button>
      </div>
      <div className="py-[60px]">
        <h2 className="text-lg uppercase font-bold mb-[32px]">Why use Weir?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
          {cardData.map(({ title, description, icon }, i) => (
            <Card title={title} description={description} icon={icon} key={i} />
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Home;
