"use client";

import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox';
import FundingForm from '@/components/FundingForm';
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'
import { get_active_loan_account, get_loan_account } from '@/lib/db/loan';
import LoanCard from '@/components/LoanCard';
import LoanPayment from '@/components/LoanPayment';

const MyLoans = async () => {
  const loggedIn = await getLoggedInUser();
  // const accounts = await get_loan_account({ 
  //   userId: loggedIn.id 
  // })

  const userId = loggedIn.id;
    const loanAccount = await get_active_loan_account(userId);
    const loanBalance = loanAccount[0]?.loanAmountReceived;

    let minimumPay = 0;
    const getMinimumPay = ()=>{
       
    if (loanAccount[0]?.tenure === 'weekly'){
      minimumPay = (loanBalance + (loanBalance * 0.15)) /12;
      if(loanAccount[0]?.currentLoanBalance < minimumPay) minimumPay = loanAccount[0].currentLoanBalance;
      console.log(minimumPay);
    } else if (loanAccount[0]?.tenure === 'monthly'){
      minimumPay = (loanBalance + (loanBalance * 0.2))/3;
      if(loanAccount[0]?.currentLoanBalance < minimumPay) minimumPay = loanAccount[0].currentLoanBalance;
      console.log(minimumPay);
    }
    }

    await getMinimumPay();

   

  return (
    <section className='flex'>
      <div className="my-banks" style={{width:550}}>
        <HeaderBox 
          title="Manage Loan Account"
          subtext="Effortlessly manage your loaning activites."
        />

        <div className="space-y-4">
          <h2 className="header-2">
            Your loans
          </h2>
          <div className="flex flex-wrap gap-6">
            {loanAccount && loanAccount.map((a: Account) => (
              <LoanCard 
                key={loanAccount.id}
                account={a}
                userName={loggedIn?.name}
              />
            ))}
         
          </div>
         
        </div>
        
      </div>
       <div>
            
            <LoanPayment 
                type="credit-account" 
                minimumPay = {minimumPay.toString()}
                userName={loanAccount[0]?.name}
                loanId ={loanAccount[0]?.id}
            />
          </div>
    </section>
  )
}

export default MyLoans