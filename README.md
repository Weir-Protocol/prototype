# Weir Protocol

A DAO2Stablecoin protocol for feasible liquidity generation and improving stablecoin adoption within DAOs

### Contract Deployment Information

**Celo Alfajores Testnet**

| Contract | Deployed address  |
| :----- | :- |
| [WeirFactory](https://alfajores-blockscout.celo-testnet.org/address/0x7Ec3C2a2bC8802f5c978eEd502C7eff0Dfcb3790) | `0x7Ec3C2a2bC8802f5c978eEd502C7eff0Dfcb3790` |
| [WeirTreasury](https://alfajores-blockscout.celo-testnet.org/address/0x64fBc6cf5e65931e1BF19d7FeA29883F93508aC5) | `0x64fBc6cf5e65931e1BF19d7FeA29883F93508aC5`|
| [Test DAO Token](https://alfajores-blockscout.celo-testnet.org/address/0x71Ec7bda1ED9A0E14De47C12092b6bbFA917063f) | `0x71Ec7bda1ED9A0E14De47C12092b6bbFA917063f`|
| [Test Stablecoin](https://alfajores-blockscout.celo-testnet.org/address/0x9fC38f4857e6DE9b6C4a6dDBed8ed983b432EEdb) | `0x9fC38f4857e6DE9b6C4a6dDBed8ed983b432EEdb`|
| [Test Carbon Credit](https://alfajores-blockscout.celo-testnet.org/address/0x6d048dae393A35894F5C83beA9e3A7C1abDC35e6) | `0x6d048dae393A35894F5C83beA9e3A7C1abDC35e6`|

### Setup

##### Pre-requisites

- NodeJS
- Ganache

#### Clone the repository

```
git clone https://github.com/Weir-Protocol/prototype.git
cd prototype
```

#### Install dependencies

```
yarn install
```
Create a .env file as per .env.example

#### Testing

Fork Celo Mainnet
```
ganache --fork.url https://forno.celo.org
```
Run tests
```
yarn test
```

#### Deploy locally

```
yarn deploy-local
```
