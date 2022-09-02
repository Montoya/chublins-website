import { useEffect } from 'react'; 
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers'; 
import { 
  WagmiConfig, 
  createClient, 
  useContractRead, 
  chain } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import abiFile from '../abiFile.json';

const contractConfig = {
  addressOrName: '0x32A8BC93ca0E1b7eb3c282F8DDEC9e5cd9e898a5',
  contractInterface: abiFile,
};

const blockscanner = 'rinkeby.etherscan.io'; 

const client = createClient(
  getDefaultClient({
    appName: "Chublins",
    infuraId: process.env.INFURA_ID, 
    chains: [chain.rinkeby]
  }), 
); 

export default function Token() { 
  const { tokenId } = useParams(); 
  const { data, isSuccess } = useContractRead({
    addressOrName: contractConfig.addressOrName,
    contractInterface: contractConfig.contractInterface,
    functionName: 'tokenURI', 
    args: tokenId
  }); 
  if(isSuccess) { 
    const tokenURI = String(data); 
    const tokenArray = tokenURI.split(','); 
    const tokenJSONString = ethers.utils.toUtf8String(ethers.utils.base64.decode(tokenArray[1])); 
    const tokenJSON = JSON.parse(tokenJSONString); 
    return (
      <div>
        <img src={tokenJSON.image} width="300" height="300" />
      </div>
    )
  }
  else { 
    return (
      <div>Not found. The token you tried to view may be invalid.</div>
    )
  }
}; 