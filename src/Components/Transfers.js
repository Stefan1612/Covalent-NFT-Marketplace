import React, { useState, useEffect } from "react";
import { Box, Button, Input, Typography, Container } from "@mui/material";
import axios from "axios";
const Transfers = ({ account, getCovalentData, transferHistory }) => {
  async function getCovalentBalance() {
    const url = new URL(
      `https://api.covalenthq.com/v1/42/address/${account}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=${process.env.REACT_APP_COVALENT_API_KEY}`
      /* `https://api.covalenthq.com/v1/42/address/${account}/transfers_v2?contract-address=${ContractAddress[42].NFT}&key=${process.env.REACT_APP_COVALENT_API_KEY}` */
    ); /* https://api.covalenthq.com/v1/1/address/demo.eth/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_e0658fffc54e4624b0d7842fed3 */

    const result = await axios.get(url);
    console.log(result);
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
      </Container>
    </Box>
  );
};

export default Transfers;
