import HeaderBox from '@/components/HeaderBox'
import { Pagination } from '@/components/Pagination';
import TransactionsTable from '@/components/TransactionsTable';
import { getAccount, getAccounts, getLoanRequest, releaseLoan } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { formatAmount } from '@/lib/utils';
import { get_transactions } from '@/lib/db/banking';
import React from 'react'
import AccountsTable from '@/components/AccountsTable';
import LoanRequestTable from '@/components/LoanRequestTable';
import LoanReleaseTable from '@/components/LoanReleaseTable';

const TransactionHistory = async ({ searchParams: { id, page }}:SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  // const accounts = await getAccounts({ 
  //   userId: loggedIn.id 
  // })

  //  const savings = await getAccounts({ 
  //   userId: loggedIn.id 
  // })

  const users = await releaseLoan();

    // const data = savings?.data[0];
    // const userId = loggedIn.id;
    // const currentBalance = parseInt(users.totalBalance);
    const balance = users.totalBalance;
//   const transactions = await get_transactions(userId);
  const transactions = users.data;



//   if(!accounts) return;
  
  // const accountsData = accounts?.data;
  // const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  // const account = await getAccount({ appwriteItemId })


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
          title="Release Loans"
          subtext="Release loans for this persons."
        />
      </div>

      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            {/* <h2 className="text-18 font-bold text-white">{account?.data.name}</h2> */}
            {/* <h2 className="text-18 font-bold text-white">{data.name}</h2> */}
            <p className="text-14 text-blue-25">
              {/* {savings?.data[0].name} */} Pidtara Micro Credit Limited
            </p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● 
              {/* {users.mask} */}
            </p>
          </div>
          
          <div className='transactions-account-balance'>
            <p className="text-14">Current Total Loan Request</p>
            {/* <p className="text-24 text-center font-bold">{formatAmount(account?.data.currentBalance)}</p> */}
            <p className="text-24 text-center font-bold">{formatAmount(balance)}</p>
          </div>
        </div>

        <section className="flex w-full flex-col gap-6">
          <LoanReleaseTable 
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