'use client';

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getLoggedInUser, signIn, signUp } from '@/lib/actions/user.actions';
import { creditAccount, debitAccount, payLoan } from '@/lib/actions/bank.actions';
import {TypeDropDown} from './TypeDropDown';

//  import createUserTable from '../lib/db/statement';


const formSchema = z.object({
  amount: z.string().min(3, "Amount is too low"),
  transactionType: z.string().min(4, "Please Select Transaction Type"),
 
});

const LoanPayment = ({ type, minimumPay, userName, loanId }:LoanCardProps) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [depositForm, setDepositForm] = useState(true);
  const [types, setTypes] = useState('credit-account');

  
  const changeType = ()=>{
    if (types === 'credit-account'){
      setTypes('make-withdrawal');
    }
    else{
      setTypes('credit-account');
    }
  }
  
  type = types;
  // const loggedIn = await getLoggedInUser();

  // const formSchema = authFormSchema(type);

    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
     
      amount: minimumPay,
      transactionType: "",
      
    },
  });
   
    // 2. Define a submit handler.
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
      setIsLoading(true);

      try {
        // Sign up and create account
        
        if(type === 'make-withdrawal') {
          // console.log(data);
          // insertUser("oma",70);

          // createUserTable();

 const todayDate = new Date();
          const day = todayDate.getDate();
          const month = todayDate.getMonth() + 1;
          const year = todayDate.getFullYear();
          const date = `${day}/${month}/${year}`;


      const userData = {
            account_id: ' ',
            amount: data.amount,
            date: todayDate.toString(),
            type: 'debit',
            subType: data.transactionType,
        }

         const response = await debitAccount(userData);
         if(response === 'success')  
          {
            form.reset();
            router.push('/my-banks');
          }
      

          // const newUser = await signUp(userData);
// console.log(newUser);
          // setUser(newUser);
        }

        if(type === 'credit-account') {

          const todayDate = new Date();
          const day = todayDate.getDate();
          const month = todayDate.getMonth() + 1;
          const year = todayDate.getFullYear();
          const date = `${day}/${month}/${year}`;


const userData = {
            loanId: loanId,
            amount: data.amount,
            date: todayDate.toString(),
            type: 'loanPayment',
            subType: data.transactionType,
            name: userName
}


            
         const response = await payLoan(userData);
        if(response === 'success')  {
          form.reset();
          router.push('/loan-history');
        }
          
          // if(response) router.push('/')
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

  return (
    <section className="auth-form">
      <header className='flex flex-col gap-5 md:gap-8'>
          {/* <Link href="/" className="cursor-pointer flex items-center gap-1">
            <Image 
              src="/icons/logo.svg"
              width={34}
              height={34}
              alt="Horizon logo"
            />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Genius</h1>
          </Link> */}

          <div className="flex flex-col gap-1 md:gap-3">
            <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
              {user 
                ? 'Link Account'
                : type === 'credit-account'
                  ? 'Make Deposit'
                  : 'Make Withdrawal'
              }
              <p className="text-16 font-normal text-gray-600">
                {user 
                  ? 'Link your account to get started'
                  : 'Please enter your details'
                }
              </p>  
            </h1>
          </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">
          {/* <PlaidLink user={user} variant="primary" /> */}
        </div>
      ): (
        <>
          {/* <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> */}
              {/* {type === 'make-withdrawal' && (
                <>
                  <div className="flex gap-4">
                    <CustomInput control={form.control} name='firstName' label="First Name" placeholder='Enter your first name' />
                    <CustomInput control={form.control} name='lastName' label="Last Name" placeholder='Enter your first name' />
                  </div>
                  <CustomInput control={form.control} name='address1' label="Address" placeholder='Enter your specific address' />
                  <CustomInput control={form.control} name='city' label="City" placeholder='Enter your city' />
                  <div className="flex gap-4">
                    <CustomInput control={form.control} name='state' label="State" placeholder='Example: NY' />
                    <CustomInput control={form.control} name='postalCode' label="Postal Code" placeholder='Example: 11101' />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput control={form.control} name='dateOfBirth' label="Date of Birth" placeholder='YYYY-MM-DD' />
                    <CustomInput control={form.control} name='bvn' label="BVN" placeholder='Example: 222xxxxxxxx' />
                  </div>
                </>
              )} */}

              {/* <CustomInput control={form.control} name='email' label="Amount" placeholder='Enter the amount' />

              <CustomInput control={form.control} name='password' label="Password" placeholder='Enter your password' /> */}

             <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        
           {/* <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">
            Bank account details
          </h2>
          <p className="text-16 font-normal text-gray-600">
            Enter the bank account details of the recipient
          </p>
        </div> */}


        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Amount
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder={minimumPay}
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />
        
               
        <FormField
          control={form.control}
          name="transactionType"
          render={() => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Transaction Type
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Cash or Transfer
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <TypeDropDown
                      setValue={form.setValue}
                      otherStyles="!w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        
     
  

   <div className="flex flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === 'credit-account' 
                    ? 'Credit Account' : 'Debit Account'}
                </Button>
              </div>
        

    
      </form>
    </Form>
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
          
            {/* </form>
          </Form> */}

          <footer className="flex justify-center gap-1">
            {/* <p className="text-14 font-normal text-gray-600">
              {type === 'credit-account'
              ? "Want to make withdrawal?"
              : "Want to make deposit?"}
            </p> */}
            {/* <Link href={type === 'credit-account' ? '/make-withdrawal' : '/credit-account'} className="form-link">
              {type === 'credit-account' ? 'Make Withdrawal' : 'Credit Account'}
            </Link>  */}
             {/* <div className="form-link" onClick={()=>{changeType()}}>
              {type === 'credit-account' ? 'Make Withdrawal' : 'Credit Account'}
            </div> */}
          </footer>
        </>
      )}
    </section>
  )
}

export default LoanPayment