"use client";

import React, { useEffect } from 'react'
import Header from './components/Header'
import List from './components/List' 
import Footer from './components/Footer'
import { useState } from 'react'
import { ethers } from 'ethers';
import config from "./config.json"
import Factory from './abis/Factory.json';

const page = () => {
  const [account, setAccount] = useState("")
  const [provider, setProvider] = useState(null)
  const [factory, setFactory] = useState(null)
  const [fee, setFee] = useState(null)

  async function loadBlockchainData(){
    const provider = new ethers.BrowserProvider(window.ethereum)
    setProvider(provider)
    
    const network = await provider.getNetwork()
    
    const factory = new ethers.Contract(config[network.chainId].factory.address, Factory, provider)// (address, abis, provider)
    setFactory(factory)

    // console.log("Network Chain ID:", network.chainId);
    // console.log("Factory Config:", config[network.chainId]);

    const fee = await factory.fee()
    console.log("fee",fee)
  }

  useEffect(()=>{
    loadBlockchainData()
  },[])

  return ( 
    <div className='bg-primary my-10 mx-20 w-full'>
      <Header account={account} setAccount={setAccount}/>
      <List/>
    </div>
  )
}

export default page
