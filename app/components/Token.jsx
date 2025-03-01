import React from 'react'
import { CldImage } from 'next-cloudinary';
import { ethers } from 'ethers';

const Token = ({toggleTrade, token}) => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <CldImage
          width={200}
          height={200}
          src= {token.image}
          alt="Description of my image"
      />
      <p>created by {token.creator.slice(0,6) + "..." + token.creator.slice(-4)}</p>
      <p>market cap: {ethers.formatUnits(token.raised, 18)} eth</p>
      <p>{token.name}</p>
      <p>{token.symbol}</p>
      
    </div>
  )
}

export default Token
