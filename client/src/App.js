import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";

import ipfs from './ipfs';


import "./App.css";

class App extends Component {
  state = { ipfsHash:' ',web3: null, accounts: null, contract: null ,buffer:null,transactionHash:''};


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
        this.simpleStorageInstance=instance;

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
        this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
      this.setState({ web3, accounts, contract: instance }, this.runExample);
      
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

 


  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
   // await contract.methods.set('5').send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response= this.simpleStorageInstance.methods.get.call(accounts[0]);
    //const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ ipfsHash: response });
  };
   

    captureFile=(event)=>{
    
    event.preventDefault();
    const file=event.target.files[0]
    const reader=new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend=()=>{
      this.setState({buffer: Buffer(reader.result)})
      console.log('buffer',this.state.buffer)
    }

  }

/*
 onSubmit=async(event)=> {

//const { accounts, contract } = this.state;

    event.preventDefault();
    //const { accounts, contract } = this.state;
    await ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
           this.state.contract.methods.set(result[0].hash).send();
         console.log('ifpsHash', this.state.ipfsHash);
        this.setState({ipfsHash: result[0].hash });

      

       
      
    })
  }*/


 onSubmit=async(event)=> {

//const { accounts, contract } = this.state;

    event.preventDefault();
    //const { accounts, contract } = this.state;
    await ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
          // this.state.contract.methods.set(result[0].hash);
          this.simpleStorageInstance.methods.set(result[0].hash).send({from:this.state.accounts[0]});
          // ipfsHash= this.simpleStorageInstance.methods.get.call(accounts[0]);
            this.setState({ipfsHash:result[0].hash });
         console.log('ifpsHash', this.state.ipfsHash);
       

      

       
      
    })
  }





  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
         <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: 5 {this.state.buffer}</div>

                   
                    <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
      
        <h2>upload image</h2>
        <form onSubmit={this.onSubmit}>
         <input type ='file'  onChange={this.captureFile}/>
         <input type ='submit' />
         </form>
      </div>
    );
  }
}

export default App;
