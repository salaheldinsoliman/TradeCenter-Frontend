import React, { useState } from "react";
import { useYieldOfferingWalletContext } from "../contexts/TradeCenter";
//import DepositForm from "./AddOffering";
//import  VoteDead  from "./VoteDeadForm";
//import CreateTxModal from "./CreateTxModal";
import TransactionList from "./TransactionList";
import  PingContractForm  from "./PingContract";
import   CheckDeadForm from "./CheckDeadStatus";
import { stat } from "fs";
import useAsync from "../components/useAsync";
import Web3 from "web3";
import BN from "bn.js";

import { buyOffering } from "../api/TradeCenter";
import { Button, Form } from "semantic-ui-react";

import { useWeb3Context } from "../contexts/Web3";
import CreateTxModal from "./swap";



function MyWallet() {


  interface BuyOfferingParams {
    web3: Web3;
    account: string;
    params_obj:{
      ID:BN,
    offering_amount:BN,

      }
  }


  const { state } = useYieldOfferingWalletContext();


  const {
    state: { web3, account },
  } = useWeb3Context();

  const [open, openModal] = useState(false);
  const [inputs, setInput] = useState({ID:"", offering_amount: ""});
  const { pending, call } = useAsync<BuyOfferingParams, void>(
    ({ web3, account, params_obj }) => buyOffering(web3, account, params_obj)
  );


  const onChange = (name, value) => setInput(inputs => 
    
    
    ({
        
      ...inputs, [name]: value
    })     
);

  function onChangeExtract(e) {
      const {name, value} = e.target;
      onChange(name, value);
  }
 
  async function onSubmit(_e: React.FormEvent<HTMLFormElement>) {
    if (pending) {
      return;
    }

    if (!web3) {
      alert("No web3");
      return;
    }

    const ID = Web3.utils.toBN(inputs.ID);

    const offering_amount = Web3.utils.toBN(inputs.offering_amount);



    const zero = Web3.utils.toBN(0);

    const params_obj = {
      ID,
      offering_amount

    }

    if (1) {
      const { error } = await call({
        web3,
        account,
        params_obj
        
      });

      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        setInput({ID:"", offering_amount: ""});
        
      }
    }
  }

  return (
    <div>

<h3>Wallet Details</h3>
      <ul>
       
      <h3>Wallet</h3>
      <ul>
        USDT : {state.wallet[0]}
      </ul>

      <ul>
        ETH : {state.wallet[0]}
      </ul>

      <ul>
        WETH : {state.wallet[0]}
      </ul>

      <Button  onClick={() => openModal(true)}>
        Swap
      </Button>
      {open && <CreateTxModal open={open} onClose={() => openModal(false)} />}
      
      </ul>

    </div>
  );
}

export default MyWallet;
