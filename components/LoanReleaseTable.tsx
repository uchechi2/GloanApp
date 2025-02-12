'use client'

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
import { Loader2 } from "lucide-react"
import { type } from "os"
import { useState } from "react"
import { Button } from "./ui/button"
import { manageLoans, releaseLoans, updateLoanTransactions } from "@/lib/actions/bank.actions"
import { useRouter } from "next/navigation"
import { updateLoanTransaction } from "@/lib/db/loan"

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

const LoanReleaseTable = ({ transactions }: AccountsTableProps) => {
const router = useRouter();
const [isLoading, setIsLoading] = useState(false);
const [active, setIsActive] = useState("");
const [state, setState] = useState("");

const handleApproval = async(id:string, decision:string, amount:number, userid:string, tForm:string)=>{
  if(tForm === 'transfer'){
    setIsActive(id);
    setState(tForm);
    setIsLoading(true);
    const stats = await releaseLoans(id, decision, amount);
    const transactionStats = await updateLoanTransactions(userid, decision, amount, tForm);
    if(stats === 'successful' && transactionStats === 'success'){
      setIsLoading(false);
    }
    router.push('/release-loan')

  }else if (tForm === 'cash'){
    setIsActive(id);
    setState(tForm);
    setIsLoading(true);
    const stats = await releaseLoans(id, decision, amount);
    const transactionStats = await updateLoanTransactions(userid, decision, amount, tForm);
    if(stats === 'successful' && transactionStats === 'success'){
      setIsLoading(false);
    }
    router.push('/release-loan')
  }

}

  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Name</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Phone Number</TableHead>
          <TableHead className="px-2">Application Date</TableHead>
          <TableHead className="px-2 max-md:hidden">Tenure</TableHead>
          <TableHead className="px-2 max-md:hidden">Release</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t: UserAccounts) => {
          const status = getTransactionStatus(new Date(t.date))
          const amount = formatAmount(t.loanAmountRequested)

          const isDebit = t.typeOfTransaction === 'debit';
          const isCredit = t.typeOfTransaction === 'credit';
          // const id = t.account_id;

          return (
            <TableRow key={t.id} className={`${isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !over:bg-none !border-b-DEFAULT`}>
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

              <TableCell className={`pl-2 pr-10 font-semibold ${
                isDebit || amount[0] === '-' ?
                  'text-[#f04438]'
                  : 'text-[#039855]'
              }`}>
                {isDebit ? `-${amount}` : isCredit ? amount : amount}
              </TableCell>

              <TableCell className="pl-2 pr-10">
                {/* <CategoryBadge category={status} />  */}
                {t.mobileNo}
              </TableCell>

              <TableCell className="min-w-32 pl-2 pr-10">
                {formatDateTime(new Date(t.dateOfCreation)).dateTime}
                {/* {t.dateOfCreation} */}
              </TableCell>

              <TableCell className="pl-2 pr-10 capitalize min-w-24">
               {t.tenure}
              </TableCell>

              <TableCell className="pl-2 pr-10 max-md:hidden" style={{display:'flex',flexWrap:'wrap'}}>
               {/* <CategoryBadge category={t.formOfTransaction} />  */}
               
               <Button onClick = {(id)=>{handleApproval(t.id, 'success', t.loanAmountRequested, t.account_id, 'transfer')}} type="submit" disabled={isLoading} className="form-btn "  style = {{background:'green', fontSize:'12px'}}>
                  {isLoading && active === t.id && state === 'transfer'? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : 'Transfer'}
                </Button>
               
               <Button onClick = {(id)=>{handleApproval(t.id, 'success', t.loanAmountRequested, t.account_id, 'cash')}} type="submit" disabled={isLoading} className="form-btn text-[#f04438]" style = {{background:'red', fontSize:'12px',marginLeft:'10px',outline:'none'}}>
                  {isLoading && active === t.id && state === 'cash'? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : 'Cash'}
                </Button>
                
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default LoanReleaseTable