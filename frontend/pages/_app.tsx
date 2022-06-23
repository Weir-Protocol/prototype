import { CeloProvider, Alfajores, NetworkNames } from "@celo/react-celo";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Web3Utils } from "../utils/Web3Utils";

import "@celo/react-celo/lib/styles.css";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <CeloProvider
        dapp={{
          name: "Weir Protocol",
          description: "Lorem Ipsum Dolor",
          url: "http://localhost:3000/",
          icon: "",
        }}
        networks={[Alfajores]}
        network={{
          name: NetworkNames.Alfajores,
          rpcUrl: "https://alfajores-forno.celo-testnet.org",
          graphQl: "https://alfajores-blockscout.celo-testnet.org/graphiql",
          explorer: "https://alfajores-blockscout.celo-testnet.org",
          chainId: 44787,
        }}
      >
        <Web3Utils>
          <Component {...pageProps} />
        </Web3Utils>
      </CeloProvider>
    </ChakraProvider>
  );
}

export default MyApp;
