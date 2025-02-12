import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { get_transactions } from '@/lib/db/banking';

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
   const loggedIn = await getLoggedInUser();
 
  // const accounts = await getAccounts({ 
  //   userId: loggedIn.id 
  // })
  const savings = await getAccounts({ 
    userId: loggedIn?.id 
  })
  const accounts = {data:[], appwriteItemId:1}; 
  
  const data = savings?.data;

  const userId = loggedIn?.id;
  const transactions = await get_transactions(userId);
  

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
            user={loggedIn?.firstName || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox  
            accounts = {data}
            // accounts={[]}
            // totalBanks={accounts?.totalBanks}
            availableBalance={savings?.availableBalance}
            // totalBanks = {2}
            // totalCurrentBalance={6754}
            totalCurrentBalance={savings?.totalCurrentBalance}
            // totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>

        <RecentTransactions 
          accounts={data}
          transactions={transactions} 
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>

       <RightSidebar 
        user={loggedIn}
        transactions={transactions}
        banks={accountsData?.slice(0, 2)}
        />
    </section>
  )
}

export default Home