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
    description: "Weir is focussed on DAOs and decentralized communities",
    icon: CommunityIcon,
  },
  {
    title: "Voting Simplified",
    description: "DAO members can effortlessly register their votes",
    icon: DocumentIcon,
  },
  {
    title: "Secure",
    description:
      "Weir's token lock and control mechanism is inherently secure",
    icon: LockIcon,
  },
  {
    title: "Custom Oracle",
    description: "Weir's oracle commits vote results on-chain",
    icon: OracleIcon,
  },
];

const steps: string[] = [
  "Create a weir using your DAO token and a (DAO token - Stablecoin) Liquidity Pool and set a Key Performance Indicator(KPI) target relevant to the purpose/goal of your DAO",
  "Share the voting link with your DAO members and endorse them to vote",
  "Once the voting deadline is over, view votes received and commit the voting result on-chain",
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
        <a
          href="#get-started"
          className="text-lg font-bold px-[50px] py-[10px] bg-primary rounded"
        >
          Get Started
        </a>
        <small className="font-bold mt-[12px] text-sm">
          Weir Protocol is live on Celo Alfajores Testnet
        </small>
      </div>
      <div className="py-[60px]">
        <h2 className="text-lg uppercase font-bold mb-[32px]">Why use Weir?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
          {cardData.map(({ title, description, icon }, i) => (
            <Card title={title} description={description} icon={icon} key={i} />
          ))}
        </div>
      </div>
      <div className="py-[60px]" id="get-started">
        <h2 className="text-lg uppercase font-bold mb-[32px]">
          As a DAO how can you use Weir Protocol?
        </h2>
        <div className="grid md:grid-col-4 lg:grid-cols-6 gap-[20px]">
          {steps.map((step, i) => (
            <>
              <div className="col-span-1 font-bold">Step {i + 1}:</div>
              <div className="col-span-3 lg:col-span-5">{step}</div>
            </>
          ))}
          <div className="col-span-1"></div>
          <div className="col-span-3 lg:col-span-5">
            Receive liquidity into the liquidity pool if your DAO has achieved
            the KPI target
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Home;
