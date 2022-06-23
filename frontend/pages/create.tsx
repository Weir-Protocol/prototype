import {
  Button,
  FormLabel,
  Input,
  Select,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import {
  FormEventHandler,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import { useCelo } from "@celo/react-celo";
import useWeb3Utils from "../utils/Web3Utils";

import DefaultLayout from "../layouts/DefaultLayout";
import { doc } from '@firebase/firestore';
import { setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { Timestamp } from 'firebase/firestore';
import { ethers } from "ethers";

import {
  StablecoinAddress
} from "../../hardhat/contractAddress";

const Create = () => {
  const [DAOName, setDAOName] = useState<string>("");
  const [DAOTokenAddress, setDAOTokenAddress] = useState<string>("");
  const [DAOTokenAmount, setDAOTokenAmount] = useState<string>("");
  const [liquidityPoolAddress, setLiquidityPoolAddress] = useState<string>("");
  const [KPITarget, setKPITarget] = useState<string>("");
  const [deadlineOfVote, setDeadlineOfVote] = useState<string>("");
  const [whitelistedText, setWhitelistedText] = useState<string>("");
  const [stableCoin, setStableCoin] = useState<string>("");
  const [whitelisted, setWhitelisted] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { address, kit } = useCelo();
  const toast = useToast();

  const {
    loadWeb3Data,
    createWeir,
    fetchWeirOfDAO,
    display
  } = useWeb3Utils();

  useEffect(() => {
    async function load() {
      if (!address) {
        toast({
          title: "Connect your wallet",
          description:
            "Please connect your wallet before accessing the create page",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        router.push("/");
      }
      await loadWeb3Data(kit.connection.web3.currentProvider);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const check_address = ethers.utils.isAddress;
    if (!check_address(DAOTokenAddress)) {
      toast({
        title: "Invalid Address",
        description: `Invalid address input for DAO token`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    if (!check_address(liquidityPoolAddress)) {
      toast({
        title: "Invalid Address",
        description: `Invalid address input for Liquidity pool`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    if (check_address(DAOTokenAddress) && check_address(liquidityPoolAddress)) {
      setLoading(true);
      const _dao = doc(firestore, "DAO", DAOTokenAddress)
      const time = Timestamp.now()
      const dao_data = {
        DAOName,
        DAOTokenAddress,
        DAOTokenAmount,
        liquidityPoolAddress,
        KPITarget,
        deadlineOfVote,
        whitelistedText,
        whitelisted,
        stableCoin,
        time,
        yes: 0,
        no: 0
      }

      const userAddress = address;
      const amount = ethers.utils.parseEther(DAOTokenAmount);
      const deadline = (new Date(deadlineOfVote.valueOf())).valueOf() / 1000;
      const dName = DAOName;

      const weirParams = {
        dao: userAddress,
        daotoken: DAOTokenAddress,
        stablecoin: StablecoinAddress,
        liquidityPool: liquidityPoolAddress,
        amount: amount,
        deadline: deadline,
        daoName: dName
      };

      try {
        await createWeir(weirParams, DAOTokenAmount);
        await setDoc(_dao, dao_data);
        console.log("added to db");
        toast({
          title: "Weir Created",
          description: "Successfully created Weir for your DAO",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.log("error", error);
      }
      setTimeout(() => setLoading(false), 3000);
    }
    

  };

  const handleWhitelistAddition: KeyboardEventHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (whitelistedText?.length === 0) return;
      setWhitelisted((prev) => [whitelistedText, ...prev]);
      setWhitelistedText("");
    }
  };

  const removeWhitelistedAddress = (address: string) => {
    setWhitelisted((prev) => {
      const newList = [...prev];
      newList.splice(newList.indexOf(address), 1);
      return newList;
    });
  };

  return (
    <DefaultLayout>
      <div className="min-h-[90vh] flex justify-center items-center max-w-[500px] w-full mx-auto my-[50px]">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-800 p-[50px] rounded w-full"
        >
          <h2 className="text-center font-semibold text-2xl mb-[20px]">
            Create Weir
          </h2>
          <FormLabel className="mt-[10px]" htmlFor="daoName">
            DAO Name
          </FormLabel>
          <Input
            id="daoName"
            type="text"
            value={DAOName}
            onChange={(e) => setDAOName(e.target.value)}
            placeholder="Enter name of your DAO"
            required
          />
          <FormLabel className="mt-[10px]" htmlFor="daoTokenAddress">
            DAO Token Address
          </FormLabel>
          <Input
            id="daoTokenAddress"
            type="text"
            value={DAOTokenAddress}
            placeholder="Enter address of the DAO token"
            onChange={(e) => setDAOTokenAddress(e.target.value)}
            required
          />
          <FormLabel className="mt-[10px]" htmlFor="daoName">
            DAO Token Amount
          </FormLabel>
          <Input
            id="daoTokenAmount"
            type="text"
            placeholder="Enter amount of DAO tokens to lock-in"
            value={DAOTokenAmount}
            onChange={(e) => setDAOTokenAmount(e.target.value)}
            required
          />
          <FormLabel className="mt-[10px]" htmlFor="stableCoin">
            Choose stablecoin
          </FormLabel>
          <Select
            placeholder="Select the stablecoin"
            onChange={(e) => setStableCoin(e.target.value)}
            required
          >
            <option value="tUSD">tUSD</option>
          </Select>
          <FormLabel className="mt-[10px]" htmlFor="daoName">
            Liquidity Pool Address
          </FormLabel>
          <Input
            id="liquidityPoolAddress"
            type="text"
            value={liquidityPoolAddress}
            placeholder="Enter the liquidity pool address"
            onChange={(e) => setLiquidityPoolAddress(e.target.value)}
            required
          />
          <FormLabel className="mt-[60px]" htmlFor="kpiTarget">
            KPI Target
          </FormLabel>
          <Textarea
            id="kpiTarget"
            rows={5}
            resize="none"
            value={KPITarget}
            placeholder="Enter KPI target"
            onChange={(e) => setKPITarget(e.target.value)}
            required
          />
          <FormLabel className="mt-[10px]" htmlFor="deadline">
            Deadline of vote
          </FormLabel>
          <Input
            id="deadline"
            placeholder="Select the deadline of the vote"
            type="date"
            value={deadlineOfVote}
            onChange={(e) => setDeadlineOfVote(e.target.value)}
            required
          />
          <FormLabel className="mt-[10px]" htmlFor="whitelisted">
            Whitelisted voter address
          </FormLabel>
          <Input
            id="whitelisted"
            type="text"
            value={whitelistedText}
            placeholder="Press 'Enter' after adding 1 whitelisted voter address"
            onChange={(e) => {
              setWhitelistedText(e.target.value);
            }}
            onKeyDown={handleWhitelistAddition}
          />
          {whitelisted.length > 0 && (
            <div className="bg-zinc-900 mt-[10px] rounded flex flex-col max-h-[300px] overflow-y-scroll">
              {whitelisted?.map((whitelisted, i) => (
                <span
                  className="flex items-center justify-between first:mt-[10px] last:mb-[10px] bg-zinc-800 p-[10px] mx-[10px] my-[5px] rounded"
                  key={i}
                >
                  <span>{whitelisted}</span>
                  <b
                    className="cursor-pointer"
                    onClick={() => removeWhitelistedAddress(whitelisted)}
                  >
                    &times;
                  </b>
                </span>
              ))}
            </div>
          )}
          <Button
            isLoading={loading}
            loadingText="Creating..."
            type="submit"
            bg="twitter.500"
            className="mt-[20px] w-full"
          >
            Create
          </Button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default Create;
