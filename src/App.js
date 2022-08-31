import Header from './Header'; 
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Outlet />
    </div>
  );
}; 

export default App;