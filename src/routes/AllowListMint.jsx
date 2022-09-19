import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { ethers } from "ethers";
import {
  WagmiConfig,
  createClient,
  useAccount,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  chain } from "wagmi";
import { ConnectKitProvider, ConnectKitButton, getDefaultClient } from "connectkit";
import abiFile from '../abiFile.json';

const contractConfig = {
  addressOrName: '0x7034285f97FC9e3550fd7C041C32B7b4Bf7159C0',
  contractInterface: abiFile,
};

const blockscanner = 'etherscan.io';

const client = createClient(
  getDefaultClient({
    appName: "Chublins",
    infuraId: process.env.INFURA_ID,
    chains: [chain.rinkeby]
  }),
);

const MintProgress = () => {
  const { data, isError, isLoading } = useContractRead({
    addressOrName: '0x7034285f97FC9e3550fd7C041C32B7b4Bf7159C0',
    contractInterface: abiFile,
    functionName: 'totalSupply'
  });
  const totalSupply = parseInt(data);
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
  const [amount, setAmount] = useState(1);
  const [count, setCount] = useState(1);
  const mintPrice = ethers.utils.parseEther("0.01");

  useEffect(() => {
    fetch("https://lanyard.org/api/v1/proof?root=0xaa33c788faf218756b52829f65d58aa174703485a4399117fb20acc585d3732d&unhashedLeaf="+address)
      .then((response) => response.json())
      .then((data) => {
        if(data.error) {
          setNotInList(true);
        }
        else {
          setMerkleProof(data?.proof);
        }
      });
  }, []);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    ...contractConfig,
    functionName: 'allowListMint',
    args: [amount,merkleProof],
    overrides: {
      value:mintPrice.mul(amount)
    }
  });
  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleNumberInput = (e) => {
    setAmount(parseInt(e.target.value));
  };
  return (
    <div>
      <input id="mintQuantity" className="numberInput" type="number" min="1" max="2" value={amount} onChange={handleNumberInput}/>
      for {1 * amount / 100} ETH
      <button id="mintButton" className="inlineButton" disabled={isDisconnected||!write||!merkleProof} onClick={() => write?.({args: [amount,merkleProof]})}>
        {isLoading ? 'Minting...' : 'Mint!'}
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
      {(isPrepareError || isError) && (
        <p>Error: {(prepareError || error)?.message}</p>
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
