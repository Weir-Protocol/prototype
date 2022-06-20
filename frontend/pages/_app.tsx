import { CeloProvider } from "@celo/react-celo";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

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
      >
        <Component {...pageProps} />;
      </CeloProvider>
    </ChakraProvider>
  );
}

export default MyApp;
