import React from 'react'
import List from './List'

const CreateToken = ({showCreate, setShowCreate,fee,provider,factory,account}) => {

  const toggleCreate = ()=>{
    showCreate ? setShowCreate(false) : setShowCreate(true)
  }

  return (
    <div className='flex justify-center align-center m-20 text-4xl'>
      <button onClick={factory && account && toggleCreate} className='glass-button cursor-pointer'>
        { !factory? (
          "Contract not Deployed"
        ) : !account?(
          "connect your wallet"
        ) : (
          "Create a new Token"
        )}

        
        </button>
      {showCreate && (
        <List toggleCreate={toggleCreate} fee={fee} provider={provider} factory={factory}/>
      )}
    </div>
  )
}

export default CreateToken