import HeaderBox from '@/components/HeaderBox'
import { Pagination } from '@/components/Pagination';
import TransactionsTable from '@/components/TransactionsTable';
import LoanTransactionTable from '@/components/LoanTransactionTable';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { formatAmount } from '@/lib/utils';
import { get_transactions } from '@/lib/db/banking';
import React from 'react'
import { get_loan_account, get_loan_transactions } from '@/lib/db/loan';

const TransactionHistory = async ({ searchParams: { id, page }}:SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ 
    userId: loggedIn.id 
  })

   const savings = await getAccounts({ 
    userId: loggedIn.id 
  })

    const data = savings?.data[0];
    const userId = loggedIn.id;
    const loanAccount = await get_loan_account(userId);
    let currentBalance = 0;
     loanAccount.map((a:any)=>{
    currentBalance = parseInt(currentBalance + a.currentLoanBalance);
  })
  const transactions = await get_loan_transactions(userId);

 console.log('loan display', currentBalance);


  if(!accounts) return;
  
  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId })


const rowsPerPage = 10;
// const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);
const totalPages = Math.ceil(transactions.length / rowsPerPage);

const indexOfLastTransaction = currentPage * rowsPerPage;
const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

// const currentTransactions = account?.transactions.slice(
const currentTransactions = transactions.slice(
  indexOfFirstTransaction, indexOfLastTransaction
)
  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox 
          title="Loan History"
          subtext="See your loan details and transactions."
        />
      </div>

      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            {/* <h2 className="text-18 font-bold text-white">{account?.data.name}</h2> */}
            {/* <h2 className="text-18 font-bold text-white">{data.name}</h2> */}
            <p className="text-14 text-blue-25">
              {savings?.data[0].name}
            </p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● {data.mask}
            </p>
          </div>
          
          <div className='transactions-account-balance'>
            <p className="text-14">Current loan balance</p>
            {/* <p className="text-24 text-center font-bold">{formatAmount(account?.data.currentBalance)}</p> */}
            <p className="text-24 text-center font-bold">{formatAmount(currentBalance)}</p>
          </div>
        </div>

        <section className="flex w-full flex-col gap-6">
          <LoanTransactionTable 
            transactions={currentTransactions}
          />
            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={currentPage} />
              </div>
            )}
        </section>
      </div>
    </div>
  )
}

export default TransactionHistory