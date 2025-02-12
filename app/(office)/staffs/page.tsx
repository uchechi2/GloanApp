import ExpenditureForm from '@/components/ExpenditureForm';
import HeaderBox from '@/components/HeaderBox'
import LoanForm from '@/components/LoanForm'
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

const Expenditure = async () => {
//   const loggedIn = await getLoggedInUser();
//    const accounts = await getAccounts({ 
//     userId: loggedIn.id 
//   })

// if(!accounts) return;
  
//   const accountsData =  accounts?.data;
  const accountsData =  [];

  return (
    <section className="payment-transfer" style={{width:'900px'}}>
      <HeaderBox 
        title="Recurrent Expenditures"
        subtext="Please provide details of expenses"
      />

      <section className="size-full pt-5">
        <ExpenditureForm />
      </section>
    </section>
  )
}

export default Expenditure 