import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { ethers } from "ethers";
import {
  WagmiConfig,
  createClient,
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
  chain } from "wagmi";
import { ConnectKitProvider, ConnectKitButton, getDefaultClient } from "connectkit";
import abiFile from '../abiFile.json';
import contractAddress from '../contractAddress.json'; 

const contractConfig = {
  addressOrName: contractAddress,
  contractInterface: abiFile,
};

const blockscanner = 'etherscan.io';

const client = createClient(
  getDefaultClient({
    appName: "Chublins",
    infuraId: process.env.INFURA_ID,
    chains: [chain.mainnet]
  }),
);

const MintProgress = () => {
  const { data } = useContractRead({
    ...contractConfig, 
    contractInterface: abiFile,
    functionName: 'totalSupply'
  });
  const totalSupply = parseInt(data);
  if(totalSupply===1112) {
    return (
      <p>
        <Navigate to="/soldout" />
      </p>
    )
  }
  else {
    return (
      <p>
        Total minted: {totalSupply} of 1,112
      </p>
    )
  }
};

const MintButton = () => {
  const { isDisconnected } = useAccount();
  const mintPrice = ethers.utils.parseEther("0.01");

  const { data, error, isError, write } = useContractWrite({
    mode: 'recklesslyUnprepared',
    ...contractConfig, 
    functionName: 'mint'
  }); 

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
 
  const mint = (q) => { 
    write({
      recklesslySetUnpreparedArgs: [q],
      recklesslySetUnpreparedOverrides: {
        value: mintPrice.mul(q)
      }
    }); 
  }; 
  return (
    <div>
      <button className="inlineButton mintButton" disabled={isDisconnected||!write} onClick={() => mint(1)}>
        {isLoading ? 'Minting...' : 'Mint 1 for 0.01 ETH'}
      </button> <button className="inlineButton mintButton" disabled={isDisconnected||!write} onClick={() => mint(2)}>
        {isLoading ? 'Minting...' : 'Mint 2 for 0.02 ETH'}
      </button>
      {isSuccess && (
        <p>
          Successfully minted! View on <a href={`https://${blockscanner}/tx/${data?.hash}`}>Etherscan</a>
        </p>
      )}
      {(isError) && (
        <p className="errorText">If you are reading this, it is probably because the mint is closed or because you already minted the maximum amount for your wallet address.<br />
          Error: {error?.message}</p>
      )}
    </div>
  )
}

const FirstStep = () => {
  const { isDisconnected } = useAccount();
  return <p>{isDisconnected?"First, connect your wallet:":"Wallet connected!"}</p>;
}

const SecondStep = () => {
  const { isDisconnected } = useAccount();
  return <p>{isDisconnected?"Then":"Now"}, select your quantity and click to mint! <em>Max 2 per wallet.</em></p>
}


// useEffect technique found here: https://bobbyhadz.com/blog/react-add-class-to-body-element
export default function Secret() {
  return (
    useEffect(() => {
      document.body.classList.add('mint');
      return () => {
        document.body.classList.remove('mint');
      }
    }),
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="rounded" options={{embedGoogleFonts: true,}}>
        <div className="Page">
          <h2>Public Mint is now open!</h2>
          <MintProgress />
          <FirstStep />
          <ConnectKitButton showBalance="true" />
          <SecondStep />
          <MintButton />
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
  )
};
