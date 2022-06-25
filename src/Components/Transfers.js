import React, { useState, useEffect } from "react";
import { Box, Button, Input, Typography, Container } from "@mui/material";
import axios from "axios";
import { ethers } from "ethers";
import NFT from "../config/contracts/NFT.json";
import ContractAddress from "../config/contracts/map.json";
const Transfers = ({
  account,

  infuraProvider,
}) => {
  async function getCovalentBalance() {
    const url = new URL(
      `https://api.covalenthq.com/v1/42/address/${account}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=${process.env.REACT_APP_COVALENT_API_KEY}`
    ); /* https://api.covalenthq.com/v1/1/address/demo.eth/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_e0658fffc54e4624b0d7842fed3 */

    const result = await axios.get(url);
    console.log(result);
  }
  /* "NftMarketPlace": "0x412101A022814AB446Ac7A081227e06DfA18E0c2",
    "NFT": "0xD8FAe8DFd746d4BB7fa944E09F1DAed3a6A74057" */

  /*  "NftMarketPlace": "0xefD7c6C92f3486aCf834A4631e52d8fC6c0C8989",
    "NFT": "0xC65B9150f030c77D6619Dd807FdF19aDbaF65f40" */

  /*  "NftMarketPlace": "0xCD24f71098dB656856b0164FC3AB639D864De977", 
   "NFT":  "0x7dC011D1121D7932108f87BF462A587bA9B7F90f"  */

  const [transferHistory, setTransferHistory] = useState("");
  const [transferArray, setTransferArray] = useState([]);
  async function getCovalentData() {
    const url = `https://api.covalenthq.com/v1/42/address/${account}/transfers_v2/?contract-address=${ContractAddress[42].NFT}&key=${process.env.REACT_APP_COVALENT_API_KEY}`;
    let result = await axios.get(url);
    setTransferHistory(result);
  }
  useEffect(() => {
    if (transferHistory) {
      setTransferArray(transferHistory.data.data.items);
      console.log("transfer Array updated to equal transferHistory");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transferHistory]);

  function showNftTransactionType(index) {
    if (index.transfers[0].transfer_type === "IN") {
      return "Token Minted";
    }
    if (index.transfers[0].transfer_type === "OUT") {
      return "Token put up for sale";
    }
  }

  const [transferData, setTransferData] = useState([]);
  const [finishedFinalObject, setFinishedFinalObject] = useState(false);
  const [finalObject, setFinalObject] = useState([]);
  async function getData() {
    let memoryArray = [];
    transferArray.map((e) => {
      memoryArray.push({
        TransferType: e.transfers[0].transfer_type,
        From: e.from_address,
        To: e.to_address,
        GasSpent: e.gas_spent,
        GasPrice: e.gas_price,
        TxHash: e.tx_hash,
        ContractName: e.transfers[0].contract_name,
        ContractTicker: e.transfers[0].contract_ticker_symbol,
      });
    });
    setTransferData(memoryArray);
    // saves all transaction objects in order "newest -> oldest"

    const contractNFTInfura = new ethers.Contract(
      ContractAddress[42].NFT,
      NFT.abi,
      infuraProvider
    );

    await Promise.all(
      memoryArray.map(async (e, i) => {
        const receipt = await infuraProvider.getTransactionReceipt(e.TxHash);

        let tokenId = receipt.logs[0].topics[3];

        tokenId = tokenId.slice(2);
        tokenId = parseInt(tokenId, 16);

        let tokenUri = await contractNFTInfura.tokenURI(tokenId);

        const meta = await axios.get(tokenUri);

        e.image = meta.data.image;
      })
    );
    setFinalObject(memoryArray);
    setFinishedFinalObject(true);

    console.log(memoryArray);
  }
  /* function callTransferData() {
    console.log(transferData);
    console.log(transferData[0].TxHash);
  } */

  return (
    <Box
      id="background"
      sx={{ backgroundColor: "#212121", minHeight: "100vh" }}
    >
      <Container>
        <Box
          sx={{
            color: "white",
            borderColor: "white",
            border: "solid",
            borderWidth: "1px",
            marginBottom: "10vh",
          }}
        >
          {" "}
          <Box>
            Currently Connected With: {account ? account : "Not Connected"}
          </Box>
          Current Ethereum Balance:
        </Box>{" "}
        <Box
          style={{
            border: "solid",
            /* margin: "10px", */
            padding: "10px",
            paddingLeft: "30px",
            borderWidth: "1px",
            textAlign: "left",
            backgroundColor: "white",
          }}
        >
          {" "}
          Transfers
        </Box>
        <Button onClick={(e) => getCovalentBalance()}>Get balance</Button>
        <Button onClick={(e) => getCovalentData()}>Get transfer History</Button>
        <Button onClick={(e) => getData()}>getData</Button>
        {/*  <Button onClick={(e) => callTransferData()}>
          console.log transferData
        </Button> */}
        <Box>
          {finishedFinalObject &&
            finalObject.map((e, index) => {
              return (
                <Box
                  key={index}
                  style={{
                    border: "solid",
                    margin: "10px",
                    padding: "10px",
                    paddingLeft: "30px",
                    borderWidth: "1px",
                    textAlign: "left",
                    color: "white",
                  }}
                >
                  <Box>
                    <Box style={{ float: "left", paddingRight: "40px" }}>
                      <Box>From =&gt; {e.From}</Box>
                      <Box>To =&gt; {e.To}</Box>
                      <Box>Gas spent =&gt; {e.GasSpent}</Box>
                      <Box>Gas price =&gt; {e.GasPrice}</Box>
                      <Box>Tx Hash =&gt; {e.TxHash}</Box>
                      <Box>Transfer Type =&gt; {e.TransferType}</Box>
                      <Box>Contract Name =&gt; {e.ContractName}</Box>
                      <Box>Contract Ticker =&gt; {e.ContractTicker}</Box>
                    </Box>
                    <img
                      src={e.image}
                      alt="nft"
                      style={{ width: "250px" }}
                    ></img>
                  </Box>
                </Box>
              );
            })}
        </Box>
      </Container>
    </Box>
  );
};

export default Transfers;
