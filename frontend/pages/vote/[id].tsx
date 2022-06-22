import { useCelo } from "@celo/react-celo";
import { Button, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  increment,
  updateDoc,
  doc,
  getDoc,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { firestore } from "../../firebase/firebase";

const Vote = () => {
  const router = useRouter();
  const [data, setData] = useState<DocumentData>({});
  const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { address } = useCelo();
  const toast = useToast();
  const url = router.query.id;

  const upVote = async () => {
    // create a pointer to the Document id
    const _dao = doc(firestore, "DAO", String(url));
    // update the doc by setting done to true
    await updateDoc(_dao, {
      yes: increment(1),
    });
    // retrieve todos
  };

  const downVote = async () => {
    // create a pointer to the Document id
    const _dao = doc(firestore, "DAO", String(url));
    // update the doc by setting done to true
    await updateDoc(_dao, {
      no: increment(1),
    });
    // retrieve todos
  };

  useEffect(() => {
    if (!address) {
      toast({
        title: "Connect your wallet",
        description:
          "Please connect your wallet before accessing the voting page",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      if (url) {
        const docRef = doc(firestore, "DAO", String(url));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
          const whitelisedStatus = docSnap
            .data()
            ?.whitelisted?.filter(
              (add: string) => add?.toLowerCase() === address?.toLowerCase()
            );
          setIsWhitelisted(whitelisedStatus?.length > 0);
        } else {
          console.log("No such document!");
          toast({
            title: "Document not found",
            description: "Please check the address",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          router.push("/");
        }
      }
      setLoading(false);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <DefaultLayout>
      <div className="min-h-[90vh] flex flex-col items-start w-full mx-auto my-[50px]">
        <h2 className="text-center font-semibold text-2xl mb-[20px]">
          {loading ? "Loading..." : data.DAOName}
        </h2>
        {!loading && (
          <>
            <div>
              <span
                className={`${
                  (new Date(data?.deadlineOfVote)?.getTime() ?? 0) >
                  new Date().getTime()
                    ? "bg-green-600"
                    : "bg-indigo-600"
                } px-[15px] py-[7px] rounded-full font-bold text-sm`}
              >
                {(new Date(data?.deadlineOfVote)?.getTime() ?? 0) >
                new Date().getTime()
                  ? "Open"
                  : "Closed"}
              </span>
            </div>
            <div className="flex flex-col md:flex-row justify-between w-full">
              <div className="flex-1">
                <div>
                  <h3 className="text-lg font-bold mt-[30px] mb-[15px]">
                    Information
                  </h3>
                  <div className="flex flex-col mb-[10px]">
                    <h4 className="font-bold text-gray-300">Voting System</h4>
                    <p className="text-white font-semibold text-sm">
                      Single choice voting
                    </p>
                  </div>
                  <div className="flex flex-col mb-[10px]">
                    <h4 className="font-bold text-gray-300">KPI target</h4>
                    <p className="text-white font-semibold text-sm">
                      {data?.KPITarget}
                    </p>
                  </div>
                  <div className="flex flex-col mb-[10px]">
                    <h4 className="font-bold text-gray-300">Start date</h4>
                    <p
                      className="text-white font-semibold text-sm"
                      suppressHydrationWarning
                    >
                      {new Date(
                        data?.time?.seconds * 1000
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col mb-[10px]">
                    <h4 className="font-bold text-gray-300">Voting System</h4>
                    <p
                      className="text-white font-semibold text-sm"
                      suppressHydrationWarning
                    >
                      {new Date(data?.deadlineOfVote).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              {isWhitelisted &&
                (new Date(data?.deadlineOfVote)?.getTime() ?? 0) >
                  new Date().getTime() && (
                  <div className="flex-1 flex flex-col items-start justify-start">
                    <h3 className="text-lg font-bold mt-[30px] mb-[15px]">
                      Vote
                    </h3>
                    <div className="flex flex-col items-center md:max-w-[250px] w-full">
                      <Button
                        colorScheme="twitter"
                        className="w-full"
                        onClick={upVote}
                      >
                        Yes
                      </Button>
                      <Button
                        colorScheme="red"
                        className="w-full mt-[20px]"
                        onClick={downVote}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                )}
              {(new Date(data?.deadlineOfVote)?.getTime() ?? 0) <
                new Date().getTime() &&
                data?.DAOTokenAddress?.toLowerCase() ===
                  address?.toLowerCase() && (
                  <div className="flex-1 flex flex-col items-start justify-start">
                    <h3 className="text-lg font-bold mt-[30px] mb-[15px]">
                      Vote
                    </h3>
                    <div className="flex flex-col items-center md:max-w-[250px] w-full">
                      <Button
                        colorScheme="orange"
                        className="w-full"
                        // onClick={}
                      >
                        Commit Vote Result
                      </Button>
                    </div>
                  </div>
                )}
            </div>
          </>
        )}
        {(new Date(data?.deadlineOfVote)?.getTime() ?? 0) <
          new Date().getTime() && (
          <>
            <h3 className="text-lg font-bold mt-[30px] mb-[15px]">Result</h3>
            <div className="flex flex-col items-center md:max-w-[250px] w-full">
              <div className="flex flex-col items-start w-full">
                <div className="col-span-8 w-full h-[8px] bg-zinc-800 rounded-full">
                  <div
                    className="h-[8px] bg-green-600 rounded-full"
                    style={{
                      width: `${
                        ((data?.yes ?? 0) * 100) / (data?.yes + data?.no)
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="col-span-3 gap-[20px] text-center">
                  Yes (
                  {(((data?.yes ?? 0) * 100) / (data?.yes + data?.no)).toFixed(
                    2
                  )}
                  %)
                </span>
              </div>
              <div className="flex flex-col items-start w-full mt-[10px]">
                <div className="col-span-8 w-full h-[8px] bg-zinc-800 rounded-full">
                  <div
                    className="h-[8px] bg-indigo-600 rounded-full"
                    style={{
                      width: `${
                        ((data?.no ?? 0) * 100) / (data?.yes + data?.no)
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="col-span-3 gap-[20px] text-center">
                  No (
                  {(((data?.no ?? 0) * 100) / (data?.yes + data?.no)).toFixed(
                    2
                  )}
                  %)
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Vote;
