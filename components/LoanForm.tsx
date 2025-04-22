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
import {loanRequest} from "@/lib/actions/bank.actions"
import { TenureDropDown } from "./TenureDropDown";

const formSchema = z.object({
  mobileNo: z.string().min(11, "Please enter a valid phone number").max(11),
  occupation: z.string().min(4),
  business_company_name: z.string().min(4),
  office_phone_no: z.string().min(4, "Transfer note is too short"),
  business_address: z.string().min(4, "Amount is too short"),
  amount: z.string().min(4, "Amount is too short"),
  proposedTenure: z.string().min(4, "Please select a tenure"),
  purposeOfLoan: z.string().min(8, "Please state purpose of loan"),
  sourceOfIncome: z.string().min(4, "Please state source of income"),
  guarantorContact: z.string().min(11, "Please enter a valid phone number").max(11),
  guarantorOccupation: z.string().min(4),
  guarantorName: z.string().min(4),
  guarantorAddress: z.string().min(2, "Enter proper address")

});

const LoanForm = ({ accounts }: PaymentTransferFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        amount: " ",
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
            type: 'loan request',
            subType: " ",
            status: "pending",
            name: accounts[0].name,
            mobileNo: data.mobileNo,
            occupation: data.occupation,
            business_company_name: data.business_company_name,
            office_phone_no: data.office_phone_no,
            business_address: data.business_address,
            amount: data.amount,
            proposedTenure: data.proposedTenure,
            purposeOfLoan: data.purposeOfLoan,
            sourceOfIncome: data.sourceOfIncome,
            guarantorName: data.guarantorName,
            guarantorContact: data.guarantorContact,
            guarantorOccupation: data.guarantorOccupation,
            guarantorAddress: data.guarantorAddress
        };

        const loanRequestSubmitted = await loanRequest(transaction);

        if (loanRequestSubmitted === "success") {
          form.reset();
          router.push("/loan-history");
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
          name="mobileNo"
          render={({ field }) => (
             <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Mobile Phone Number
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Enter your mobile number
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Enter your phone number"
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
          name="occupation"
          render={({ field }) => (
            <FormItem  className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Occupation
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    What&apos;s your occupation
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Enter your occupation"
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
          name="business_company_name"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Business/Company Name
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Enter the Business or Company name"
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
          name="office_phone_no"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-5 pt-6">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Office Phone Number
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Enter the office phone number"
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
          name="business_address"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Business or Company Address
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Enter company or business address"
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

          <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">
            Loan details
          </h2>
          <p className="text-16 font-normal text-gray-600">
            Enter the loan details
          </p>
        </div>

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
          name="proposedTenure"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Proposed Tenure
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                   <TenureDropDown
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
          name="purposeOfLoan"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Purpose Of The Loan
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
          name="sourceOfIncome"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Source of Income
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Enter souce of income"
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


  <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">
            Guarantors details
          </h2>
          <p className="text-16 font-normal text-gray-600">
            Enter the guarantors details
          </p>
        </div>


        <FormField
          control={form.control}
          name="guarantorName"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Guarantors Name
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Enter guarantor's name"
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
          name="guarantorOccupation"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Guarantors Occupation
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Enter guarantor's occupation"
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
          name="guarantorContact"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Guarantors Phone Number
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Enter guarantor's phone number"
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
          name="guarantorAddress"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Guarantors Address
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Enter guarantor's address"
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
              "Request Loan"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoanForm;
