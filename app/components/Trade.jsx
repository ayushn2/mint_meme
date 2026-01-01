import React from 'react'

const Trade = ({ toggleTrade, token, provider, factory}) => {
  return (
    <div className='list'>
      <h2>trade</h2>
      <div className='token__details'>
        <p>{token.name}</p>
      </div>
    </div>
  )
}

export default Trade
