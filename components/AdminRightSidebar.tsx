import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import BankCard from './BankCard'
import { countTransactionCategories } from '@/lib/utils'
import Category from './Category'
import AdminTotalBalanceBox from './AdminTotalBalanceBox'
import AnimatedCounter from './AnimatedCounter'
import { calculateProfit, getLoanIssuedList } from '@/lib/actions/bank.actions'

// const AdminRightSidebar = ({ user, transactions, banks }: RightSidebarProps) => {
const AdminRightSidebar = async() => {
//   const categories: CategoryCount[] = countTransactionCategories(transactions);
//profit
const data = await calculateProfit();
const profit = data.profit;
//total investment

  const loanUsers = await getLoanIssuedList();
  // const loanUsers = await getActiveLoanList();
  const loanBalance = loanUsers.totalBalance;
  const loanData = loanUsers.data;
  const loan_users = loanUsers.totalUsers;


//total expenses
//tithe for month

// let color;
// if(profit > 0){
//   color = 'green';
// }else{
//   color = 'red';
// }


const date = new Date();
const year = date.getFullYear();

  return (
    <aside className="right-sidebar">
      <section className="flex flex-col ">
        <div className="profile-banner" />
        <div className="profile">
          <div className="profile-imging">
            <span className="text-5xl font-bold text-blue-500">A</span>
          </div>

          {/* <div className="profile-details"> */}
            {/* <h1 className='profile-name'>
              Admin
            </h1>
            <p className="profile-email">
              Pidtara Micro Credit Limited
            </p> */}
          
{/*           
          <h3 className="profile-email ">Profit</h3>

          <div className="total-balance-amount flex-center gap-2">
        {/* <div> */}
         {/* <AnimatedCounter amount={0} />
        </div>
        </div>  */} 
        <div className="profile-detailing">
          <h1 className='profile-name'>
              Summary
            </h1>
            <p className="profile-email">
              for the year {year}
            </p>
        </div>
        </div>
      </section>

      <section className="banks">
        {/* <div className="flex w-full justify-between"> */}
        <div>
          <h3 className="profile-email " style = {{color: profit > 0 ? "#06400b":"#923939"}}>Profit</h3>

          {/* <div className="total-balance-amounts flex-center gap-2" style = {{color: color}}> */}
          <div className="total-balance-amounts flex-center gap-2" style = {{color: profit > 0 ? "#06400b":"#923939"}}>
        {/* <div> */}
         <AnimatedCounter amount={profit} />
        </div> 



          {/* <Link href="/" className="flex gap-2">
            <Image 
               src="/icons/plus.svg"
              width={20}
              height={20}
              alt="plus"
            />
            <h2 className="text-14 font-semibold text-gray-600">
              Take Loan
            </h2>
          </Link> */}
              {/* <AdminTotalBalanceBox  
            accounts = {[]}
          
            availableBalance={0}
            totalUsers = {0}
          
            totalCurrentBalance={0}
            
          /> */}
        </div>
        

        {/* {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className='relative z-10'>
              <BankCard 
                key={banks[0].$id}
                account={banks[0]}
                userName={`${user.firstName} ${user.lastName}`}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <BankCard 
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={`${user.firstName} ${user.lastName}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )} */}

        {/* <div className="mt-10 flex flex-1 flex-col gap-6"> */}
        
        <div>
          <h2 className="profile-email">Total Investment</h2>

          <div className='space-y-5'>
            {/* {categories.map((category, index) => (
              <Category key={category.name} category={category} />
            ))} */}
          </div>
           <div className="total-balance-amounts flex-center " style = {{color: '#328088'}}>
         <AnimatedCounter amount={loanBalance} />
        </div>
        </div>

        <div>
          <h2 className="profile-email">Total Expenses</h2>

          <div className='space-y-5'>
            {/* {categories.map((category, index) => (
              <Category key={category.name} category={category} />
            ))} */}
          </div>
           <div className="total-balance-amounts flex-center ">
         <AnimatedCounter amount={data.expenses} />
        </div>
        </div>
        
        
        <div>
          <h2 className="profile-email" style = {{color: '#b029d9'}}>Tithe For The Month</h2>

          <div className='space-y-5'>
            {/* {categories.map((category, index) => (
              <Category key={category.name} category={category} />
            ))} */}
          </div>
           <div className="total-balance-amounts flex-center " style = {{color: '#b029d9'}}>
         <AnimatedCounter amount={data.tithe} />
        </div>
        </div>
      </section>
    </aside>
  )
}

export default AdminRightSidebar