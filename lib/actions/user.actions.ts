'use server';

import { ID, Query } from "node-appwrite"; 
import { createAdminClient, createSessionClient } from "../appwrite";
import { db } from "../database";
import {users} from "../database/schema";


 import {createUserTable, insertUser, getUsers, getUser, checkUser, signInConfirmation, createSession, getSession, insertSession, startSession, setSession, checkUserExistence, checkStaffExistence, signInStaffConfirmation, setStaffSession, getStaffSession, startStaffSession, confirmAdmin, checkAdminExistence, startAdminSession} from '../db/statement';






import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";

// import { plaidClient } from '@/lib/plaid';
import { revalidatePath } from "next/cache";
import { createBank, createTransactionTable, createAccount, updateAccount } from "../db/banking";
import {createLoanBank, createLoanTransactionTable, dropTable} from "../db/loan";
import {createStaffsTable, checkStaff, createStaffAccount, registerOwner} from "../db/office"
import { createExpensesTable } from "../db/expenses";
import { loanPenalty } from "./bank.actions";
// import {insertUser} from "./appdb";
// import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";
// import Database from 'better-sqlite3';

// const insertUser = require("../db/statement") ;
// const getUsers = require("../db/statement");

// const db = new Database('../db/database.db', {
//   verbose: console.log
// })



const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;


// export const getUserInfo = async ({ userId }: getUserInfoProps) => {
export const getUserInfo = async ({userId}:any) => {
  try {
    // const { database } = await createAdminClient();

    // const user = await database.listDocuments(
    //   DATABASE_ID!,
    //   USER_COLLECTION_ID!,
    //   [Query.equal('userId', [userId])]
    // )

    const user = await startSession(userId);
    // console.log("This is a new test for user", user);

  //   const user = {
  //   $id: 'sd2345',
  // email: 'geniuspossibilities1@gmail.com',
  // userId: 'sd33eer',
  // dwollaCustomerUrl: 'sfdd',
  // dwollaCustomerId: 'sdfa23',
  // firstName: 'Samel',
  // lastName: 'Dav',
  // name: 'Samuel David',
  // address1: 'bkuru',
  // city: 'jos',
  // state: 'plateua',
  // postalCode: '900342',
  // dateOfBirth: '2011-3-02',
  // bvn: '45847838'
  // }
// console.log(user.firstName, 'here agaiiiin');
    return (user);
    // return parseStringify(user);
    // return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error)
  }
}
export const getStaffInfo = async ({userId}:any) => {
  try {
   

    const user = await startStaffSession(userId);
   
    return (user);
  
  } catch (error) {
    console.log(error)
  }
}
export const getAdminInfo = async ({userId}:any) => {
  try {
   

    const user = await startAdminSession(userId);
   
    return (user);
  
  } catch (error) {
    console.log(error)
  }
}

export const addStaff = async ({username, password}:staffProps)=>{
  try{

    const tableExist = await createStaffsTable(); 
                       
    if(!tableExist) return (console.error('Table creation failed'))
    // const getCustomers = await getUser(id);
    const checkStaffs = await checkStaff(username);
  
  checkStaffs === 'doesnot exist'? (await createStaffAccount(username, password)):(console.log('user Exist'));
  // checkStaffs === 'doesnot exist'? (await createAccount(userData, genId)):(console.log('user Exist'));


  }catch (error) {
    console.error('Error', error);
  }
}

export const registerAdmin = async ({username, password}:staffProps)=>{
  try{

    // const tableExist = await createStaffsTable(); 
                       
    // if(!tableExist) return (console.error('Table creation failed'))
    // const getCustomers = await getUser(id);
    // const checkStaffs = await checkStaff(username);
  
  // checkStaffs === 'doesnot exist'? (await createStaffAccount(username, password)):(console.log('user Exist'));
  await registerOwner(username, password);


  }catch (error) {
    console.error('Error', error);
  }
}

export const signIn = async ({ phoneNumber, password }: signInProps) => {
  try {
    // const { account } = await createAdminClient();
    // const session = await account.createEmailPasswordSession(email, password);
    let message;
    const userExist = await checkUserExistence(phoneNumber);

    if (userExist === false) {
      message = "User Does Not Exist Try Signing Up";
      return ({message:message, user:'no user'});
    }

    const userConfirmed = await signInConfirmation(phoneNumber, password);

    if (userConfirmed === "failed"){
      message = "Wrong Username or Password";
      return ({message:message, user:'no user'});
    }else{
 await setSession(userConfirmed);
    }

    await createLoanBank();
    await createLoanTransactionTable();
    console.log(userConfirmed);
    // await dropTable();

    await loanPenalty(userConfirmed);

   


    // cookies().set("appwrite-session", session.secret, {
    //   path: "/",
    //   httpOnly: true,
    //   sameSite: "strict",
    //   secure: true,
    // });
getLoggedInUser();
    // const user = await getUserInfo()
    const user = await getUserInfo( {userId: userConfirmed})
    // const user = await getUserInfo()
    

    return parseStringify(user);
  } catch (error) {
    console.error('Error', error);
  }
}

export const staffSignIn = async ({ username, password }: staffProps) => {
  try {
    // const { account } = await createAdminClient();
    // const session = await account.createEmailPasswordSession(email, password);
    await createStaffsTable();

    let message;
    let staff;
    const staffExist = await checkStaffExistence(username);
    const adminExist = await checkAdminExistence(username);
    
    

    if(adminExist === false){
            message = "Admin Does Not Exist!!!";
      return ({message:message, user:'no user'});
    } else if( adminExist === true){
        const admin = await confirmAdmin(username, password);
    
        if (admin === "failed"){
      message = "Wrong Username or Password";
      return ({message:message, user:'no user'});
    }else{
 await setStaffSession(admin);
 console.log(admin)
 staff='admin'

  const user = await getAdminInfo( {userId: admin})
 return parseStringify({user:user, staff:staff});
    }

    } else if (staffExist === false) {
      message = "User Does Not Exist!!!";
      return ({message:message, user:'no user'});
    }else{

    const userConfirmed = await signInStaffConfirmation(username, password);

    if (userConfirmed === "failed"){
      message = "Wrong Username or Password";
      return ({message:message, user:'no user'});
    }else{
 await setStaffSession(userConfirmed);
 console.log(userConfirmed)
 staff='staff'
 const user = await getStaffInfo( {userId: userConfirmed})
 return parseStringify({user:user, staff:staff});
    }
  }
    // await createLoanBank();
    // await createLoanTransactionTable();
    // console.log(userConfirmed);
    // await dropTable();

    

    // const user = await getUserInfo()
    // const user = await getUserInfo()
    

  } catch (error) {
    console.error('Error', error);
  }
}

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { phoneNumber, firstName, lastName, bvn } = userData;
  

const genId = ID.unique();





  
  let newUserAccount;

  try {

    const tableExist = await createUserTable();
                        await createBank();
                        await createTransactionTable();
                        await createSession();
                        await createExpensesTable();

    if(!tableExist) return (console.error('Table creation failed'))
    // const getCustomers = await getUser(id);
    const checkCustomer = await checkUser(phoneNumber);
  
  checkCustomer === 'doesnot exist'? (await insertUser(password, userData, genId)):(console.log('user Exist'));
  checkCustomer === 'doesnot exist'? (await createAccount(userData, genId)):(console.log('user Exist'));

  

  // for test purpose only
  // await updateAccount(genId, 'credit', 250);

  const getUserSessions = await getSession();
  getUserSessions.length === 0 && await insertSession(1,"");

//  for test purpose

 

  // getUsers();
      
      
//  const testUser = await getUser(email);

//  console.log(testUser[0].firstName);

    
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(), 
      phoneNumber, 
      password, 
      `${firstName} ${lastName}`
    );
//     console.log(DATABASE_ID);
// console.log(password);
// console.log("hello: ",userData);
    // if(!newUserAccount) console.log("an error occured")
    if(!newUserAccount) throw new Error('Error creating user')

    // const dwollaCustomerUrl = await createDwollaCustomer({
    //   ...userData,
    //   type: 'personal'
    // })

    // if(!dwollaCustomerUrl) throw new Error('Error creating Dwolla customer')

    // const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const newUser = await database.createDocument(
      
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
       
      }
    )

    const session = await account.createEmailPasswordSession(phoneNumber, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error('Error', error);
  }
}

export async function getLoggedInUser() {
  try {
    // const { account } = await createSessionClient();
    // const result = await account.get();
    let sessionId = await getSession();
    sessionId = sessionId[0].sessionId;
   
    

    // const user = await getUserInfo()
    // const user = await getUserInfo(sessionId)
    const user = await getUserInfo( {userId: sessionId});

    //  console.log(sessionId, 'this is the session id');
    //  console.log(user, 'this is the user');

    return parseStringify(user);
  } catch (error) {
    
    console.log(error)
    return null;
  }
}

export async function getLoggedInStaff() {
  try {
    // const { account } = await createSessionClient();
    // const result = await account.get();
    let sessionId = await getStaffSession();
    sessionId = sessionId[0].sessionId;
   
    console.log(sessionId)

    // const user = await getUserInfo()
    // const user = await getUserInfo(sessionId)
    const user = await getStaffInfo( {userId: sessionId});

    //  console.log(sessionId, 'this is the session id');
    //  console.log(user, 'this is the user');

    return parseStringify(user);
  } catch (error) {
    
    console.log(error)
    return null;
  }
}

export async function adminLoggedIn() {
  try {
    // const { account } = await createSessionClient();
    // const result = await account.get();
    let sessionId = await getStaffSession();
    sessionId = sessionId[0].sessionId;
   
    console.log(sessionId)

    // const user = await getUserInfo()
    // const user = await getUserInfo(sessionId)
    const user = await getAdminInfo( {userId: sessionId});

    //  console.log(sessionId, 'this is the session id');
    //  console.log(user, 'this is the user');

    return parseStringify(user);
  } catch (error) {
    
    console.log(error)
    return null;
  }
}

export const logoutAccount = async () => {
  try {


    await setSession("");
   
    return ("loggedOut");
    // const { account } = await createSessionClient();

    // cookies().delete('appwrite-session');

    // await account.deleteSession('current');
  } catch (error) {
    return null;
  }
}

export const logoutStaff = async () => {
  try {


    await setStaffSession("");
   
    return ("loggedOut");
  
  } catch (error) {
    return null;
  }
}

// export const createLinkToken = async (user: User) => {
//   try {
//     const tokenParams = {
//       user: {
//         client_user_id: user.$id
//       },
//       client_name: `${user.firstName} ${user.lastName}`,
//       products: ['auth'] as Products[],
//       language: 'en',
//       country_codes: ['US'] as CountryCode[],
//     }

//     const response = await plaidClient.linkTokenCreate(tokenParams);

//     return parseStringify({ linkToken: response.data.link_token })
//   } catch (error) {
//     console.log(error);
//   }
// }

// export const createBankAccount = async ({
//   userId,
//   bankId,
//   accountId,
//   accessToken,
//   fundingSourceUrl,
//   shareableId,
// }: createBankAccountProps) => {
//   try {
//     const { database } = await createAdminClient();

//     const bankAccount = await database.createDocument(
//       DATABASE_ID!,
//       BANK_COLLECTION_ID!,
//       ID.unique(),
//       {
//         userId,
//         bankId,
//         accountId,
//         accessToken,
//         fundingSourceUrl,
//         shareableId,
//       }
//     )

//     return parseStringify(bankAccount);
//   } catch (error) {
//     console.log(error);
//   }
// }

// export const exchangePublicToken = async ({
//   publicToken,
//   user,
// }: exchangePublicTokenProps) => {
//   try {
//     // Exchange public token for access token and item ID
//     const response = await plaidClient.itemPublicTokenExchange({
//       public_token: publicToken,
//     });

//     const accessToken = response.data.access_token;
//     const itemId = response.data.item_id;
    
//     // Get account information from Plaid using the access token
//     const accountsResponse = await plaidClient.accountsGet({
//       access_token: accessToken,
//     });

//     const accountData = accountsResponse.data.accounts[0];

//     // Create a processor token for Dwolla using the access token and account ID
//     const request: ProcessorTokenCreateRequest = {
//       access_token: accessToken,
//       account_id: accountData.account_id,
//       processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
//     };

//     const processorTokenResponse = await plaidClient.processorTokenCreate(request);
//     const processorToken = processorTokenResponse.data.processor_token;

//      // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
//      const fundingSourceUrl = await addFundingSource({
//       dwollaCustomerId: user.dwollaCustomerId,
//       processorToken,
//       bankName: accountData.name,
//     });
    
//     // If the funding source URL is not created, throw an error
//     if (!fundingSourceUrl) throw Error;

//     // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
//     await createBankAccount({
//       userId: user.$id,
//       bankId: itemId,
//       accountId: accountData.account_id,
//       accessToken,
//       fundingSourceUrl,
//       shareableId: encryptId(accountData.account_id),
//     });

//     // Revalidate the path to reflect the changes
//     revalidatePath("/");

//     // Return a success message
//     return parseStringify({
//       publicTokenExchange: "complete",
//     });
//   } catch (error) {
//     console.error("An error occurred while creating exchanging token:", error);
//   }
// }

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error)
  }
}

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('$id', [documentId])]
    )

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('accountId', [accountId])]
    )

    if(bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

function createStaffTable() {
  throw new Error("Function not implemented.");
}
