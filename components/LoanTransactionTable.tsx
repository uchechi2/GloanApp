import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { transactionCategoryStyles } from "@/constants"
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters, capitalize } from "@/lib/utils"

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const {
    borderColor,
    backgroundColor,
    textColor,
    chipBackgroundColor,
   } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default
   
  return (
    <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
      <div className={cn('size-2 rounded-full', backgroundColor)} />
      <p className={cn('text-[12px] font-medium', textColor)}>{category}</p>
    </div>
  )
} 

const LoanTransactionTable = ({ transactions }: TransactionTableProps) => {
  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Requested Loan Amount</TableHead>
          <TableHead className="px-2">Interest</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Date</TableHead>
          <TableHead className="px-2 max-md:hidden">Total Loan Amount Payable</TableHead>
          <TableHead className="px-2 max-md:hidden">Loan State</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t: LoanTransaction) => {
        //   const status = getTransactionStatus(new Date(t.date))
          
        let status = t.status;
        let interest;
        let state;
        if(t.status === 'success'){
            // status = 'approved';
           if(t.currentLoanBalance > 0) {state = 'active'}
           else{state = 'completed'}

        }else if(t.status === 'approved'|| t.status === 'pending'){
            state = 'inactive';
        }else{
          state = 'rejected';
        }
          if(t.tenure === 'weekly'){
            interest = formatAmount(t.loanAmountRequested * (15/100));
          }
         else if(t.tenure === 'monthly'){
            interest = formatAmount(t.loanAmountRequested * (20/100));
          }
        console.log(t.status, status);
        
          const amount = formatAmount(t.loanAmountRequested) 

          const isDebit = t.typeOfTransaction === 'debit';
          const isCredit = t.typeOfTransaction === 'credit';

          return (
            <TableRow key={t.id} className={`${isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !over:bg-none !border-b-DEFAULT`}>
              
               <TableCell className={`pl-2 pr-10 font-semibold ${
                isDebit || amount[0] === '-' ?
                  'text-[#f04438]'
                  : 'text-[#039855]'
              }`}>
                {isDebit ? `-${amount}` : isCredit ? amount : amount}
              </TableCell>
              
              {/* <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]"> */}
                    {/* {removeSpecialCharacters(t.name)} */}
                        {/* {t.typeOfTransaction}
                  </h1>
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {t.typeOfTransaction} */}
                    {/* {capitalize(t.typeOfTransaction)} */}
                  {/* </h1>
                </div>
              </TableCell> */}

               <TableCell className={`pl-2 pr-10 font-semibold ${
                isDebit || amount[0] === '-' ?
                  'text-[#f04438]'
                  : 'text-[#039855]'
              }`}>
                {interest}
              </TableCell>

             

              <TableCell className="pl-2 pr-10">
                <CategoryBadge category={status} /> 
              </TableCell>

              <TableCell className="min-w-32 pl-2 pr-10">
                {formatDateTime(new Date(t.dateOfCreation)).dateTime}
              </TableCell>

              <TableCell className={`pl-2 pr-10 font-semibold ${
                isDebit || amount[0] === '-' ?
                  'text-[#f04438]'
                  : 'text-[#039855]'
              }`}>
               {/* {t.paymentChannel} */}
               {formatAmount(t.currentLoanBalance)}
              </TableCell>

              <TableCell className="pl-2 pr-10 max-md:hidden">
               <CategoryBadge category={state} /> 
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default LoanTransactionTable