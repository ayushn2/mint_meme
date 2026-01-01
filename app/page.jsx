"use client";

import React, { useEffect } from 'react'
import Header from './components/Header'
import { useState } from 'react'
import { ethers } from 'ethers';
import config from "./config.json"
import images from './images.json'
import Factory from './abis/Factory.json';
import CreateToken from './components/CreateToken';
import Token from './components/Token';
import Trade from './components/Trade';

const page = () => {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [factory, setFactory] = useState(null)
  const [fee, setFee] = useState(null)
  const [tokens, setTokens] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [showTrade, setShowTrade] = useState(false)

  const toggleTrade = (token)=>{
    setToken(token)
    showTrade ? setShowTrade(false) : setShowTrade(true)
  }

  async function loadBlockchainData(){
    const provider = new ethers.BrowserProvider(window.ethereum)
    setProvider(provider)
    
    const network = await provider.getNetwork()
    
    const factory = new ethers.Contract(config[network.chainId].factory.address, Factory, provider)// (address, abis, provider)
    setFactory(factory)

    const fee = await factory.fee()
    console.log(fee)
    setFee(fee)

    const totalTokens = await factory.totalTokens()
    const tokens = []

    for(let i = 0; i < totalTokens; i++){
      const tokenSale = await factory.getTokenSale(i)
      if( i==6){
        break
      }
      const token = {
        token: tokenSale.token,
        name: tokenSale.name,
        symbol: tokenSale.symbol,
        creator: tokenSale.creator,
        sold: tokenSale.sold,
        raised: tokenSale.raised,
        isOpen: tokenSale.isOpen,
        image: images[i]
      }

      tokens.push(token)
     
    }
    setTokens(tokens)
    console.log(tokens)
  }

  useEffect(()=>{
    loadBlockchainData()
  },[])

  return ( 
    <div className='bg-primary my-10 mx-20 w-full'>
      <Header account={account} setAccount={setAccount}/>
      <CreateToken showCreate={showCreate} setShowCreate={setShowCreate} fee={fee} provider={provider} factory={factory} account={account}/>
      {showTrade && (
        <Trade toggleTrade={toggleTrade} token={token} provider={provider} factory={factory} />
      )}
      <div className='flex flex-col gap-6 justify-center items-center'>
      <div>
        <h1 className='text-4xl mb-6 p-8 token '>Tokens</h1>
      </div>
      <div className='grid grid-cols-4 gap-2 gap-y-4  m-6 w-full'>
        {
          tokens.map((token, index)=>(
            <Token key={index} tokenTrade={toggleTrade} token={token}/>
          ))
        }
      </div>
      </div>
      
    </div>
  )
}

export default page
