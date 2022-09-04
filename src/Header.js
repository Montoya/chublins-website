// import { NavLink } from "react-router-dom"; 
import hexagon from './hexagon.svg';

// removed: <NavLink to="whitepaper">Whitepaper</NavLink>
const Header = () => {
  return (
    <nav>
      <div>
        <img src={hexagon} className="Chublin-logo" alt="logo" /> 
        <h1>Chublins</h1>
        <a href="https://twitter.com/ChublinsNFT">Twitter</a>
      </div>
    </nav>
  ); 
}; 

/*

        <NavLink to="/">Mint</NavLink>
        <NavLink to="view">Viewer</NavLink>
        <NavLink to="guide">Guide</NavLink>
*/

export default Header; 