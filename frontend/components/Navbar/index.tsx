import Link from "next/link";
import { useState } from "react";
import { useCelo } from "@celo/react-celo";
import { useToast } from "@chakra-ui/react";

const navLinks: { text: string; link: string }[] = [
  {
    text: "Create",
    link: "/",
  },
  {
    text: "Weirs",
    link: "/",
  },
];

const Navbar = () => {
  const [navbarVisible, setNavbarVisible] = useState<boolean>(false);

  const { connect, address, destroy } = useCelo();
  const toast = useToast();

  const connectWallet = async () => {
    try {
      await connect();
      toast({
        title: "Wallet Connected",
        description: `We've connected your wallet with address ${address}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Wallet Connection failed",
        description: error?.message ?? "",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-[32px] md:px-[64px] xl:px-[120px] shadow">
      <header className="w-full flex items-center justify-between bg-background py-[15px]">
        <div className="flex flex-1">
          <nav className="flex flex-1">
            <h1 className="flex-1 lg:flex-auto text-lg mr-[20px] font-bold text-white whitespace-nowrap">
              Weir Protocol
            </h1>
            <ul className="hidden flex-[2] lg:flex-auto md:flex w-full items-center">
              {navLinks.map(({ link, text }) => (
                <Link href={link} key={text + link}>
                  <li>
                    <a className="px-[10px]">{text}</a>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
        </div>
        <div className="hidden flex-1 lg:flex items-center justify-end">
          <span
            suppressHydrationWarning
            className="px-[20px] py-[5px] text-orange-500 bg-orange-500 bg-opacity-[20%] rounded-[5px]"
          >
            {address ? "Alfajores" : "Not Connected"}
          </span>
          <button
            className="bg-blue-500 text-white px-[20px] py-[5px] rounded-[5px] ml-[20px]"
            suppressHydrationWarning
            onClick={address ? destroy : connectWallet}
          >
            {address ? `Disconnect wallet` : "Connect to a wallet"}
          </button>
        </div>
        <div
          className="flex flex-col md:hidden"
          onClick={() => setNavbarVisible((prev) => !prev)}
        >
          <span className="h-[2px] w-[30px] bg-white my-[2px]"></span>
          <span className="h-[2px] w-[30px] bg-white my-[2px]"></span>
          <span className="h-[2px] w-[30px] bg-white my-[2px]"></span>
        </div>

        <div
          className={`bg-[#2c2f36] absolute top-0 right-0 h-full w-[300px] flex flex-col transition-all duration-300 ease-linear ${
            navbarVisible ? "max-w-[300px] p-[20px]" : "max-w-[0px] w-0"
          }`}
        >
          {navbarVisible && (
            <>
              <div className="flex justify-end">
                <span
                  className="text-[36px]"
                  onClick={() => setNavbarVisible((prev) => !prev)}
                >
                  &times;
                </span>
              </div>
              <div className="flex flex-col">
                <ul className="flex flex-col  w-full items-start justify-start">
                  {navLinks.map(({ link, text }) => (
                    <Link href={link} key={text + link}>
                      <li>
                        <a className="my-[10px] text-[18px]">{text}</a>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
