"use client";

import React, { useEffect } from 'react'
import Header from './components/Header'
import List from './components/List' 
import Footer from './components/Footer'
import { useState } from 'react'
import { ethers } from 'ethers';
import config from "./config.json"
import Factory from './abis/Factory.json';
import CreateToken from './components/CreateToken';

const page = () => {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [factory, setFactory] = useState(null)
  const [fee, setFee] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  async function loadBlockchainData(){
    const provider = new ethers.BrowserProvider(window.ethereum)
    setProvider(provider)
    
    const network = await provider.getNetwork()
    
    const factory = new ethers.Contract(config[network.chainId].factory.address, Factory, provider)// (address, abis, provider)
    setFactory(factory)

    const fee = await factory.fee()
    console.log(fee)
    setFee(fee)
  }

  useEffect(()=>{
    loadBlockchainData()
  },[])

  return ( 
    <div className='bg-primary my-10 mx-20 w-full'>
      <Header account={account} setAccount={setAccount}/>
      <CreateToken showCreate={showCreate} setShowCreate={setShowCreate} fee={fee} provider={provider} factory={factory} account={account}/>
    </div>
  )
}

export default page
