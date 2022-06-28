## Status

The NFT Marketplace is currently running and fully functional on Kovan at

1. NFT Market:
   0x19134c3b5B74395db11f334AF0aa903D80Ce5a61

2. NFT:
   0x0594f7f0955685F879CAeaacAAA9662291eF2e29

The Website is online and running at [Website](https://superb-gnome-96c307.netlify.app)

## Approach

A NFT Marketplace running currently on Kovan. Let's you mint, sell and buy NFT's. During the minting we store the Metadata on IPFS and only store the TokenURI on-chain.

## Presentation:

## What is a NFT Marketplace?

This DApp allows you mint, buy and sell NFT's from the "Ape Family" contract.

- NFT's uploaded to IPFS
- Generated Transfer History with Covalent API, ethers receipt, tokenURI
- sell, buy with NFT Marketplace contract
- mint, transfer and set TokenURI with NFT contract

## Video Demo
https://www.youtube.com/watch?v=E7kEiSiET5o




## Covalent API
Covalent was used to generate: [this whole section](https://github.com/Stefan1612/Covalent-NFT-Marketplace/blob/master/src/Components/Transfers.js)

The actual API call
https://github.com/Stefan1612/Covalent-NFT-Marketplace/blob/5aa24e0f444a21256bf8e687a885b9cf8b9fb640/src/Components/Transfers.js#L30-L34

## License
This project is released under a GPLv3 compatible license

## Stack

### Blockchain Technologies

1. Environment - [Hardhat](https://hardhat.org/)
2. File Storage - [IPFS](https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client#install)
3. Client - [ethers.js](https://docs.ethers.io/v5/)

### Frontend

- [React](https://reactjs.org/)
- [ethers.js](https://docs.ethers.io/v5/)
- [MUI: React UI Library](https://mui.com/)
- [Bootstrap]
- [Covalent](https://www.covalenthq.com/docs/api/)

## Backend

- [Netlify](https://www.netlify.com/): Website host
- [Node.js](https://nodejs.org/en/)

## Challenges

- Handling Allowance
- IPFS upload
- Generating tokenId from tokenHash
