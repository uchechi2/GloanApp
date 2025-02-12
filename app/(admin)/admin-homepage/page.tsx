import AdminLoanBalanceBox from '@/components/AdminLoanBalanceBox';
import AdminRightSidebar from '@/components/AdminRightSidebar';
import AdminTotalBalanceBox from '@/components/AdminTotalBalanceBox';
import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { calculateProfit, getAccount, getAccounts, getActiveLoanList, getExpenses, getLoanIssuedList, getLoanRequest, getTotalBalance } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { get_transactions } from '@/lib/db/banking';

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
   const loggedIn = await getLoggedInUser();
 
//   const accounts = await getAccounts({ 
//     userId: loggedIn.id 
//   })
//   const savings = await getAccounts({ 
//     userId: loggedIn.id 
//   })


const users = await getTotalBalance();

     const balance = users.totalBalance;
//   
  const data = users.data;
  const total_users = users.totalUsers;

const adminData = [{
  name: "admin",
  currentBalance: balance,
  availableBalance: balance
}]


  // const loanUsers = await getLoanIssuedList();
  const loanUsers = await getActiveLoanList();
  const loanBalance = loanUsers.totalBalance;
  const loanData = loanUsers.data;
  const loan_users = loanUsers.totalUsers;


  const loanRequest = await getLoanRequest();
  const loanRequestBalance = loanRequest.totalBalance;
  const loanRequestData = loanRequest.data;
  const loanRequest_users = loanRequest.totalUsers;

  const expenses = await getExpenses();
  const totalExpense = expenses.totalBalance;

  const expenseData = await calculateProfit();
  // const profit = data.profit;

    // const data = savings?.data[0];
    // const userId = loggedIn.id;
    // const currentBalance = parseInt(users.totalBalance);
    
//   const transactions = await get_transactions(userId);
  


  const accounts = {data:[], appwriteItemId:1}; 
  
//   const data = savings?.data;

//   const userId = loggedIn.id;
//   const transactions = await get_transactions(userId);
  
// getTotalBalance();
  const testBanks = 4;
const testBalance = 23000;
// console.log(loggedIn);

  // if(!accounts) return;
  
  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]
  // ?.appwriteItemId;

  const account = await getAccount({ appwriteItemId })

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          
          <HeaderBox 
            type="greeting"
            title="Welcome"
            user={'Admin'}
            subtext="Access business activities and manage loan reqest transactions efficiently."
          />

          <AdminTotalBalanceBox  
            accounts = {data}
          
            availableBalance={expenseData.monthlyExpenses}
            totalUsers = {total_users}
          
            totalCurrentBalance={balance}
            
          />
          
          <AdminLoanBalanceBox 
            accounts = {loanData} 
           
            availableBalance={loanRequestBalance}
            totalUsers = {loan_users}
           
            totalCurrentBalance={loanBalance}
            loanRequestUsers={loanRequest_users}
            loanRequestTotal={loanRequestBalance}
          />
         
          {/* <TotalBalanceBox  
            accounts = {data}
            // accounts={[]}
            // totalBanks={accounts?.totalBanks}
            availableBalance={savings?.availableBalance}
            // totalBanks = {2}
            // totalCurrentBalance={6754}
            totalCurrentBalance={savings?.totalCurrentBalance}
            // totalCurrentBalance={accounts?.totalCurrentBalance}
          /> */}
        </header>

        {/* <RecentTransactions 
          accounts={data}
          transactions={transactions} 
          appwriteItemId={appwriteItemId}
          page={currentPage}
        /> */}
      </div>

       {/* <RightSidebar 
        user={data}
        transactions={data}
        banks={accountsData?.slice(0, 2)}
        /> */}
       <AdminRightSidebar 
        
        />
    </section>
  )
}

export default Home