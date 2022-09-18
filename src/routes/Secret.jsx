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
    addressOrName: contractConfig.addressOrName,
    contractInterface: contractConfig.contractInterface,
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
  const { isDisconnected } = useAccount();
  const [amount, setAmount] = useState(1); 
  const mintPrice = ethers.utils.parseEther("0.01"); 

  const { 
    config, 
    error: prepareError, 
    isError: isPrepareError, 
  } = usePrepareContractWrite({
    ...contractConfig, 
    functionName: 'mint', 
    args: amount, 
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
      <button id="mintButton" className="inlineButton" disabled={isDisconnected||!write} onClick={() => write?.({args: [1]})}>
        {isLoading ? 'Minting...' : 'Mint!'}
      </button> 
      <button id="mintTwoButton" className="inlineButton" disabled={isDisconnected||!write} onClick={() => write?.({args: [2]})}>
        {isLoading ? 'Minting...' : 'Mint!'}
      </button>
      {isSuccess && (
        <p>
          Successfully minted your Chublins! View on <a href={`https://${blockscanner}/tx/${data?.hash}`}>Etherscan</a>
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
  return <p>{isDisconnected?"Then":"Now"}, click to mint 1 or 2! <em>Max 2 per wallet.</em></p>
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
          <h2>Mint is now open!</h2>
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