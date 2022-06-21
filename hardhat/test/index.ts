import { Wallet, utils  } from 'ethers'
import { Contract } from "@ethersproject/contracts";
import { ethers, waffle, network } from "hardhat";
import { providers } from "ethers";
import { expect } from "chai";
import { describe } from "mocha";
import {
    ERC20,
    WeirFactory,
    WeirController
} from "../typechain";
import * as IRouter from "../artifacts/contracts/interfaces/IRouter.sol/IRouter.json";
import * as ILPFactory from "../artifacts/contracts/interfaces/ILPFactory.sol/ILPFactory.json";
import * as ILiquidityPool from "../artifacts/contracts/interfaces/ILiquidityPool.sol/ILiquidityPool.json";

const amount = 10000;
const ratio = 0.3;
const routerAddress = "0xE3D8bd6Aed4F159bc8000a9cD47CffDb95F96121";
const LPFactoryAddress = "0x62d5b84bE28a183aBB507E125B384122D2C25fAE";

describe("Weir Protocol Test", function() {
    let dao: Wallet,
        oracle: Wallet,
        router: Contract,
        daotoken: ERC20,
        deployer: Wallet,
        treasury: Wallet,
        stablecoin: ERC20,
        lpAddress: string,
        weirFactory: WeirFactory,
        weirController: WeirController;

    const createFixtureLoader = waffle.createFixtureLoader;
    const fixture = async () => {
        const _DAOtoken = await ethers.getContractFactory("DAOtoken");
        daotoken = await _DAOtoken.connect(dao).deploy() as ERC20;
        await daotoken.deployed();

        const _Stablecoin = await ethers.getContractFactory("Stablecoin");
        stablecoin = await _Stablecoin.connect(treasury).deploy() as ERC20;
        await stablecoin.deployed();

        const _WeirFactory = await ethers.getContractFactory("WeirFactory");
        weirFactory = await _WeirFactory.deploy(treasury.address, oracle.address, routerAddress) as WeirFactory;
        await weirFactory.deployed();
    };
    let loadFixture: ReturnType<typeof createFixtureLoader>;

    before('create fixture loader', async () => {
        [deployer, treasury, dao, oracle] = await (ethers as any).getSigners();
        loadFixture = createFixtureLoader([deployer, treasury, dao, oracle]);
    });

    beforeEach('deploy contracts', async () => {
        await loadFixture(fixture);  
        
        await stablecoin.connect(treasury).transfer(
            dao.address, 
            ethers.utils.parseEther((amount * ratio).toString())
        );
        router = new ethers.Contract(routerAddress, IRouter.abi, deployer);
        await daotoken.connect(dao).approve(
            router.address,
            ethers.utils.parseEther(amount.toString())
        );
        await stablecoin.connect(dao).approve(
            router.address,
            ethers.utils.parseEther((amount * ratio).toString())
        );
        await router.connect(dao).addLiquidity(
            daotoken.address,
            stablecoin.address,
            ethers.utils.parseEther(amount.toString()),
            ethers.utils.parseEther((amount * ratio).toString()),
            ethers.utils.parseEther(amount.toString()),
            ethers.utils.parseEther((amount * ratio).toString()),
            dao.address,
            Math.ceil((new Date).valueOf()/1000)+300
        );

        const lpFactory = new ethers.Contract(LPFactoryAddress, ILPFactory.abi, deployer);
        lpAddress = await lpFactory.getPair(daotoken.address, stablecoin.address);

        await daotoken.connect(dao).approve(
            weirFactory.address, 
            ethers.utils.parseEther((amount * 1.5).toString())
        );
        const weirParams = {
            dao: dao.address,
            daotoken: daotoken.address,
            stablecoin: stablecoin.address,
            liquidityPool: lpAddress,
            amount: ethers.utils.parseEther(amount.toString()),
            deadline: Math.ceil((new Date).valueOf()/1000)-100,
            daoName: "SampleDAO"
        };

        await weirFactory.connect(dao).createWeir(weirParams);
        const weirAddress = await weirFactory.getWeirOfToken(daotoken.address);
        const _WeirController = await ethers.getContractFactory("WeirController");
        weirController = _WeirController.attach(weirAddress) as WeirController;
    });

    it('contracts deploy successfully', async () => {
        expect(daotoken.address).to.not.be.undefined;
        expect(stablecoin.address).to.not.be.undefined;
        expect(weirFactory.address).to.not.be.undefined;
    });

    it('factory can create a new weir', async () => {
        expect(
            await weirFactory.getWeirOfToken(daotoken.address)
        ).to.not.be.equal(ethers.constants.AddressZero);
    });

    it('treasury receives bonus DAO tokens', async () => {
        expect(
            ethers.utils.formatEther(await stablecoin.balanceOf(treasury.address))
        ).to.not.be.equal((amount / 2).toString());
    });

    it("weir params can be retrieved", async () => {
        const weirParams = await weirController.weirData();
        const releasedLiquidity = await weirController.releasedLiquidity();
        expect(releasedLiquidity).to.be.equal(false);
        expect(weirParams.dao).to.be.equal(dao.address);
        expect(weirParams.daotoken).to.be.equal(daotoken.address);
        expect(weirParams.stablecoin).to.be.equal(stablecoin.address);
        expect(weirParams.daoName).to.be.equal("SampleDAO");
    });

    it("weir can release liquidity", async () => {
        const weirParams = await weirController.weirData();
        const lpPool = new ethers.Contract(lpAddress, ILiquidityPool.abi, deployer);
        const initialLPBalance = ethers.utils.formatEther(await lpPool.balanceOf(dao.address));
        
        const initialReserve = await lpPool.getReserves();
        let stablecoinQuote = await router.quote(
            weirParams.amount,
            initialReserve.reserve0,
            initialReserve.reserve1
        );
        await stablecoin.connect(treasury).transfer(
            weirController.address,
            stablecoinQuote
        );
        await weirController.connect(oracle).postVoteResult(
            true,
            stablecoinQuote
        );
        const finalReserve = await lpPool.getReserves();
        const finalLPBalance = ethers.utils.formatEther(await lpPool.balanceOf(dao.address));

        expect(
            parseInt(finalLPBalance) - parseInt(initialLPBalance)
        ).to.be.greaterThan(0);
        expect(
            parseFloat(ethers.utils.formatEther(finalReserve.reserve0)) - 
            parseFloat(ethers.utils.formatEther(initialReserve.reserve0))
        ).to.be.equal(amount);
        expect(
            parseFloat(ethers.utils.formatEther(finalReserve.reserve1)) - 
            parseFloat(ethers.utils.formatEther(initialReserve.reserve1))
        ).to.be.equal(amount * ratio);
    });
});
