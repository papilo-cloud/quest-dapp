import { useEffect, useState } from 'react';
import {Contract, ethers, providers} from 'ethers';
import './App.css'
import {Buffer} from 'buffer'
import contract from './contracts/StackUp.json';
import { formatUnits } from 'ethers/lib/utils';

window.Buffer = Buffer;
const contractAddr = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const abi = contract.abi;


function App() {

  const [currentAcct, setCurrentAcct] = useState(null);
  const [adminAddr, setAdminAddr] = useState('');
  const [allQuestsInfo, setAllQuestsInfo] = useState([])
  const [userQuestStatuses, setUserQuestStatuses] = useState(null);
  const [questId, setQuestId] = useState('')

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

const getQuestsInfo = async () => {
    try {
        const provider = new providers.Web3Provider(window.ethereum)
        const stackupContract = new Contract(contractAddr, abi, provider)

        const nextQuestId = await stackupContract.nextQuestId()
        const formatQuestId = formatUnits(nextQuestId, 0)

        let allQuests = []
        let thisQuest;

        for (let i = 0; i < formatQuestId; i++) {
          thisQuest = await stackupContract.quests(i);
          allQuests.push(thisQuest)
        }

        setAllQuestsInfo(allQuests)
    } catch (err) {
        console.log('getQuestsInfo...')
        console.log(err)
    }
}

const getUserQuestStatus = async () => {
    try {
      if (currentAcct) {
        const provider = new providers.Web3Provider(window.ethereum)
        const stackupContract = new Contract(contractAddr, abi, provider)

        const nextQuestId = await stackupContract.nextQuestId()
        const formatQuestId = formatUnits(nextQuestId, 0)
        const questStatusMapping = {
          0: 'Not Joined',
          1: 'Joined',
          2: 'Submitted'
        }

        let userStatuses = [];
        let thisQuest;

        for (let i = 0; i < formatQuestId; i++) {
          let thisQuestStatus = []
          thisQuest = await stackupContract.quests(i);

          let thisQuestTitle = thisQuest[2]
          let thisQuestId = thisQuest[0]

          thisQuestStatus.push(thisQuestTitle)
          const questStatusId = await stackupContract.playerQuestStatuses(currentAcct, thisQuestId);
          const statusId = questStatusId.toString()
          thisQuestStatus.push(questStatusMapping[statusId])

          userStatuses.push(thisQuestStatus)
          
        }
        setUserQuestStatuses(userStatuses)
      }
    } catch (err) {
      console.log('getUserQuestStatuses error...')
      console.log(err)
    }
}

const joinQuestHandler = async () => {
    try {
        if (!questId) {
            alert('Input quest ID before proceeding')
        } else {
          const provider = new providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          const stackupContract = new Contract(contractAddr, abi, signer)
          console.log('apple')

          const tx = await stackupContract.joinQuest(questId)
          await tx.wait()
        }
    } catch (err) {
        console.log(err)
        alert('error encountered! refer to console log to debug')
    }
}

const submitQuestHandler = async () => {
  try {
    if (!questId) {
      alert('Input quest ID before proceeding')
    } else {
      const provider = new providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const stackupContract = new Contract(contractAddr, abi, signer)
      console.log('first')

      const tx = await stackupContract.submitQuest(questId)
      await tx.wait()
    }
  } catch (err) {
      console.log(err)
      alert('error encountered! refer to console log to debug')
  }
}

 useEffect(() => {
      getAdminAddr();
      getQuestsInfo();
      getUserQuestStatus();
 }, [currentAcct]);

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
            <h2>All Quests:</h2>
            <div>
              {
                allQuestsInfo &&
                  allQuestsInfo.map((quest, x) => 
                    <div key={x}>
                      <h4>{quest[2]}</h4>
                      <ul>
                        <li>questId: {quest[0].toString()}</li>
                        <li>number of players: {quest[1].toString()}</li>
                        <li>reward: {quest[3]}</li>
                        <li>number of rewards available: {quest[4].toString()}</li>
                      </ul>
                    </div> )
              }
            </div>
            <h2>Your Quest Statuses:</h2>
            <div>
                <ul>
                    {
                      userQuestStatuses &&
                        userQuestStatuses.map((quest, idx) =>
                          <div key={idx}>
                              <li>
                                  {quest[0]} - {quest[1]}
                              </li>
                          </div>
                        )
                    }
                </ul>
            </div>
            <h2>Actions:</h2>
            <div>
              <input type="text" 
                  placeholder='Quest Id' 
                  value={questId}
                  onChange={(e) => setQuestId(e.target.value)} />
              <button onClick={joinQuestHandler}>Join Quest</button>
              <button onClick={submitQuestHandler}>Submit Quest</button>
            </div>
        </div>
    </>
  )
}

export default App
