import { useEffect } from "react";
import { WagmiConfig, createClient, useAccount } from "wagmi";
import { ConnectKitProvider, ConnectKitButton, getDefaultClient } from "connectkit";

const infuraId = process.env.INFURA_ID; 

const client = createClient(
  getDefaultClient({
    appName: "Chublins",
    infuraId: infuraId
  }), 
); 

const ConnectedWallet = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  if (isConnecting) return <p>Connecting...</p>;
  if (isDisconnected) return <p>Disconnected</p>;
  return <p>Connected Wallet: {address}</p>;
}; 

// useEffect technique found here: https://bobbyhadz.com/blog/react-add-class-to-body-element
export default function Mint() { 
  return (
    useEffect(() => {
      document.body.classList.add('mint');

      return () => { 
        document.body.classList.remove('mint');
      }
    }, []),
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="rounded" options={{embedGoogleFonts: true,}}>
        <div className="Page">
          <h2>Mint coming soon!</h2>
          <ConnectedWallet />
          <ConnectKitButton />
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}; 