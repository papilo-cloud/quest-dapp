import { useEffect, useState } from 'react';
import {Contract, ethers, providers} from 'ethers';
import './App.css'
import {Buffer} from 'buffer'
import contract from './contracts/StackUp.json';

window.Buffer = Buffer;
const contractAddr = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const abi = contract.abi;


function App() {

  const [currentAcct, setCurrentAcct] = useState(null);
  const [adminAddr, setAdminAddr] = useState('');

  const connectWalletHandler = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({
              method: 'eth_requestAccounts'
            });
            setCurrentAcct(accounts[0])
            console.log('Found accounts:', accounts[0])

        } catch (err) {
            console.error(err)
        }
    } else {
        console.log('Please install metamask')
    }
  }

const getAdminAddr = async () => {
  if (typeof window.ethereum === 'undefined') {
    console.log('MetaMask is not installed.');
    return;
  }

  try {
    const provider = new providers.Web3Provider(window.ethereum);
    const stackupContract = new Contract(contractAddr, abi, provider);
    const admin = await stackupContract.admin();
    console.log("adminAddr:", admin);
    setAdminAddr(admin);
  } catch (err) {
    console.log("getAdminAddr error...");
    console.error(err);
  }
};

 useEffect(() => {
      getAdminAddr();
 }, []);

  return (
    <>
        <div className="container">
            <h1>Build Your First Dapp</h1>
            <h4>By: DeadEazy</h4>
            {
              currentAcct ? 
              <h4>Wallet connected: {currentAcct}</h4> :
              <button onClick={connectWalletHandler}>Connect Wallet</button>
            }
            <h4>Admin address: {adminAddr ? adminAddr : 'Loading...'}</h4>
        </div>
    </>
  )
}

export default App
