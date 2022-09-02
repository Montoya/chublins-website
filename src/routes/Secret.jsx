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

const MintProgress = () => {
  const { data, isError, isLoading } = useContractRead({
    addressOrName: contractConfig.addressOrName,
    contractInterface: contractConfig.contractInterface,
    functionName: 'totalSupply'
  }); 
  const totalSupply = parseInt(data); 
  if(totalSupply==8888) { 
    return (
      <p>
        <Navigate to="/soldout" />
      </p>
    )
  }
  else { 
    return (
      <p>
        Total minted: {totalSupply} of 8,888
      </p>
    )
  }
}; 

const MintButton = () => {
  const { isDisconnected } = useAccount();
  const [amount, setAmount] = useState(1); 
  const mintPrice = ethers.utils.parseEther("0.024"); 

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
      <input id="mintQuantity" className="numberInput" type="number" min="1" max="10" value={amount} onChange={handleNumberInput}/> 
      for {24 * amount / 1000} ETH 
      <button id="mintButton" className="inlineButton" disabled={isDisconnected||!write} onClick={() => write?.({args: [amount]})}>
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
          <p>First, connect your wallet:</p>
          <ConnectKitButton showBalance="true" />
          <p>Then, select your quantity and click to mint! <em>Max 10 per transaction.</em></p>
          <MintButton />
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}; 