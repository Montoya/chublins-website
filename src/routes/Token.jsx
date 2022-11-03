import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import {
  useContractRead, 
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";
import abiFile from '../abiFile.json';
import contractAddress from '../contractAddress.json'; 

const contractConfig = {
  address: contractAddress,
  abi: abiFile,
};

let imageType = "SVG"; 

const useGetOwner = (tokenId) => {
  const { data, isSuccess } = useContractRead({
    ...contractConfig,
    functionName: 'ownerOf',
    args: [tokenId]
  });
  if(isSuccess) {
    return String(data);
  }
  else {
    return "Unknown";
  }
}

const ToggleOnChainArt = (props) => { 
  let {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    ...contractConfig,
    functionName: 'toggleOnChainArt',
    args: [props.tokenId]
  });
  let { data, error, isError, write } = useContractWrite(config);

  let { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  let switchButtonText = props.imageType==="PNG" ? 'Switch to on-chain SVG' : 'Switch to off-chain PNG'; 
  if(isSuccess) { 
    imageType = props.imageType==="PNG" ? "SVG" : "PNG"; 
  }
  return (
    <>
      {!isSuccess && ( 
        <button id="toggleButton" className="inlineButton" disabled={!write||isLoading} onClick={() => write?.()}>
          {isLoading ? 'Switching...' : switchButtonText}
        </button>
      )}
      {isSuccess && (
        <>
          Successfully switched! Remember to refresh the metadata on OpenSea to make sure the change is reflected on other platforms like Twitter.
        </>
      )}
      {(isPrepareError || isError) && (
        <>Error: {(prepareError || error)?.message}</>
      )}
    </>
  )
}

const ModifyLicense = (props) => {
  let licenseLevel = 0; 
  if(props.license==="CC BY-NC") { 
    licenseLevel = 1; 
  }
  else if(props.license==="CC0") { 
    licenseLevel = 2; 
  }

  const { data, error, isError, write } = useContractWrite({
    mode: 'recklesslyUnprepared',
    ...contractConfig, 
    functionName: 'modifyLicense'
  }); 

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
 
  const setLicense = (level) => { 
    write({
      recklesslySetUnpreparedArgs: [props.tokenId, level],
    }); 
  }; 
  return (
    <>
      {!isSuccess && licenseLevel<2 && (
        <><em>Remember, the below operations cannot be reversed! 
          Only do this if you are certain you want to permanently change the licensing for this Chublin.</em><br/><br/></>
      )}
      {!isSuccess && licenseLevel<1 && (
        <><button className="inlineButton setLicenseButton" disabled={!write||isLoading} onClick={() => setLicense(1)}>
          {isLoading ? 'Changing...' : 'Change license to CC BY-NC'}
        </button><br/><br/></>
      )}
      {!isSuccess && licenseLevel<2 && ( 
        <button className="inlineButton setLicenseButton" disabled={!write||isLoading} onClick={() => setLicense(2)}>
          {isLoading ? 'Changing...' : 'Change license to CC0'}
        </button>
      )}
      {licenseLevel>1 && (
        <em>This Chublin is licensed CC0 (public domain); the license cannot be modified further.</em>
      )}
      {isSuccess && (
        <>
          Successfully changed license level! Remember to refresh the metadata on OpenSea to make sure the change is reflected there too.
        </>
      )}
      {isError && (
        <>Error: {error?.message}</>
      )}
    </>
  )
}

const ManageToken = (props) => {
  if(props.ownerAddress === props.userAddress) {
    return (
      <>
        <h3>Manage</h3>
        <p>You own this Chublin!</p>
        <p>
          <ToggleOnChainArt 
            tokenId={props.tokenId} 
            imageType={props.imageType}
            />
        </p>
        <p>
          <ModifyLicense 
            tokenId={props.tokenId} 
            license={props.license} 
            />
        </p>
      </>
    )
  }
  else {
    return (
      <>
        <h3>Manage</h3>
        <p>You do not own this Chublin, so you cannot manage it!</p>
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
    args: [tokenId]
  });
  const tokenOwner = useGetOwner(tokenId);
  if(isSuccess) {
    const tokenURI = String(data);
    const tokenArray = tokenURI.split(',');
    const tokenJSONString = ethers.utils.toUtf8String(ethers.utils.base64.decode(tokenArray[1]));
    const tokenJSON = JSON.parse(tokenJSONString);
    let licenseStatus = "ARR";
    tokenJSON.attributes.map((pair, i) => { 
      if(pair.trait_type==="License") { licenseStatus = pair.value; }
      return true;
    }); 
    const tokenName = "Chublin #"+tokenId;
    imageType = tokenJSON.image.charAt(0)==='h' ? "PNG" : "SVG";
    const openSeaURL = "https://opensea.io/assets/ethereum/"+contractConfig.addressOrName+"/"+tokenId;
    const looksRareURL = "https://looksrare.org/collections/"+contractConfig.addressOrName+"/"+tokenId;
    const pngURL = "https://chublins.xyz/png/"+tokenId+".png"; 
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
                return (
                  <><dt key={`dt${i}`}>{pair.trait_type}</dt><dd key={`dd${i}`}>{pair.value}</dd></>
                )
              })}
            </dl>
          </div>
        </div>
        <div className="chublinDashboard">
          <p className="chublinOwnerInfo">Owner: <span className="chublinOwnerAddress">{tokenOwner}</span></p>
          <p>View on <a href={openSeaURL}>OpenSea</a> | <a href={looksRareURL}>LooksRare</a> | <a href={pngURL}>Download PNG</a></p>
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
