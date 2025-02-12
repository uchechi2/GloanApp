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
import { getLoanUserdetail, loanPenalty, manageLoans } from "@/lib/actions/bank.actions"
import { useRouter } from "next/navigation"
import LoanDetails from "./LoanDetails"
import { getLoanUserdetails } from "@/lib/db/loan"

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

const LoanRequestTable = ({ transactions }: AccountsTableProps) => {
const router = useRouter();
const [isLoading, setIsLoading] = useState(false);
const [show, setShow] = useState(false);
const [active, setIsActive] = useState("");
const [state, setState] = useState("");
const [loanId, setLoanId] = useState("");
const [data, setData] = useState([]);

const handleApproval = async(id:string, decision:string, amount:number, tenure:string)=>{
  if(decision === 'approved'){
    setIsActive(id);
    setState(decision);
    setIsLoading(true);
    const stats = await manageLoans(id, decision, amount, tenure);
    if(stats === 'successful'){
      setIsLoading(false);
    }
    router.push('/manage-loans')

  }else if (decision === 'declined'){
    setIsActive(id);
    setState(decision);
    setIsLoading(true);
    const stats = await manageLoans(id, decision, amount, tenure);
    if(stats === 'successful'){
      setIsLoading(false);
    }
    router.push('/manage-loans')
  }

}



const handleShow = async(id:string)=>{
  setIsActive(id)
  const user:any = await getLoanUserdetail(id)
  await loanPenalty(id);
  // setLoanId(id);
   setData(user);
  // console.log(data)
  // {
  //   bussinessName: t.business_company_name,
  //   bussinessAddress: t.bussiness_company_address,
  //   occupation: t.occupation,
  //   mobileNo: t.mobileNo,
  //   // address: t.address,
  //   guarantorName: t.guarantorName,
  //   guarantorAddress: t.guarantorAddress,
  //   guarantorContact: t.guarantorContact,
  //   guarantorOccupation: t.guarantorOccupation
  // }
  console.log(id);
  // console.log(id);
  setShow(true);
}

  return (
    <>
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Name</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Phone Number</TableHead>
          <TableHead className="px-2">Application Date</TableHead>
          <TableHead className="px-2 max-md:hidden">Tenure</TableHead>
          <TableHead className="px-2 max-md:hidden">Category</TableHead>
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
                  </h1><span className="viewProfile" onClick={(id)=>{handleShow(t.id)}}>profile</span>
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
               {/* {t.dateOfCreation}*/}
              </TableCell>

              <TableCell className="pl-2 pr-10 capitalize min-w-24">
               {t.tenure}
              </TableCell>

              <TableCell className="pl-2 pr-10 max-md:hidden" style={{display:'flex',flexWrap:'wrap'}}>
               {/* <CategoryBadge category={t.formOfTransaction} />  */}
               
               <Button onClick = {(id)=>{handleApproval(t.id, 'approved', t.loanAmountRequested, t.tenure)}} type="submit" disabled={isLoading} className="form-btn "  style = {{background:'green', fontSize:'12px'}}>
                  {isLoading && active === t.id && state === 'approved'? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : 'Approve'}
                </Button>
               
               <Button onClick = {(id)=>{handleApproval(t.id, 'declined', t.loanAmountRequested, t.tenure)}} type="submit" disabled={isLoading} className="form-btn text-[#f04438]" style = {{background:'red', fontSize:'12px',marginLeft:'10px',outline:'none'}}>
                  {isLoading && active === t.id && state === 'declined'? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : 'Decline'}
                </Button>
                
              </TableCell>
            </TableRow>
          )

        
        })}
      </TableBody>
      
    </Table>
      { show && <LoanDetails setShow = {setShow} data = {data}/>}
    
    </>
  )
}

export default LoanRequestTable