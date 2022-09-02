import { useParams } from 'react-router-dom';
import { ethers } from 'ethers'; 
import { 
  WagmiConfig, 
  createClient, 
  useContractRead, 
  useAccount, 
  chain } from "wagmi";
import { ConnectKitButton, getDefaultClient } from "connectkit";
import abiFile from '../abiFile.json';

const contractConfig = {
  addressOrName: '0x32A8BC93ca0E1b7eb3c282F8DDEC9e5cd9e898a5',
  contractInterface: abiFile,
};

const client = createClient(
  getDefaultClient({
    appName: "Chublins",
    infuraId: process.env.INFURA_ID, 
    chains: [chain.rinkeby]
  }), 
); 

const useGetOwner = (tokenId) => {
  const { data, isSuccess } = useContractRead({
    ...contractConfig, 
    functionName: 'ownerOf', 
    args: tokenId
  }); 
  if(isSuccess) { 
    return String(data); 
  }
  else { 
    return "Unknown"; 
  }
}

const ManageToken = (props) => {
  if(props.ownerAddress == props.userAddress) { 
    return (
      <>
        <h3>Manage</h3>
        <p>You are the owner of this Chublin! <em>Management features are coming soon...</em></p>
      </>
    )
  }
  else { 
    return (
      <>
        <h3>Manage</h3>
        <p>You are not the owner of this Chublin, so you cannot manage it!</p>
      </>
    )
  }
}

export default function Token() { 
  const { tokenId } = useParams(); 
  const { address, isDisconnected } = useAccount(); 
  const { data, isSuccess } = useContractRead({
    ...contractConfig, 
    functionName: 'tokenURI', 
    args: tokenId
  }); 
  const tokenOwner = useGetOwner(tokenId); 
  if(isSuccess) { 
    const tokenURI = String(data); 
    const tokenArray = tokenURI.split(','); 
    const tokenJSONString = ethers.utils.toUtf8String(ethers.utils.base64.decode(tokenArray[1])); 
    const tokenJSON = JSON.parse(tokenJSONString); 
    const tokenName = "Chublin #"+tokenId;  
    const imageType = tokenJSON.image.charAt(0)=='h' ? "PNG" : "SVG"; 
    let licenseStatus = "ARR"; 
    const openSeaURL = "https://opensea.io/assets/ethereum/"+contractConfig.addressOrName+"/"+tokenId; 
    const looksRareURL = "https://looksrare.org/collections/"+contractConfig.addressOrName+"/"+tokenId; 
    return (
      <div>
        <div className="chublinCard">
          <p className="chublinImageContainer">
            <img className="chublinImage" src={tokenJSON.image} alt={tokenName} width="300" height="300" />
          </p>
          <div className="chublinTraitsContainer">
            <dl>
              <dt key="dt">Image Type</dt><dd key="dd">{imageType}</dd>
              {tokenJSON.attributes.map((pair, i) => {
                if(pair.trait_type=="License") { licenseStatus = pair.value; }
                return (
                  <><dt key={`dt${i}`}>{pair.trait_type}</dt><dd key={`dd${i}`}>{pair.value}</dd></>
                )
              })}
            </dl>
          </div>
        </div>
        <div className="chublinDashboard">
          <p className="chublinOwnerInfo">Owner: <span className="chublinOwnerAddress">{tokenOwner}</span></p>
          <p><a href={openSeaURL}>View on OpenSea</a> | <a href={looksRareURL}>View on LooksRare</a></p>
          <p>Is this your Chublin? Connect to manage it:</p>
          <ConnectKitButton />
          {!isDisconnected && (
            <ManageToken 
              ownerAddress={tokenOwner} 
              userAddress={address} 
              tokenId={tokenId} 
              license={licenseStatus} 
              imageType={imageType} />
          )}
        </div>
      </div>
    )
  }
  else { 
    return (
      <div>Not found. The token you tried to view may be invalid.</div>
    )
  }
}; 