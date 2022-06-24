import React, { useState, useEffect } from "react";
import { Box, Button, Input, Typography, Container } from "@mui/material";
import axios from "axios";
import { ethers } from "ethers";
const Transfers = ({
  account,
  getCovalentData,
  transferHistory,
  infuraProvider,
}) => {
  async function getCovalentBalance() {
    const url = new URL(
      `https://api.covalenthq.com/v1/42/address/${account}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=${process.env.REACT_APP_COVALENT_API_KEY}`
      /* `https://api.covalenthq.com/v1/42/address/${account}/transfers_v2?contract-address=${ContractAddress[42].NFT}&key=${process.env.REACT_APP_COVALENT_API_KEY}` */
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
  function showNftTransactionType(index) {
    if (index.transfers[0].transfer_type === "IN") {
      return "Token Minted";
    }
    if (index.transfers[0].transfer_type === "OUT") {
      return "Token put up for sale";
    }
  }

  async function getReceipt(index) {
    const receipt = await infuraProvider.getTransactionReceipt(index.tx_hash);
    /*  console.log(JSON.stringify(receipt.logs[0].topics[3].toString(16))); */
    let tokenId = receipt.logs[0].topics[3];

    tokenId = tokenId.slice(2);
    tokenId = parseInt(tokenId, 16);
    console.log(tokenId);

    return tokenId;
  }
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
        {transferHistory /* console.log(props.secondAlchemyResult)  */ &&
          transferHistory.data.data.items.map((e, index) => {
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
                {transferHistory.data.data.items[index].from_address && (
                  <Box>
                    {showNftTransactionType(
                      transferHistory.data.data.items[index]
                    )}
                    <Box>
                      {JSON.stringify(
                        getReceipt(transferHistory.data.data.items[index])
                      )}
                      {/*   {tokenID} */}
                    </Box>
                    <Box>
                      From =&gt;{" "}
                      {transferHistory.data.data.items[index].from_address}
                    </Box>
                    <Box>
                      To =&gt;{" "}
                      {transferHistory.data.data.items[index].to_address}
                    </Box>
                    <Box>
                      Gas spent =&gt;{" "}
                      {transferHistory.data.data.items[index].gas_spent}
                    </Box>
                    <Box>
                      Gas price =&gt;{" "}
                      {transferHistory.data.data.items[index].gas_price}
                    </Box>
                    <Box>
                      Tx Hash =&gt;{" "}
                      {transferHistory.data.data.items[index].tx_hash}
                    </Box>
                    <Box>
                      Transfer Type =&gt;{" "}
                      {
                        transferHistory.data.data.items[index].transfers[0]
                          .transfer_type
                      }
                    </Box>
                    <Box>
                      Contract Name =&gt;{" "}
                      {
                        transferHistory.data.data.items[index].transfers[0]
                          .contract_name
                      }
                    </Box>
                    <Box>
                      Contract Ticker =&gt;{" "}
                      {
                        transferHistory.data.data.items[index].transfers[0]
                          .contract_ticker_symbol
                      }
                    </Box>
                  </Box>
                )}
                {/* <Box>
                From =&gt; {transferHistory.data.data[index].from_address}
              </Box>
              <Box>To =&gt; {transferHistory.data.data[index].to_address}</Box>
              <Box>
                Gas spent =&gt; {transferHistory.data.data[index].gas_spent}
              </Box>
              <Box>
                Gas price =&gt; {transferHistory.data.data[index].gas_price}
              </Box> */}
                {/* <Box>
                Blocknumber =&gt; {transferHistory.data.data[index].blockNumber}
              </Box> */}
              </Box>
            );
          })}
        <Button onClick={(e) => getReceipt()}>receipt</Button>
      </Container>
    </Box>
  );
};

export default Transfers;
