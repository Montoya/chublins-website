import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import Guide from './routes/Guide'; 
import Whitepaper from './routes/Whitepaper'; 
import Mint from './routes/Mint'; 
import Soldout from './routes/Soldout';
import Secret from './routes/Secret';
import View from './routes/View'; 
import Token from './routes/Token'; 
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Mint />} />
          <Route path="soldout" element={<Soldout />} />
          <Route path="guide" element={<Guide />} />
          <Route path="view" element={<View />}>
            <Route path=":tokenId" element={<Token />} />
          </Route>
          <Route path="whitepaper" element={<Whitepaper />} />
          <Route path="secret" element={<Secret />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
