import { useCelo } from "@celo/react-celo";
import { ethers, providers, Contract } from "ethers";
import { CeloProvider, CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import React, { useState, useEffect, useMemo, useCallback } from 'react';

import {
    DAOtokenAddress,
    StablecoinAddress,
    WeirFactoryAddress,
    WeirTreasuryAddress
} from "../../hardhat/contractAddress";

import ERC20 from "../abi/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";
import IRouter from "../abi/contracts/interfaces/IRouter.sol/IRouter.json";
import ILiquidityPool from "../abi/contracts/interfaces/ILiquidityPool.sol/ILiquidityPool.json";
import WeirFactory from "../abi/contracts/WeirFactory.sol/WeirFactory.json";
import WeirController from "../abi/contracts/WeirController.sol/WeirController.json";

let signer, provider, weirFactory;

export const Web3Context = React.createContext(null);

export const Web3Utils = ({ children }) => {

    const [chainId, setChainId] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const loadWeb3Data = async (Web3Provider) => {
        try {
            const walletProvider = new providers.Web3Provider(Web3Provider);
            const chainID = (await walletProvider.getNetwork()).chainId;
            setChainId(chainID);
            if (chainID == 44787) {
                provider = new CeloProvider("https://alfajores-forno.celo-testnet.org");
            } else {
                provider = new CeloProvider("http://localhost:8545");
            }
            // provider = new providers.Web3Provider(Web3Provider);
            await provider.ready;
            signer = walletProvider.getSigner();
            // signer = provider.getSigner();
            weirFactory = new Contract(WeirFactoryAddress, WeirFactory, provider);
        } catch(error) {
            console.log('Error:', error);
        }
    };

    const createWeir =  async (weirParams, DAOTokenAmount) => {
        try {
            const daoToken = new Contract(DAOtokenAddress, ERC20, provider);
            const tx1 = await daoToken.connect(signer).approve(WeirFactoryAddress, ethers.utils.parseEther((DAOTokenAmount * 2).toString()));
            await tx1.wait();
            const tx2 = await weirFactory.connect(signer).createWeir(weirParams);
            await tx2.wait();
        } catch(error) {
            console.log('Error:', error);
        }
    };

    const fetchWeirOfDAO = async (address) => {
        try {
            const token = await weirFactory.getTokenOfDAO(address);
            const weir = await weirFactory.getWeirOfToken(token);
            if (token != ethers.constants.AddressZero && weir != ethers.constants.AddressZero) {
                return weir;
            } else {
                return null;
            }
        } catch(error) {
            console.log('Error:', error);
        }
    };

    const fetchWeirData = async (weirAddress) => {
        try {
            const weirController = new Contract(weirAddress, WeirController, provider);
            const weirData = await weirController.weirData();
            return weirData;
        } catch(error) {
            console.log('Error:', error);
        }
    };

    const fetchTokenPrice = async (lpAddress) => {
        try {
            const lpPool = new Contract(lpAddress, ILiquidityPool, provider);

            const currentReserve = await lpPool.getReserves(); 
            const price = 
                parseFloat(ethers.utils.formatEther(currentReserve.reserve1))
                 / 
                parseFloat(ethers.utils.formatEther(currentReserve.reserve0));
            return price;           
        } catch(error) {
            console.log('Error:', error);
        }
    };

    const postVoteResult = async (result, daoTokenAddress, lpAddress, amount) => {
        try {
            const oracle = new CeloWallet(process.env.PRIVATE_KEY, provider);

            const weirAddress = await weirFactory.getWeirOfToken(daoTokenAddress);
            const weirController = new Contract(weirAddress, WeirController, provider);
            const lpPool = new Contract(lpAddress, ILiquidityPool, provider);

            const currentReserve = await lpPool.getReserves();
            const stablecoinQuote = amount *
                (parseFloat(ethers.utils.formatEther(currentReserve.reserve1))
                 / 
                parseFloat(ethers.utils.formatEther(currentReserve.reserve0)));
    
            if (result == true) {
                const stablecoin = new Contract(StablecoinAddress, ERC20, provider);
                const tx1 = await stablecoin
                            .connect(oracle)
                            .transferFrom(WeirTreasuryAddress, weirAddress, ethers.utils.parseEther(stablecoinQuote.toString()));
                await tx1.wait();
            }
            const tx = await weirController
                        .connect(oracle)
                        .postVoteResult(result, ethers.utils.parseEther(stablecoinQuote.toString()));
            await tx.wait();
        } catch(error) {
            console.log('Error:', error);
        }
    };

    const display = async (Web3Provider) => {
        await loadWeb3Data(Web3Provider);
        weirFactory = new Contract(WeirFactoryAddress, WeirFactory, provider);
        const address = await signer.getAddress();
        const weir = await fetchWeir(address);
        console.log(weir);
    };

    const values = useMemo(() => ({
        loadWeb3Data,
        createWeir,
        fetchWeirOfDAO,
        fetchWeirData,
        fetchTokenPrice,
        postVoteResult,
        display
    }),
    [
        chainId
    ]
    );

    return <Web3Context.Provider value={values}>{children}</Web3Context.Provider>;
};

export default function useWeb3Utils() {
    const context = React.useContext(Web3Context);

    if (context === undefined) {
        throw new Error('useWeb3Utils hook must be used with a Web3Utils component');
    }

    return context;
};