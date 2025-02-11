import React from 'react'
import { Wallet } from 'lucide-react';
import { ethers } from 'ethers';

const Header = ({account, setAccount}) => {

  const connectHandler = async ()=>{
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
    const account = ethers.getAddress(accounts[0])
    setAccount(account)
  }

  return (
    <div className='flex flex-row justify-between w-full'>
     <h1 className='text-4xl'>Mint MeMe</h1>
     { account ? (
      <button className='glass-button'>{account.slice(0,6) + '...' + account.slice(-4)}</button>
    ) : (
    <button onClick={connectHandler} className='glass-button flex flex-row gap-2 justify-center items-center cursor-pointer'>Connect <Wallet className='text-white text-sm' /></button>
  )}
     
    </div>
  )
}

export default Header
