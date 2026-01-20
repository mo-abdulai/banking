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
import { getBanks, getBank } from "./user.action";


export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    // Get banks from database
    const banks = await getBanks({ userId });

    // console.log(banks)

    if (!banks || !Array.isArray(banks)) {
      console.error("No banks found or invalid banks structure.");
      return parseStringify({ data: [], totalBanks: 0, totalCurrentBalance: 0 });
    }

    // Filter: only banks that have an accessToken
    const validBanks = banks.filter((bank) => bank?.accessToken);
    console.log(validBanks)

    const accounts = await Promise.all(
      validBanks?.map(async (bank: Bank) => {
        
        try {
           console.log(bank.accessToken)
          const accountsResponse = await plaidClient.accountsGet({
            access_token: bank.accessToken,
          });

          const accountData = accountsResponse.data.accounts[0];
          const institution = await getInstitution({
            institutionId: accountsResponse.data.item.institution_id!,
          });

          const account = {
            id: accountData.account_id,
            availableBalance: accountData.balances.available!,
            currentBalance: accountData.balances.current!,
            institutionId: institution.institution_id,
            name: accountData.name,
            officialName: accountData.official_name,
            mask: accountData.mask!,
            type: accountData.type as string,
            subtype: accountData.subtype! as string,
            appwriteItemId: bank.$id,
            shareableId: bank.shareableId,
          };

          return account;
        } catch (error: any) {
          if (error.response?.data?.error_code === "ITEM_LOGIN_REQUIRED") {
            console.warn(`Bank with Appwrite ID ${bank.$id} needs login update (ITEM_LOGIN_REQUIRED)`);
            return null; // Skip this bank, user needs to reconnect
          }

          console.error(`Failed fetching account for bank ${bank.$id}:`, error);
          return null; // Skip any other unexpected errors too
        }
      }) || []
    );

    // Filter out any null accounts
    const validAccounts = accounts.filter((account) => account !== null) as Account[];

    let totalCurrentBalance = 0;
    for (const account of validAccounts) {
      totalCurrentBalance += account.currentBalance;
    }

    const totalBanks = validAccounts.length;

    return parseStringify({
      data: validAccounts,
      totalBanks,
      totalCurrentBalance,
    });
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
    throw error; // Optional: throw if you want upper layers to catch
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
    // console.log(transferTransactionsData)
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
    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });

    const transactions = await getTransactions({
      accessToken: bank?.accessToken,
    });

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
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
export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });

    const intitution = institutionResponse.data.institution;

    return parseStringify(intitution);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

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