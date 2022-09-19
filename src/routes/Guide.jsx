export default function Guide() {
  return (
    <div class="Page">
      <h2>Guide</h2>
      <h3>About Chublins</h3>
      <p>Chublins is an art project inspired by and born in online culture. The artwork is a celebration of how we express ourselves within the medium by which we connect, with references and homages to Emoticons, Anime, and even other NFT collections. The artwork for Chublins is generated and stored entirely onchain, comprised of over 50 unique traits combined in a variety of ways. Furthermore, Chublins incorporates two innovations at the contract level which set it apart from other NFT projects:</p>
      <ul>
        <li key="novel1">
          The ability for the owner of a token to determine the licensing rights of the associated artwork (either all rights reserved, <a href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC</a>, or <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a>)
        </li>
        <li key="novel2">
          The option to toggle the onchain SVG artwork to offchain PNG/GIF artwork for compatibility with platforms like Twitter
        </li>
      </ul>
      <h3>Mint Details</h3>
      <p>The mint will consist of an initial window for addresses in the allowlist and then an open public mint. Each wallet address can mint up to 2 Chublins for a price of 0.01 ETH each. The maximum supply is initially set to 5556 but can be reduced at any time.</p>
      <h3>Licensing</h3>
      <p>The brand and intellectual property for The Chublins Project is reserved by the project and its creator, Christian Montoya. Each individual artwork represents a unique derivative work and is permanently tied to an NFT on the Ethereum blockchain; thus, the owner of that NFT will be able to determine the licensing of that artwork. Each token has its licensing status stored on-chain, which is "All Rights Reserved" by default. An any time, the owner of the artwork (represented by an ownership claim in the form of the NFT) can call an on-chain function in the Chublins contract to modify the license for that artwork. <b>This modification is one-way</b>, meaning that the license can be modified to be more permissive, but it cannot be modified to be less permissive. The reason for this is that once you grant the rights for anyone to use an artwork for either non-commercial use (<a href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC</a>) or for any use (<a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a>), you cannot revoke those rights later on. The granting of those rights, by placing something under a CC BY-NC license or a CC0 license, is "in perpetuity." Also, a Chublin with a CC BY-NC license can later be modified to have a CC0 license. <em>As an aside, this means that when a Chublins token is sold, the buyer will be accepting the license terms for that token as-is.</em></p>
      <p>The license status of each token is represented by a trait, so it will be possible to filter Chublins by their license, and to track how many are granted CC BY-NC status or CC0 status. Over time, it will be interesting to note which Chublins are migrated to CC BY-NC licenses or CC0 licenses and which remain as "All Rights Reserved." Given sufficient public interest in releasing artworks to the public domain, buyers could seek to acquire Chublins that are not released into the public domain for the purpose of modifying their licenses and releasing them into the public domain.</p>
      <h3>Offchain artwork for supporting platforms like Twitter</h3>
      <p>While the Chublins artwork is generated and stored entirely on-chain in SVG format, this makes them incompatible with platforms like Twitter and Instagram. To mitigate this, the owner of each token can use an on-chain function in the Chublins contract to toggle the artwork to use an off-chain PNG instead. After minting is complete, all Chublins artwork will be backed up off-chain and this toggling feature will be made available. Holders of Chublins tokens will be able to toggle between on-chain SVG and off-chain PNG at any time. <em>Please note that after using this toggle function, holders should go to OpenSea and use the "Refresh Metadata" feature to update the cached image of their Chublin.</em></p>
      <h3>Roadmap</h3>
      <p>The Chublins Project has no formal roadmap and no plans to implement community features (such as a Discord server). All information about Chublins will be shared via this website and <a href="https://twitter.com/ChublinsNFT">the official Twitter account</a>. Future plans for Chublins will be determined after minting is complete.</p>
      <h3>Acknowledgements</h3>
      <p>Chublins is built with open-source projects (ConnectKit, wagmi, ethers, React, gh-pages, Azuki ERC-721a, and goblintown.wtf) and inspired by a variety of NFT collections (Loot, Nouns DAO, ChainFaces HD, Alt Nouns, Bibos, Tubby Cats, Froyo Cats, Chubbiverse, Cupcats, Sappy Seals, and Flowers, to name a few).</p>
      <h3>Disclaimer</h3>
      <p>The Chublins Project and its creator, Christian Montoya, provide the website, smart contract, and its connected services “as is” and “as available,” without warranty of any kind. Without limiting this, we expressly disclaim all warranties, whether expressed, implied or statutory, regarding the website. Using applications on the blockchain is associated with a high degree of technological and/or other risks.</p>
      <p>NFTs are non-fungible tokens representing ownership of a digital artwork only. Accordingly, no information on this website (or any other documents mentioned therein) is or may be considered to be advice or an invitation to enter into an agreement for any investment purpose. Further, as NFTs represent artwork, nothing on this website qualifies or is intended to be an offering of securities in any jurisdiction nor does it constitute an offer or an invitation to purchase shares, securities or other financial products.</p>
      <p>Due to the artistic nature of the project, neither this document nor the NFTs have been registered with or approved by any regulator in any jurisdiction. It remains in your responsibility to assure that the purchase of the NFTs and the associated artwork is in compliance with laws and regulations in your jurisdiction.</p>
      <p>We undertake no obligation to publicly update or revise any information or opinions published on the website. We reserve the right to amend the information at any time without prior notice.</p>
    </div>
  )
};
