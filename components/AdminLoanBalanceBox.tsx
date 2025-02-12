import AdminDoughnutChart from './AdminDoughnutChart';
import AnimatedCounter from './AnimatedCounter';
import DoughnutChart from './DoughnutChart';

const AdminLoanBalanceBox = (
  {
  accounts = [], availableBalance, totalCurrentBalance, totalUsers, loanRequestUsers, loanRequestTotal
}: 
AdminLoanTotalBalanceBoxProps
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
      <div className="total-balance-chart">
        <AdminDoughnutChart 
        adminData={adminData} 
        /> 
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="header-2">
          Total Number of Loan Accounts: {totalUsers}
        </h2>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">
            Total Active Loan
          </p>

          <div className="total-balance-amount flex-center gap-2">
            <AnimatedCounter amount={totalCurrentBalance} />
           
          </div>
           <p className="total-balance-label" style ={{fontSize:11}}>
              {loanRequestUsers} Loan Request Suming up to give
          </p>
           <div className="total-balance-label " style ={{fontSize:17}}>
          <AnimatedCounter amount = {loanRequestTotal} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminLoanBalanceBox