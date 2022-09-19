import { useState, useEffect } from "react";
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

const contractConfig = {
  addressOrName: process.env.CONTRACT_ADDRESS,
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
    functionName: 'totalSupply'
  });
  const totalSupply = parseInt(data) || 0;
  if(totalSupply===5556) {
    return (
      <p>
        <Navigate to="/soldout" />
      </p>
    )
  }
  else {
    return (
      <p>
        Total minted: {totalSupply} of 5,556
      </p>
    )
  }
};

const MintButton = () => {
  const { address, isDisconnected } = useAccount();
  const [merkleProof, setMerkleProof] = useState(false);
  const [notInList, setNotInList] = useState(false);
  const mintPrice = ethers.utils.parseEther("0.01");

  useEffect(() => {
    fetch("https://lanyard.org/api/v1/proof?root=0x413f5958cf0ac66d093366114b624c2070fc17bcfc79b5924c18e30cfd21f078&unhashedLeaf="+address)
      .then((response) => response.json())
      .then((data) => {
        if(data.error) {
          setNotInList(true);
        }
        else {
          setMerkleProof(data?.proof);
        }
      });
  }, [address]);

  const { data, error, isError, write } = useContractWrite({
    mode: 'recklesslyUnprepared',
    ...contractConfig, 
    functionName: 'allowListMint'
  }); 

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
 
  const mint = (q) => { 
    write({
      recklesslySetUnpreparedArgs: [q, merkleProof],
      recklesslySetUnpreparedOverrides: {
        value: mintPrice.mul(q)
      }
    }); 
  }; 
  return (
    <div>
      <button className="inlineButton mintButton" disabled={isDisconnected||!write||!merkleProof} onClick={() => mint(1)}>
        {isLoading ? 'Minting...' : 'Mint 1 for 0.01 ETH'}
      </button> <button className="inlineButton mintButton" disabled={isDisconnected||!write||!merkleProof} onClick={() => mint(2)}>
        {isLoading ? 'Minting...' : 'Mint 2 for 0.02 ETH'}
      </button>
      {notInList && (
        <p>
          Your address is not in the allow list. You can try again when the public mint is open.
        </p>
      )}
      {isSuccess && (
        <p>
          Successfully minted! View on <a href={`https://${blockscanner}/tx/${data?.hash}`}>Etherscan</a>
        </p>
      )}
      {isError && (
        <p className="errorText">If you are reading this, it is probably because your address is not in the allowlist, the mint is closed, or because you tried to mint more than the maximum amount per wallet address.<br />
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
          <h2>Allow List Mint is now open!</h2>
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
