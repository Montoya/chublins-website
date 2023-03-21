import { useEffect } from "react";

export default function Soldout() {
  return (
    useEffect(() => {
      document.body.classList.add('mint');
      return () => { 
        document.body.classList.remove('mint');
      }
    }, []),
    <div className="Page">
      <h2>Welcome</h2>
      <p>Chublins is an on-chain art project. 443 Chublins are permanently immortalized on the Ethereum blockchain.</p>
      <p>You can use the <a href="/view">Chublins Viewer</a> to view each Chublin and also find the collection on <a href="https://opensea.io/collection/chublins-reborn">OpenSea</a> and <a href="https://looksrare.org/collections/0x87f01cE90A531F496bA2D6557D0348c5447895CE">LooksRare</a>.</p>
      <p>You can also learn more about Chublins by reading the <a href="/guide">guide</a>.</p>
      <p>&nbsp;</p>
      <p><em>Chublins are forever.</em></p>
    </div>
  )
}; 