"use client";

import HeaderBox from '@/components/HeaderBox'
import LoanForm from '@/components/LoanForm'
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

const Loan = async () => {
  const loggedIn = await getLoggedInUser();
   const accounts = await getAccounts({ 
    userId: loggedIn.id 
  })

if(!accounts) return;
  
  const accountsData =  accounts?.data;

  return (
    <section className="payment-transfer">
      <HeaderBox 
        title="Loan Request Form"
        subtext="Please provide any specific details or notes related to the loan request"
      />

      <section className="size-full pt-5">
        <LoanForm accounts={accountsData} />
      </section>
    </section>
  )
}

export default Loan 