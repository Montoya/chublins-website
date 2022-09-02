import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom"; 
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
  addressOrName: '0x370a10B97109be720D7ac515B2aa3a8dBF25eb47',
  contractInterface: abiFile,
};

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

  const { 
    config, 
    error: prepareError, 
    isError: isPrepareError, 
  } = usePrepareContractWrite({
    addressOrName: '0xaf0326d92b97df1221759476b072abfd8084f9be', // '0x370a10B97109be720D7ac515B2aa3a8dBF25eb47', 
    contractInterface: ['function mint()'], 
    functionName: 'mint', 
    args: [] // [amount]
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
      <input id="mintQuantity" type="number" min="1" max="10" value={amount} onChange={handleNumberInput}/> 
      {amount} for {24 * amount / 1000} ETH 
      <button id="mintButton" disabled={isDisconnected||!write} onClick={() => write?.()}>
        {isLoading ? 'Minting...' : 'Mint!'}
      </button>
      {isSuccess && (
        <p>
          Successfully minted your NFT! View on <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
        </p>
      )}
      {(isPrepareError || isError) && (
        <p>Error: {(prepareError || error)?.message}</p>
      )}
    </div>
  )
}


// useEffect technique found here: https://bobbyhadz.com/blog/react-add-class-to-body-element
export default function Test() { 
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
          <ConnectKitButton />
          <p>Then, select your quantity and click to mint! <em>Max 10 per transaction.</em></p>
          <MintButton />
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}; 