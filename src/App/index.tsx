import React , {Component} from "react";
import { Button, Message } from "semantic-ui-react";
import { unlockAccount } from "../api/web3";
//import "./index.css";
import useAsync from "../components/useAsync";
import { useWeb3Context } from "../contexts/Web3";
import YieldOfferingWallet from "./YieldOfferingWallet";
import Navbar from "./Navbar";
import SignInIssuer from "./SignInIssuer";
import Network from "./Network";
import AddOffering from './AddOffering';
import GetOfferings from './GetOfferings';
import GetContracts from './GetContracts';
import Home from './Home';

import { useYieldOfferingWalletContext } from "../contexts/TradeCenter";


 

function App() {
  const {
    state: { account, netId },
    updateAccount,
  } = useWeb3Context();



  const { pending, error, call } = useAsync(unlockAccount);

  async function onClickConnect() {
    const { error, data } = await call(null);

    if (error) {
      console.error(error);
    }
    if (data) {
      updateAccount(data);
    }
  }

  return (
    <div className="App">
      <div className="App-main">
        <Navbar />
        
      </div>
     
    </div>
  );
}

export default App;
