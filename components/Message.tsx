import React from 'react'


const Message = ({setShow, message, setMessage}:any) => {

    

  return (
    <>
        <div className="message">
            <div className='content'>
                <div className="close" onClick={()=>{setShow(false); setMessage('')}}>X</div>
                <h1>{message}</h1>
                <button className='btn' onClick={()=>{setShow(false); setMessage('')}}>Ok</button>
            </div>
        </div>
    </>
  )
}

export default Message