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

const ExpenseTable = ({ transactions }: AccountsTableProps) => {
  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Name of Item</TableHead>
          <TableHead className="px-2 max-md:hidden">Type</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Name of Staff/Customer</TableHead>
          <TableHead className="px-2">Date</TableHead>
          {/* <TableHead className="px-2 max-md:hidden">Category</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t: UserAccounts) => {
          const status = getTransactionStatus(new Date(t.date))
          const amount = formatAmount(t.amount)

          let type;
          if(t.typeOfTransaction === 'expenditure'){
            type = 'Expenditure'
          }else{ type = 'Income'}

         const isDebit = t.typeOfTransaction === 'expenditure';
          const isCredit = t.typeOfTransaction === 'income' || 'loanPayment';

          return (
            <TableRow key={t.id} className={`${isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !over:bg-none !border-b-DEFAULT`}>
              
                <TableCell className="text-14 truncate font-semibold text-[#344054]">
               {t.nameOfItem}
              </TableCell>
              
                <TableCell className="text-14 truncate font-semibold text-[#344054]">
               {type}
              </TableCell>
              
             
              <TableCell className={`pl-2 pr-10 font-semibold ${
                isDebit || amount[0] === '-' ?
                  'text-[#f04438]'
                  : 'text-[#039855]'
              }`}>
                {isDebit ? `-${amount}` : isCredit ? amount : amount}
              </TableCell>

              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  {/* <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {removeSpecialCharacters(t.name)}
                  </h1> */}
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {capitalize(t.name)}
                  </h1>
                </div>
              </TableCell>

             
             
              {/* <TableCell className="pl-2 pr-10">
                <CategoryBadge category={status} /> 
              </TableCell> */}

              <TableCell className="min-w-32 pl-2 pr-10">
                {formatDateTime(new Date(t.dateOfTransaction)).dateTime}
                {/* {t.dateOfTransaction} */}
              </TableCell>

              {/* <TableCell className="pl-2 pr-10 capitalize min-w-24">
               {t.paymentChannel}
              </TableCell> */}

              {/* <TableCell className="pl-2 pr-10 max-md:hidden">
               <CategoryBadge category={t.formOfTransaction} /> 
              </TableCell> */}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default ExpenseTable