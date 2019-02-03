import React, { Component } from "react";
import Lottery from './contracts/Lottery.json';
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = { web3: null, 
            accounts: null, 
            contract: null, 
            manager: null, 
            balance: null,
            amount: '' ,
            message: '',
            playeraddresses: null};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = Lottery.networks[networkId];
      const instance = new web3.eth.Contract(
        Lottery.abi,
        deployedNetwork && deployedNetwork.address,
      );
      
      const manager = await instance.methods.Manager().call();
      const balance = await instance.methods.GetBalance().call();
      const playeraddresses = await instance.methods.PlayerAddresses(0).call();
      
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, 
                      accounts, 
                      contract: 
                      instance, 
                      manager, 
                      balance,
                      playeraddresses}, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.log(error)
      alert(
        `Failed to load web3, accounts, or contract`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract, manager,balance ,web3,playeraddresses} = this.state;  
    //console.log(playeraddresses)
    //console.log(accounts)

   
  }; 

  formSubmit = async (event) => {
    event.preventDefault();
    const {web3,contract,accounts,amount} = this.state;
    if(amount <= 0.01) {
      this.setState({message: "You must enter more than 0.01 ether"})
      return 
    }
    this.setState({message: "Processing your request transaction"})
    //console.log(accounts[0])
    await contract.methods.EnterLottery().send({
      from: accounts[0],
      value: web3.utils.toWei(amount,"ether")
    });
    const balance = await contract.methods.GetBalance().call();
    this.setState({amount: '',
                   balance,
                   message: "Your reqeust transaction was accepted"})
    
  }

  onChange = (event) => {
    this.setState({amount : event.target.value});
  }

  getWinner= async (event) =>{
    const {contract,accounts} = this.state;
    this.setState({message: "Sending money to the winner"})
    await contract.methods.GetLotteryWinner().send({
      from: accounts[0]
    });
    this.setState({message: "done...."})
  }

  render() {
    const {web3,amount} = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Decentralized Lottery</h1>
        <h6>react,web3,solidity,truffle and Infura</h6>
      
        <p>Rinkeby Test: https://rinkeby.etherscan.io/address/0x428ad5cb7ab6b6365062056f523ec341bea54fb1</p>
          <p>
            Total Lottery Price: {(web3.utils.fromWei(this.state.balance.toString(),"ether")/1E18).toString().substr(0,5)} ether
        </p>
        <p>
          {this.state.message}
        </p>
        <form onSubmit={this.formSubmit}>

          <p>
            <input type="text" value={this.state.amount} onChange={this.onChange} placeholder="0.01"/>
            <button type="submit">Participate</button>
          </p>        
        </form>
        <div>
            <button onClick={this.getWinner}>Pick Winner</button>
            <p>Manager Address: {this.state.manager};</p>
            <p>Current Account: {this.state.accounts[0]}</p>
        </div>
        
      </div>
    );
  }
}

export default App;
