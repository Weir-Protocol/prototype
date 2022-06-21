import { Button } from "@chakra-ui/react";
import DefaultLayout from "../layouts/DefaultLayout";

const Vote = () => {
  return (
    <DefaultLayout>
      <div className="min-h-[90vh] flex flex-col items-start w-full mx-auto my-[50px]">
        <h2 className="text-center font-semibold text-2xl mb-[20px]">
          {"{DAO_NAME goes here}"}
        </h2>
        <div>
          <span className="bg-green-600 px-[15px] py-[7px] rounded-full font-bold text-sm">
            Open
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
                <h4 className="font-bold text-gray-300">Start date</h4>
                <p
                  className="text-white font-semibold text-sm"
                  suppressHydrationWarning
                >
                  {new Date().toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col mb-[10px]">
                <h4 className="font-bold text-gray-300">Voting System</h4>
                <p
                  className="text-white font-semibold text-sm"
                  suppressHydrationWarning
                >
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-start justify-start">
            <h3 className="text-lg font-bold mt-[30px] mb-[15px]">Vote</h3>
            <div className="flex items-center">
              <Button colorScheme="twitter" className="mr-[20px]">
                Yes
              </Button>
              <Button colorScheme="red">No</Button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Vote;
