import HeaderBox from '@/components/HeaderBox'
import PaymentTransferForm from '@/components/paymentTransferForm'
import React from 'react'
import { getLoggedInUser } from "@/lib/actions/user.action";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";

const Transfer = async () => {
 const loggedIn = await getLoggedInUser();
  // const currentPage = Number(page as string) || 1;

  const accounts = await getAccounts({ userId: loggedIn.$id });

  if (!accounts) return;

  const accountsData = accounts.data;
  

  return (
    <section className='payment-transfer'>
      <HeaderBox title='Payment Transfer' subtext='Please provide any specific details or notes related to the payment transfer'/>
    
    <section className='size-full pl-5'>
    <PaymentTransferForm accounts={accountsData}/>
    </section>

    </section>
  )
}

export default Transfer
