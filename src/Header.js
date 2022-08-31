import { NavLink } from "react-router-dom"; 
import hexagon from './hexagon.svg';

const Header = () => {
  return (
    <nav>
      <div>
        <img src={hexagon} className="Chublin-logo" alt="logo" /> 
        <h1>Chublins</h1>
        <NavLink to="/">Mint</NavLink>
        <NavLink to="guide">Guide</NavLink>
        <NavLink to="whitepaper">Whitepaper</NavLink>
      </div>
    </nav>
  ); 
}; 

export default Header; 