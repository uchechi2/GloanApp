import AnimatedCounter from './AnimatedCounter';
import DoughnutChart from './DoughnutChart';

const TotalBalanceBox = (
  {
  accounts = [], availableBalance, totalCurrentBalance
}: 
TotalBalanceBoxProps
) => {
console.log(accounts, 'balancebox');

  // const totalCurrentBalance = 3000;
  // const totalBanks = 4
  return (
    <section className="total-balance">
      <div className="total-balance-chart">
        <DoughnutChart 
        accounts={accounts} 
        /> 
      </div>

      <div className="flex flex-col gap-6">
        {/* <h2 className="header-2">
          Bank Accounts: {totalBanks}
        </h2> */}
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">
            Total Current Balance
          </p>

          <div className="total-balance-amount flex-center gap-2">
            <AnimatedCounter amount={totalCurrentBalance} />
           
          </div>
           <p className="total-balance-label" style ={{fontSize:11}}>
              Available Balance
          </p>
           <div className="total-balance-label " style ={{fontSize:17}}>
          <AnimatedCounter amount = {availableBalance} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TotalBalanceBox