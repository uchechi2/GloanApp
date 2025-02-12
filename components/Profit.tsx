import AdminDoughnutChart from './AdminDoughnutChart';
import AnimatedCounter from './AnimatedCounter';
import DoughnutChart from './DoughnutChart';

const AdminTotalBalanceBox = (
  {
  accounts = [], availableBalance, totalCurrentBalance, totalUsers
}: 
AdminTotalBalanceBoxProps
) => {
// console.log(accounts, 'balancebox');

  // const totalCurrentBalance = 3000;
  // const totalBanks = 4

  const adminData = [{
    name: 'Admin',
    currentBalance: totalCurrentBalance,
    availableBalance: availableBalance
  }];
  return (
    <section className="total-balance">
      
      <div className="flex flex-col gap-6">
        
        <div className="flex flex-col gap-2">
          
          <div className="total-balance-amount flex-center gap-2">
            <AnimatedCounter amount={totalCurrentBalance} />
           
          </div>
           {/* <p className="total-balance-label" style ={{fontSize:11}}>
              Total Loan Given Out
          </p>
           <div className="total-balance-label " style ={{fontSize:17}}>
          <AnimatedCounter amount = {availableBalance} />
          </div> */}
        </div>
      </div>
    </section>
  )
}

export default AdminTotalBalanceBox