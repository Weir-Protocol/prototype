import { useCelo } from "@celo/react-celo";
import { ethers, providers, Contract } from "ethers";
import React, { useState, useEffect, useMemo, useCallback } from 'react';

import {
    DAOtokenAddress,
    StablecoinAddress,
    WeirFactoryAddress
} from "../../hardhat/contractAddress";

import ERC20 from "../abi/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";
import IRouter from "../abi/contracts/interfaces/IRouter.sol/IRouter.json";
import WeirFactory from "../abi/contracts/WeirFactory.sol/WeirFactory.json";
import WeirController from "../abi/contracts/WeirController.sol/WeirController.json";

let signer, provider, weirFactory;

export const Web3Context = React.createContext(null);

export const Web3Utils = ({ children }) => {

    const [chainId, setChainId] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const loadWeb3Data = async (Web3Provider) => {
        try {
            provider = new providers.Web3Provider(Web3Provider);
            signer = provider.getSigner();
            weirFactory = new Contract(WeirFactoryAddress, WeirFactory, provider);
            setChainId(await signer.getChainId());
        } catch(error) {
            console.log('Error:', error);
        }
    };

    const createWeir =  async (weirParams, DAOTokenAmount) => {
        try {
            const daoToken = new Contract(DAOtokenAddress, ERC20, provider);
            const tx1 = await daoToken.connect(signer).approve(WeirFactoryAddress, ethers.utils.parseEther((DAOTokenAmount * 1.5).toString()));
            await tx1.wait();
            const tx2 = await weirFactory.connect(signer).createWeir(weirParams);
            await tx2.wait();
        } catch(error) {
            console.log('Error:', error);
        }
    };

    const fetchWeirOfDAO = async (address) => {
        try {
            const weir = await weirFactory.getTokenOfDAO(address);
            if (weir != ethers.constants.AddressZero) {
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