"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createTransfer } from "@/lib/actions/dwolla.actions";
import { createTransaction } from "@/lib/actions/transaction.actions";
import { getBank, getBankByAccountId } from "@/lib/actions/user.actions";
import { decryptId } from "@/lib/utils";


import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {createLoanBank} from "@/lib/db/loan";
import {expenditure, loanRequest} from "@/lib/actions/bank.actions"
import { TenureDropDown } from "./TenureDropDown";
import { TypeDropDown } from "./TypeDropDown";
import { ParticularDropDown } from "./ParticularDropDown";
import Message from './Message';

const formSchema = z.object({
  nameOfItem: z.string().min(3, "Please enter an item"),
  amount: z.string().min(2, "Amount is too short"),
  particularType: z.string().min(3, "Please select a type of particulars"),
  transactionType: z.string().min(3, "Please select a type of payment"),
  nameOfStaff: z.string().min(2, "Transfer note is too short"),
 
});

// const ExpenditureForm = ({ accounts }: PaymentTransferFormProps) => {
const ExpenditureForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
     
      amount: "",
      transactionType: "",
      
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      

     
      // create transfer
      // const transfer = await createTransfer(transferParams);

       const todayDate = new Date();
          const day = todayDate.getDate();
          const month = todayDate.getMonth() + 1;
          const year = todayDate.getFullYear();
          const date = `${day}/${month}/${year}`;
      

      // create transfer transaction
      
        const transaction = {
            date: todayDate.toString(),
            type: data.particularType,
            subType: data.transactionType,
            status: "success",
            nameOfItem: data.nameOfItem,
            name: data.nameOfStaff,
            amount: data.amount
        };

        const loanRequestSubmitted = await expenditure(transaction);

        if (loanRequestSubmitted === "success") {
          
          setMessage('This particular has been successfully recorded');
            setShow(true);
          
          form.reset();
          router.push("/staffs");
        }else{
          setMessage('The process failed, try again');
            setShow(true);
        }
      
    } catch (error) {
      console.error("Submitting create transfer request failed: ", error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        
        <FormField
          control={form.control}
          name="nameOfItem"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Name of Item
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Enter the purpose of loan"
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
                      placeholder="ex: 5.00"
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
                    Form of Payment
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
        
        <FormField
          control={form.control}
          name="particularType"
          render={() => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Type of Particulars
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Income or Expenses
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <ParticularDropDown
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


        
        <FormField
          control={form.control}
          name="nameOfStaff"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Name of Staff
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Enter name"
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

        <div className="payment-transfer_btn-box">
          <Button type="submit" className="payment-transfer_btn">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
      {show && <Message setShow = {setShow} message={message} setMessage = {setMessage}/>}
    </Form>
  );
};

export default ExpenditureForm;
