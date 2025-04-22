import { getLoanUserdetail } from '@/lib/actions/bank.actions';
import React, { useState } from 'react'


const LoanDetails = ({setShow, data}:any) => {

    // const [show, setShow] = useState(true)
    // const [message, setMessage] = useState('hello world')

    

     console.log(data);

  return (
    <div>
        <div className="message">
            <div className='details'>
                <div className="close" onClick={()=>{setShow(false)}}>X</div>
                
                <div className="item">
                    <div className="title">
                        BUSSINESS/COMPANY NAME:
                    </div>
                    <div className="description">
                        {/* {data.bussinessName} */}
                        {data.business_company_name}
 
                    </div>
                </div>
                <div className="item">
                    <div className="title">
                        BUSINESS/COMPANY ADDRESS:
                    </div>
                    <div className="description">
                        {/* {data.bussinessAddress} */}
                        {data.business_company_address}
                    </div>
                </div>
                <div className="item">
                    <div className="title">
                        OCCUPATION:
                    </div>
                    <div className="description">
                        {data.occupation}
                    </div>
                </div>
                         

                <div className="item">
                    <div className="title">
                        PHONE NUMBER:
                    </div>
                    <div className="description">
                        {data.mobileNo}
                    </div>
                </div>
                
                <div className="item">
                    <div className="title">
                        ADDRESS:
                    </div>
                    <div className="description">
                        Bukuru
                    </div>
                </div>
                
                <div className="item">
                    <div className="title">
                        GUARANTOR:
                    </div>
                    <div className="description">
                        {data.guarantorName}
                    </div>
                </div>


                <div className="item">
                    <div className="title">
                        GUARANTORS OCCUPATION:
                    </div>
                    <div className="description">
                        {data.guarantorOccupation}
                    </div>
                </div>
                <div className="item">
                    <div className="title">
                        GUARANTORS CONTACT:
                    </div>
                    <div className="description">
                        {data.guarantorContact}
                    </div>
                </div>
                <div className="item">
                    <div className="title">
                        GUARANTORS ADDRESS:
                    </div>
                    <div className="description">
                        {data.guarantorAddress}
                    </div>
                </div>
                
                <button className='btn' onClick={()=>{setShow(false)}}>Ok</button>
            </div>
        </div>
    </div>
  )
}

export default LoanDetails
