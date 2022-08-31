import logo from './logo.svg';
import './App.css';
import { WagmiConfig, createClient } from "wagmi";
import { ConnectKitProvider, ConnectKitButton, getDefaultClient } from "connectkit";

const infuraId = process.env.INFURA_ID; 

const client = createClient(
  getDefaultClient({
    appName: "Chublins",
    infuraId: infuraId
  }), 
); 

function App() {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="rounded" options={{embedGoogleFonts: true,}}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Website under construction!
            </p>
            <ConnectKitButton />
          </header>
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
