import { useState } from "react";
import { useNavigate, Navigate, Outlet } from "react-router-dom";
import {
  WagmiConfig,
  createClient,
  useContractRead,
  chain } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import abiFile from '../abiFile.json';

const contractConfig = {
  addressOrName: process.env.CONTRACT_ADDRESS,
  contractInterface: abiFile,
};

let maxTokens = 1;

const client = createClient(
  getDefaultClient({
    appName: "Chublins",
    infuraId: process.env.INFURA_ID,
    chains: [chain.mainnet]
  }),
);

const TotalSupply = () => {
  const { data, isSuccess } = useContractRead({
    addressOrName: contractConfig.addressOrName,
    contractInterface: contractConfig.contractInterface,
    functionName: 'totalSupply'
  });
  const totalSupply = parseInt(data);
  if(isSuccess && totalSupply > 0) {
    maxTokens = totalSupply - 1;
    return <p>{totalSupply} Chublins have been born of the blockchain!</p>
  }
  else {
    return <Navigate to="/" />
  }
};

const ViewButton = () => {
  const navigate = useNavigate();
  const [tokenId, setTokenId] = useState(0);

  const handleNumberInput = (e) => {
    setTokenId(parseInt(e.target.value));
  };
  const handleViewAction = (e) => {
    const destination = "/view/"+tokenId;
    navigate(destination);
  };
  return (
    <p>
      <input id="tokenToView" className="numberInput" type="number" min="0" max={maxTokens} value={tokenId} onChange={handleNumberInput}/>
      <button id="viewButton" className="inlineButton" onClick={handleViewAction}>View</button>
    </p>
  )
};

export default function View() {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="rounded" options={{embedGoogleFonts: true,}}>
        <div className="Page">
          <h2>Chublins Viewer</h2>
          <TotalSupply />
          <p>Enter the token ID of a Chublin to view it. If you are the owner of that Chublin, you will be able to manage it too.</p>
          <ViewButton />
          <Outlet />
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
  )
};
