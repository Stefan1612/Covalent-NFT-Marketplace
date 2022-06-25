import "./App.css";

import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Box, ThemeProvider } from "@mui/material";
//Components

import Home from "./Components/Home";
import MintedTokens from "./Components/MintedTokens";
import MintForm from "./Components/MintForm";
import OwnNfts from "./Components/OwnNfts";
import Header from "./Components/Header";
import Transfers from "./Components/Transfers";
//abi's

import NFT from "./config/contracts/NFT.json";
import NftMarketPlace from "./config/contracts/NftMarketPlace.json";
import ContractAddress from "./config/contracts/map.json";
//others
import { ethers } from "ethers";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";
import "bootstrap/dist/css/bootstrap.min.css";

import theme from "./Components/theme/theme";
/* const Web3Eth = require("web3-eth"); */
// const {utils, BigNumber} = require('ethers');

function App() {
  //contract addresses
  /*  const nftmarketaddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const ContractAddress[42].NftMarketPlace = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; */
  /* const web3Eth = new Web3Eth(Web3Eth.givenProvider);
  const contractWeb3 = new web3Eth.Contract(NFT.abi, ContractAddress[42].NFT);
  function web3Call() {
    web3Eth.getPastEvents(
      "Transfer",
      {
        fromBlock: 0,
        toBlock: "latest",
      },
      function (error, events) {
        if (!error) {
          for (var i = 0; i < events.length; i++) {
            console.log(events[i].returnValues.tokenId);
          }
        }
      }
    );
  } */

  //handle State
  const [account, setAccount] = useState("");
  // const [nfts, setNfts] = useState([]);

  //provider and signer
  let provider;

  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  }
  let signer;
  if (window.ethereum) {
    signer = provider.getSigner();
  }

  // infuraProvider

  const infuraProvider = new ethers.providers.InfuraProvider("kovan", {
    projectId: process.env.REACT_APP_PROJECT_ID,
    projectSecret: process.env.REACT_APP_PROJECT_SECRET,
  });

  //market
  const eventContractMarket = new ethers.Contract(
    ContractAddress[42].NftMarketPlace,
    NftMarketPlace.abi,
    provider
  );
  //nft
  const eventContractNFT = new ethers.Contract(
    ContractAddress[42].NFT,
    NFT.abi,
    provider
  );
  const eventContractMarketInfura = new ethers.Contract(
    ContractAddress[42].NftMarketPlace,
    NftMarketPlace.abi,
    infuraProvider
  );
  const eventContractNFTInfura = new ethers.Contract(
    ContractAddress[42].NFT,
    NFT.abi,
    infuraProvider
  );
  //signer calls
  //market
  const signerContractMarket = new ethers.Contract(
    ContractAddress[42].NftMarketPlace,
    NftMarketPlace.abi,
    signer
  );
  //NFT

  //side loaded
  useEffect(() => {
    loadOnSaleNFTs();
    if (provider) {
      FirstLoadGettingAccount(); // user provider
      gettingNetworkNameChainId(); // user provider
      /*  loadAll(); */
      loadOwnNFTs(); // user provider
      loadMintedNFTs(); // user provider
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //side loaded
  async function FirstLoadGettingAccount() {
    if (typeof window.ethereum !== undefined) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } else {
      // eslint-disable-next-line
      window.alert("Install Metamask!");
    }
  }

  //on chain change
  useEffect(() => {
    if (provider) {
      window.ethereum.on("chainChanged", handleChainChanged);
      return () => {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
  }

  //on account change
  useEffect(() => {
    if (provider) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // For now, 'eth_accounts' will continue to always return an array
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      window.location.reload();
    }
  }
  //network
  const [network, setNetwork] = useState({
    chanId: "",
    name: "",
  });
  async function gettingNetworkNameChainId() {
    const network = await provider.getNetwork();
    setNetwork(network);
  }

  //Loading every NFT function
  //ADD ERROR OPTIONS TRY AND CATCH
  /*  async function loadAll() {
    let data = await eventContractMarketInfura.fetchAllTokens();

    const tokenData = await Promise.all(
      data.map(async (index) => {
        //getting the TokenURI using the erc721uri method from our nft contract
        const tokenUri = await eventContractMarketInfura.tokenURI(
          index.tokenId
        );

        //getting the metadata of the nft using the URI
        const meta = await axios.get(tokenUri);

        //change the format to something im familiar with
        let nftData = {
          tokenId: index.tokenId,
          price: ethers.utils.formatUnits(index.price.toString(), "ether"),
          onSale: index.onSale,
          owner: index.owner,
          seller: index.seller,
          minter: index.minter,

          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };

        return nftData;
      })
    );
    setNfts(tokenData);
  } */

  const [ownNFTs, setOwnNFTs] = useState([]);

  async function loadOwnNFTs() {
    let data = await signerContractMarket.fetchAllMyTokens();

    const tokenData = await Promise.all(
      data.map(async (index) => {
        //getting the TokenURI using the erc721uri method from our nft contract
        const tokenUri = await eventContractNFT.tokenURI(index.tokenId);

        //getting the metadata of the nft using the URI
        const meta = await axios.get(tokenUri);

        //change the format to something im familiar with
        let nftData = {
          tokenId: index.tokenId,
          price: ethers.utils.formatUnits(index.price.toString(), "ether"),
          onSale: index.onSale,
          owner: index.owner,
          seller: index.seller,
          minter: index.minter,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };

        return nftData;
      })
    );
    setOwnNFTs(tokenData);
  }

  const [onSaleNFTs, setOnSaleNFTs] = useState([]);

  async function loadOnSaleNFTs() {
    let data = await eventContractMarketInfura.fetchAllTokensOnSale();

    const tokenData = await Promise.all(
      data.map(async (index) => {
        //getting the TokenURI using the erc721uri method from our nft contract
        const tokenUri = await eventContractNFTInfura.tokenURI(index.tokenId);

        //getting the metadata of the nft using the URI
        const meta = await axios.get(tokenUri);

        let nftData = {
          tokenId: index.tokenId,
          price: ethers.utils.formatUnits(index.price.toString(), "ether"),
          onSale: index.onSale,
          owner: index.owner,
          seller: index.seller,
          minter: index.minter,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };

        return nftData;
      })
    );
    setOnSaleNFTs(tokenData);
  }

  const [mintedNFTs, setMintedNFTs] = useState([]);

  async function loadMintedNFTs() {
    let data = await signerContractMarket.fetchTokensMintedByCaller();

    const tokenData = await Promise.all(
      data.map(async (index) => {
        //getting the TokenURI using the erc721uri method from our nft contract
        const tokenUri = await eventContractNFT.tokenURI(index.tokenId);

        //getting the metadata of the nft using the URI
        const meta = await axios.get(tokenUri);
        let nftData = {
          tokenId: index.tokenId,
          price: ethers.utils.formatUnits(index.price.toString(), "ether"),
          onSale: index.onSale,
          owner: index.owner,
          seller: index.seller,
          minter: index.minter,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };

        return nftData;
      })
    );
    setMintedNFTs(tokenData);
  }

  //uint256 _tokenId, address _nftContractAddress, value
  async function buyNFT(marketItem) {
    let id = marketItem.tokenId;
    id = id.toNumber();
    let price = marketItem.price;
    price = ethers.utils.parseEther(price);
    let tx = await signerContractMarket.buyMarketToken(
      id,
      ContractAddress[42].NFT,
      {
        value: price,
      }
    );
    await tx.wait();
    loadOwnNFTs();
    loadOnSaleNFTs();
  }

  async function sellNFT(marketItem) {
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
      ContractAddress[42].NftMarketPlace,
      NftMarketPlace.abi,
      signer
    );
    const nftContract = new ethers.Contract(
      ContractAddress[42].NFT,
      NFT.abi,
      signer
    );
    let id = marketItem.tokenId;
    id = id.toNumber();
    await nftContract.setApprovalForAll(
      ContractAddress[42].NftMarketPlace,
      true
    );
    let tx = await contract.saleMarketToken(
      id,
      previewPriceTwo,
      ContractAddress[42].NFT
    );
    await tx.wait();
    loadOwnNFTs();
    loadOnSaleNFTs();
  }

  const [previewPriceTwo, setPreviewPriceTwo] = useState({});

  let previewPrice = 0;

  //BUG when using input field and using a nft button on a completely different nft its still submitting the input price
  //changing price from ether(user Input) into wei for contract
  const handleChangePrice = (e) => {
    previewPrice = e.target.value;
    // you need to use dots instead of commas when using ether instead of wei
    previewPrice = previewPrice.toString();
    previewPrice = ethers.utils.parseEther(previewPrice);
    setPreviewPriceTwo(previewPrice);
    console.log(previewPriceTwo);
  };

  //client used to host and upload data, endpoint infura
  const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

  //keeping track of URL inserted as image for NFT metadata
  const [fileURL, setFileURL] = useState(null);
  const [formInput, setFormInput] = useState({ name: "", description: "" });

  async function handleUrlChange(e) {
    //check e.target.files without target [0]
    // console.log(e.target.files)
    const file = e.target.files[0];
    // console.log(file)
    try {
      const added = await client.add(
        file
        /*, {
                    progress: (prog) => console.log(`received ${prog}`)
                }*/
      );
      //added is an object containing the path(hash), CID, and the size of the file
      //console.log(added)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileURL(url);
      // console.log(url)
    } catch (error) {
      console.log("Error uploading File:", error);
    }
  }

  async function createMarket() {
    if (!formInput.name || !formInput.description || !fileURL) {
      return;
    }
    //upload to IPFS but this time with metadata
    //the metadata comes from a json, we need to stringify the data to upload it
    const data = JSON.stringify({
      name: formInput.name,
      description: formInput.description,
      image: fileURL,
    });

    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      //run a function that creates Sale and passes in the URL
      mintNFT(url);
    } catch (error) {
      console.log("Error uploading File:", error);
    }
  }

  //creating the NFT(first mint at ContractAddress[42].NftMarketPlace, second create market Token at market address)
  async function mintNFT(url) {
    //first step
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
      ContractAddress[42].NFT,
      NFT.abi,
      signer
    );
    // let tx =
    await contract.createNFT(url);

    /* tx = await tx.wait();

     let event = tx.events[0];

    let value = event.args[2];
    //console.log(value)

     let tokenId = value.toNumber(); */

    //list the item for sale on marketplace
    let listingPrice = await eventContractMarket.getListingPrice();
    listingPrice = listingPrice.toString();
    /*listingPrice = listingPrice.toNumber()
        console.log(listingPrice)*/

    let transaction = await signerContractMarket.mintMarketToken(
      ContractAddress[42].NFT,
      {
        value: listingPrice,
      }
    );
    await transaction.wait();
  }
  const [transferHistory, setTransferHistory] = useState("");
  async function getCovalentData() {
    const url =
      /* new URL( */
      `https://api.covalenthq.com/v1/42/address/${account}/transfers_v2/?contract-address=${ContractAddress[42].NFT}&key=${process.env.REACT_APP_COVALENT_API_KEY}`;

    /*   ); */

    await setTransferHistory(await axios.get(url));

    console.log(transferHistory);
  }

  /*  
  async function deletingNFT(marketItem) {
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
      ContractAddress[42].NftMarketPlace,
      NFT.abi,
      signer
    );

    let id = marketItem.tokenId;
    id = id.toNumber();
    await contract.burn(id);

    contract = new ethers.Contract(
      ContractAddress[42].NFT,
      NftMarketPlace.abi,
      signer
    );

    await contract.deleteNFT(id);
  } */

  function changeFormInputDescription(e) {
    setFormInput({ ...formInput, description: e.target.value });
  }
  function changeFormInputName(e) {
    setFormInput({ ...formInput, name: e.target.value });
  }

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Header />
        {/*  <Box
          id="background"
          marginTop={"91vh"}
          sx={{ backgroundColor: "#212121" }}
        > */}

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        <Routes>
          <Route
            exact
            path="/"
            element={
              <Home
                account={account}
                networkChainId={network.chainId}
                networkName={network.name}
                handleUrlChange={handleUrlChange}
                mintNFT={mintNFT}
                /* nfts={nfts} */
                onSaleNFTs={onSaleNFTs}
                buyNFT={buyNFT}
                FirstLoadGettingAccount={FirstLoadGettingAccount}
                getCovalentData={getCovalentData}
              />
            }
          />
          <Route
            exact
            path="/MintForm"
            element={
              <MintForm
                setFormInput={setFormInput}
                formInput={formInput}
                onChange={handleUrlChange}
                changeFormInputDescription={changeFormInputDescription}
                changeFormInputName={changeFormInputName}
                fileURL={fileURL}
                createMarket={createMarket}
              />
            }
          />
          <Route
            exact
            path="/OwnNfts"
            element={
              <OwnNfts
                ownNFTs={ownNFTs}
                sellNFT={sellNFT}
                handleChangePrice={handleChangePrice}
              />
            }
          />
          {/*deletingNFT={deletingNFT} */}
          <Route
            exact
            path="/MintedTokens"
            element={<MintedTokens mintedNFTs={mintedNFTs} />}
          />
          <Route
            exact
            path="/TransferHistory"
            element={
              <Transfers
                account={account}
                getCovalentData={getCovalentData}
                transferHistory={transferHistory}
                infuraProvider={infuraProvider}
              />
            }
          />
        </Routes>
        {/*      <Button onClick={(e) => web3Call()}>Web3</Button> */}
      </Box>
      {/*    </Box> */}
    </ThemeProvider>
  );
}

export default App;
