import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import Update from './routes/Update';
import AllowListMint from './routes/AllowListMint';
import PublicMint from './routes/PublicMint';
import Guide from './routes/Guide';
import Whitepaper from './routes/Whitepaper';
import Soldout from './routes/Soldout';
import View from './routes/View';
import Token from './routes/Token';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Update />}/>
          <Route path="guide" element={<Guide />} />
          <Route path="whitepaperRtwb" element={<Whitepaper />} />
          <Route path="mint" element={<AllowListMint />}/>
          <Route path="secretPublicPlzg" element={<PublicMint />}/>
          <Route path="soldout" element={<Soldout />}/>
          <Route path="view" element={<View />}>
            <Route path=":tokenId" element={<Token />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
