import React from 'react'
import { ethers } from 'ethers'

const List = ({ toggleCreate, fee, provider, factory}) => {

  async function listHandler(form){
    const name = form.get("name")
    const symbol = form.get("symbol")

    const signer = await provider.getSigner()

    const transaction = await factory.connect(signer).create(name, symbol, {value: fee})
    await transaction.wait()

    toggleCreate()
  }

  return (
    <div className='list'>
      <h1>List new token</h1>
      <div className='list_description'>
        <p>fee: {`${ethers.formatUnits(fee,18) } ETH`}</p>
      </div>

      <form action={listHandler}>
          <input type="text" name='name' placeholder='name'/>
          <input type="text" name='symbol' placeholder='symbol'/>
          <input type='submit' value="list"/>
          <input/>      
      </form>
      <button onClick={toggleCreate}>cancel</button>
    </div>
  )
}

export default List
