"use server";

import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";

import { getTransactionsByBankId } from "./transaction.actions";
import { getBanks, getBank, getLoggedInUser } from "./user.actions";
import {get_account, get_transactions, update_available_balance, updateAccount, recordTransaction, getTotalAccounts, createBank} from "../db/banking"
import { loanRecords, createLoanBank, recordLoanTransaction, getLoanRequestList, getLoanList, updateLoanStatus, deleteLoanAccount, getApprovedLoanList, updateLoanTransaction, releaseLoanStatus, getactiveLoanList, updateLoanAccount, get_active_loan_account, get_current_loanBalance, getLoanUserdetails, updateLoanPenalty } from "../db/loan";
import {createExpensesTable, getExpense, recordExpenses} from "../db/expenses.js";


// Get multiple bank accounts
export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    // get banks from db

    // console.log('entered');
    const banks = await getBanks({ userId });
    await createBank();


    // const accounts = await Promise.all(
    //   banks?.map(async (bank: Bank) => {
    //     // // get each account info from plaid
    //     // const accountsResponse = await plaidClient.accountsGet({
    //     //   access_token: bank.accessToken,
    //     // });
    //     const accountData = accountsResponse.data.accounts[0];

    //     // get institution info from plaid
    //     // const institution = await getInstitution({
    //     //   institutionId: accountsResponse.data.item.institution_id!,
    //     // });

    //     const account = {
    //       id: accountData.account_id,
    //       availableBalance: accountData.balances.available!,
    //       currentBalance: accountData.balances.current!,
    //       // institutionId: institution.institution_id,
    //       name: accountData.name,
    //       // officialName: accountData.official_name,
    //       // mask: accountData.mask!,
    //       type: accountData.type as string,
    //       // subtype: accountData.subtype! as string,
    //       // appwriteItemId: bank.$id,
    //       // sharaebleId: bank.shareableId,
    //     };

    //     return account;
    //   })
    // );
    const accounts = get_account(userId);
    const totalCurrentBalance = accounts[0].currentBalance;
    const loanBalance = 0;
    const availableBalance = accounts[0].currentBalance - loanBalance;
    // const totalBanks = accounts.length;
    // const totalCurrentBalance = accounts.reduce((total, account) => {
    //   return total + account.currentBalance;
    // }, 0);
    await update_available_balance(userId, availableBalance);

    return parseStringify({ data: accounts, totalCurrentBalance, availableBalance });
    // return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get one bank account
export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    // get bank from db
    const bank = await getBank({ documentId: appwriteItemId });

    // get account info from plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];

    // get transfer transactions from appwrite
    const transferTransactionsData = await getTransactionsByBankId({
      bankId: bank.$id,
    });

    const transferTransactions = transferTransactionsData.documents.map(
      (transferData: Transaction) => ({
        id: transferData.$id,
        name: transferData.name!,
        amount: transferData.amount!,
        date: transferData.$createdAt,
        paymentChannel: transferData.channel,
        category: transferData.category,
        type: transferData.senderBankId === bank.$id ? "debit" : "credit",
      })
    );

    // get institution info from plaid
    // const institution = await getInstitution({
    //   institutionId: accountsResponse.data.item.institution_id!,
    // });

    const transactions = await getTransactions({
      accessToken: bank?.accessToken,
    });

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      // institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      // mask: accountData.mask!,
      type: accountData.type as string,
      form: accountData.subtype! as string,
      // appwriteItemId: bank.$id,
    };

    // sort transactions by date such that the most recent transaction is first
      const allTransactions = [...transactions, ...transferTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return parseStringify({
      data: account,
      transactions: allTransactions,
    });
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
  }
};

// Get bank info
// export const getInstitution = async ({
//   institutionId,
// }: getInstitutionProps) => {
//   try {
//     const institutionResponse = await plaidClient.institutionsGetById({
//       institution_id: institutionId,
//       country_codes: ["US"] as CountryCode[],
//     });

//     const intitution = institutionResponse.data.institution;

//     return parseStringify(intitution);
//   } catch (error) {
//     console.error("An error occurred while getting the accounts:", error);
//   }
// };

// Get transactions
export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  let hasMore = true;
  let transactions: any = [];

  try {
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    return parseStringify(transactions);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

export const creditAccount = async ({...userData}:CreditParams)=>{
   const loggedIn = await getLoggedInUser();
    const account_id = loggedIn.id;

    const {type, amount, date, subType} = userData;

    const account = await updateAccount(account_id, type, amount );
    const transactionData = {
      dateOfTransaction:date, 
      typeOfTransaction:type, 
      amount:amount, 
      formOfTransaction:subType, 
      account_id:account_id
    }
    

 if(account === 'success')  
  {const transaction = await recordTransaction(transactionData);
    if(transaction === 'successful')  return 'success';
  }
}

export const debitAccount = async ({...userData}:DebitParams)=>{
  const loggedIn = await getLoggedInUser();
    const account_id = loggedIn.id;


    const name = loggedIn.firstName;
    // console.log(name);

    // const name = 'Esther';
    const {type, amount, date, subType} = userData;

    const account = await updateAccount(account_id, type, amount );
    const transactionData = {
      dateOfTransaction:date, 
      typeOfTransaction:type, 
      amount:amount, 
      formOfTransaction:subType, 
      account_id:account_id,
      name: name,
      status: 'successful' 
    }
    

 if(account === 'success')  
  {const transaction = await recordTransaction(transactionData);
    if(transaction === 'successful')  return 'success';
  }else {
    return account;
  }
 
}


export const loanRequest = async ({...userData}:LoanParams)=>{

  

   const loggedIn = await getLoggedInUser();
    const {id, bvn} = loggedIn;
    

    const {type, amount, date, subType, status, name} = userData;

    

    const account = await loanRecords(id, bvn, userData);
    
    const transactionData = {
      dateOfTransaction:date, 
      typeOfTransaction:type, 
      amount:amount, 
      formOfTransaction:subType, 
      account_id:id,
      name: name,
      status: status
    }
    

 if(account === 'success')  
  {
    const transaction = await recordLoanTransaction(transactionData);
    if(transaction === 'successful')  return 'success';
    // return 'success';
  }
}

export const getTotalBalance = async()=>{

  await createBank();
  const accounts = await getTotalAccounts();
  // console.log('admin check', accounts);
  const totalUsers = accounts.length
  let totalBalance = 0;

  accounts.map((a:any)=>{
    totalBalance = totalBalance + a.currentBalance;
    
  }
);
  return ({data:accounts, totalBalance, totalUsers});
}

export const getLoanRequest = async()=>{
  const accounts = await getLoanRequestList();
  // console.log('admin check', accounts);
  const totalUsers = accounts.length;
  let totalBalance = 0;

  accounts.map((a:any)=>{
    totalBalance = totalBalance + a.loanAmountRequested;
    
  }
);
return ({data:accounts, totalBalance, totalUsers});
} 

export const releaseLoan = async()=>{
  await createLoanBank();
  const accounts = await getApprovedLoanList();
  // console.log('admin check', accounts);
  const totalUsers = accounts.length;
  let totalBalance = 0;

  accounts.map((a:any)=>{
    totalBalance = totalBalance + a.loanAmountRequested;
    
  }
);
return ({data:accounts, totalBalance, totalUsers});
} 

export const getLoanIssuedList = async()=>{

  // await deleteLoanAccount(7);
  const accounts = await getLoanList();
  // console.log('admin check', accounts);
  let totalBalance = 0;
  const totalUsers = accounts.length

  accounts.map((a:any)=>{
    totalBalance = totalBalance + a.loanAmountReceived;
    
  }
);
return ({data:accounts, totalBalance, totalUsers});
} 

export const getActiveLoanList = async()=>{

  // await deleteLoanAccount(7);
  await createLoanBank();
  const accounts = await getactiveLoanList();
  // console.log('admin check', accounts);
  let totalBalance = 0;
  const totalUsers = accounts.length

  accounts.map((a:any)=>{
    if(!Number.isNaN(a.currentLoanBalance)) {totalBalance = totalBalance + a.currentLoanBalance;
      console.log(totalBalance);
      deleteLoanAccount(13);
      deleteLoanAccount(12);
      deleteLoanAccount(11);
    }
    
  }
);
return ({data:accounts, totalBalance, totalUsers});
} 

export const manageLoans = async(id:string, status:string, amount:number, tenure:string)=>{

  let approvedAmount = amount;
  let amountWithInterest;
  console.log(approvedAmount)
  if (status === 'declined'){approvedAmount = 0;}
  if(tenure === 'weekly'){ amountWithInterest = amount + (amount * 15/100)}
  else if(tenure === 'monthly'){
  amountWithInterest = amount + (amount * 20/100);
  }else{
    amountWithInterest = " ";
  }
  const result = updateLoanStatus(id, status, approvedAmount, amountWithInterest)
  console.log(id, status);
  if(result === "success"){
    return 'successful';
  }else{
    return 'failed';
  }
  
}


export const updateLoanTransactions = async(userid:string, decision:string, amount:number, tForm:string)=>{
  // const result = await updateLoanTransaction(userid, decision, amount, tForm);
  const result = await updateLoanTransaction(userid, decision, amount, tForm);
  // console.log('admin check', accounts);
  if(result === "success"){
    return 'success';
  }else{
    return 'failed';
  }
 
} 


export const decline = async(userid:string, decision:string, amount:number, tForm:string)=>{
  const result = await updateLoanTransaction(userid, decision, amount, tForm);
  // console.log('admin check', accounts);
  if(result === "success"){
    return 'success';
  }else{
    return 'failed';
  }
 
} 

export const releaseLoans = async(id:string, status:string, amount:number)=>{

  let approvedAmount = amount;
  
  
  if (status === 'declined'){approvedAmount = 0;}
 
  const result = releaseLoanStatus(id, status)
  console.log(id, status);
  if(result === "success"){
    return 'successful';
  }else{
    return 'failed';
  }
  
}

export const payLoan = async ({...userData}:CreditParams)=>{
   const loggedIn = await getLoggedInUser();
    const account_id = loggedIn.id;

    const {type, amount, date, subType, name, loanId} = userData;
    
    const users_account = await get_active_loan_account(account_id);
    const loanRecieved = users_account[0]?.loanAmountReceived;

    const currentLoanBalance:number = get_current_loanBalance(loanId);
    let newAmount = parseInt(amount);

    let paidAmount = amount;
    let profit = 0, interest = 0, total = 0;

    if (users_account[0]?.tenure === 'weekly'){
      interest = loanRecieved * 0.15;
    }else if (users_account[0]?.tenure === 'monthly'){
      interest = loanRecieved * 0.2;
    }

    total = loanRecieved + interest;

    // console.log("this is the count for users loan, the number is ", users_account.length)

    if(newAmount > currentLoanBalance && users_account.length === 1){

      newAmount = newAmount - currentLoanBalance;
      userData.amount =  newAmount.toString();
      await creditAccount(userData);
      paidAmount = currentLoanBalance.toString();

      const account = await updateLoanAccount(loanId, type, paidAmount );
    const transactionData = {
      dateOfTransaction:date, 
      typeOfTransaction:type, 
      amount:paidAmount, 
      formOfTransaction:subType, 
      account_id:account_id,
      name: name,
      status: 'success'
    }

    profit = Math.round((interest/total) * parseInt(paidAmount));
    const gainPerTransaction = profit.toString();

    const incomeData = {
       date:date, 
      type:type, 
      amount:gainPerTransaction, 
      subType:subType, 
      nameOfItem: 'Loan Repayment',
      name: name,
      status: 'success'
    }

    if(account === 'success')  
  {
    const transaction = await recordLoanTransaction(transactionData);
    const income =      await expenditure(incomeData);
    if(transaction === 'successful' && income === 'success')  return 'success';
  }

    } else if(newAmount > currentLoanBalance && users_account.length > 1 && currentLoanBalance !== 0){
        
      newAmount = newAmount - currentLoanBalance;
      userData.amount =  newAmount.toString();
      // await creditAccount(userData);
      paidAmount = currentLoanBalance.toString();

      const account = await updateLoanAccount(loanId, type, paidAmount );
    const transactionData = {
      dateOfTransaction:date, 
      typeOfTransaction:type, 
      amount:paidAmount, 
      formOfTransaction:subType, 
      account_id:account_id,
      name: name,
      status: 'success'
    }

    profit = Math.round((interest/total) * parseInt(paidAmount));
    const gainPerTransaction = profit.toString();

    const incomeData = {
       date:date, 
      type:type, 
      amount:gainPerTransaction, 
      subType:subType, 
      nameOfItem: 'Loan Repayment',
      name: name,
      status: 'success'
    }
     
    if(account === 'success')  
  {const transaction = await recordLoanTransaction(transactionData);
                      await expenditure(incomeData);
    // if(transaction === 'successful')  return 'success';
  }
  // console.log("we are in the loan section")
      
    const solution =  await manageExcessPayment(userData);
    
    if(solution === 'success')  return 'success'

    }
    else{
         const account = await updateLoanAccount(loanId, type, paidAmount );
    const transactionData = {
      dateOfTransaction:date, 
      typeOfTransaction:type, 
      amount:amount, 
      formOfTransaction:subType, 
      account_id:account_id,
      name: name,
      status: 'success'
    }

    profit = Math.round((interest/total) * parseInt(paidAmount));
    const gainPerTransaction = profit.toString();

    const incomeData = {
       date:date, 
      type:type, 
      amount:gainPerTransaction, 
      subType:subType, 
      nameOfItem: 'Loan Repayment',
      name: name,
      status: 'success'
    }

    if(account === 'success')  
  {const transaction = await recordLoanTransaction(transactionData);
    const income =      await expenditure(incomeData);
    if(transaction === 'successful' && income === 'success')  return 'success';
  }
    }
  }


export const expenditure = async ({...userData}:ExpenseParams)=>{

  await createExpensesTable();

  const {type, amount, date, subType, status, name, nameOfItem} = userData;
    
   const transactionData = {
      dateOfTransaction:date, 
      typeOfTransaction:type, 
      amount:amount, 
      formOfTransaction:subType, 
      item: nameOfItem,
      name: name,
      status: status
    }
    

    const transaction = await recordExpenses(transactionData);
    if(transaction === 'successful')  {return 'success'}else{return 'failed'};
    // return 'success';
  
}


export const getExpenses = async()=>{
  await createExpensesTable();
  const accounts = await getExpense();
  // console.log('admin check', accounts);
  const totalUsers = accounts.length
  let totalBalance = 0;
  let totalMonthBalance = 0;
  

  accounts?.map((a:any)=>{
    totalBalance = totalBalance + a.amount;
    
  }
);
  return ({data:accounts, totalBalance, totalUsers, totalMonthBalance});
}

// export const getActualPay = async(amount:number)=>{

//   const loggedIn = await getLoggedInUser();
  
//   const userId = loggedIn.id;
//     const loanAccount = await get_active_loan_account(userId);
//     const loanBalance = loanAccount[0]?.loanAmountReceived;

//   let actualPay = 0;
       
//     if (loanAccount[0]?.tenure === 'weekly'){
//       actualPay = (loanBalance + (loanBalance * 0.15));
//     } 
//     else if (loanAccount[0]?.tenure === 'monthly'){
//       actualPay = (loanBalance + (loanBalance * 0.2))/3;
//       if(loanAccount[0]?.currentLoanBalance < minimumPay) minimumPay = loanAccount[0].currentLoanBalance;
//       console.log(minimumPay);
//     }
//     }

export const manageExcessPayment = async({...userData }:CreditParams)=>{

  const loggedIn = await getLoggedInUser();
  // const accounts = await get_loan_account({ 
  //   userId: loggedIn.id 
  // })

  const userId = loggedIn.id;
    // const loanAccount = await get_active_loan_account(userId);
    
    // const loanBalance = loanAccount[0]?.loanAmountReceived;
    // const loanId = loanAccount[0]?.id;

    let message = '';
    let i = 0;
    // let j = loanAccount.length;
   

  const {amount} = userData;
      let leftover = parseInt(amount);

    // loanAccount?.map(async(loan:any)=>{
      
    //   // console.log('inside mapping');
    //   const {amount} = userData;
    //   let leftover = parseInt(amount);

    //   if(leftover > 0){
    //     userData.loanId = loan.id;
    //    const collector = await payLoan(userData);
    //     leftover = leftover - loan.currentLoanBalance;
    //     userData.amount = leftover.toString();

                   
    //   }else{
    //       message = 'success';
    //   }
       
        
    // })

    while(leftover > 0){

const loanAccount = await get_active_loan_account(userId);
if(loanAccount.length < 1){break;}

          userData.loanId = loanAccount[i]?.id;
       const collector = await payLoan(userData);
        leftover = leftover - loanAccount[i]?.currentLoanBalance;
        userData.amount = leftover.toString();
        i = i + 1;
        console.log("this worked perfectly leftover", leftover)
    }

      console.log("this worked perfectly leftover", leftover)

      return 'success';

}


export const getLoanUserdetail = async(id:any)=>{
  // console.log(id);
  const user = await getLoanUserdetails(id);
  // console.log(user);

  return(user);
}

export const calculateProfit = async()=>{
  const table = getExpense();

  const date = new Date();
  const month = date.getMonth();

  let income = 0, expenses = 0, profit = 0;
  let monthlyIncome =0, monthlyExpenses = 0, monthlyProfit =0, tithe = 0;

  table?.map((p:any)=>{
    if(p.typeOfTransaction === 'income' || p.typeOfTransaction === 'loanPayment'){
      income = income + p.amount;
    }else{
      expenses = expenses + p.amount;
    }

    const d = new Date(p.dateOfTransaction);
    const dMonth = d.getMonth();

    if(p.typeOfTransaction === 'income' || p.typeOfTransaction === 'loanPayment' && month === dMonth ){
        monthlyIncome = monthlyIncome + p.amount;
    }else if(p.typeOfTransaction === 'expenditure' && month === dMonth){
      monthlyExpenses = monthlyExpenses + p.amount;
    }
  })

  profit = income - expenses;
  monthlyProfit = monthlyIncome - monthlyExpenses;
  if(monthlyProfit > 0)  tithe = monthlyProfit * 0.1;

  return ({
    profit:profit, 
    income:income, 
    expenses:expenses, 
    monthlyProfit:monthlyProfit, 
    monthlyIncome:monthlyIncome, 
    monthlyExpenses:monthlyExpenses, 
    tithe:tithe
  })
}

export const loanPenalty = async(userId:string)=>{
  const data = await get_active_loan_account(userId);

  data?.map((a:any)=>{
    const lastTransaction = '';
    const status = '';
    const dateNow = Date.now();
    console.log(dateNow);
    let newValue = 0;
    const dateDiff = (dateNow - parseInt(a.timeStamp))/86400000;
    if(a.status === 'success'){
      if(a.tenure === 'weekly' && dateDiff > 7){
        //update loan table with penalty

        newValue = a.currentLoanBalance + (a.currentLoanBalance * 0.15);
        console.log("yes it is greater weekly");
        console.log(a.currentLoanBalance)
        console.log(newValue)
         updateLoanPenalty(a.id, 'penalty', newValue)
      }else if (a.tenure === 'monthly' && dateDiff > 30){
        //update loan table with penalty
        
        newValue = a.currentLoanBalance + (a.currentLoanBalance * 0.20);
            console.log("yes it is greater monthly");
              console.log(a.currentLoanBalance)
              console.log(newValue)

              updateLoanPenalty(a.id, 'penalty', newValue)
      }
    }
  })

      

}