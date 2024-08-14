import { headers } from 'next/headers'
import  {Configuration, PlaidApi, PlaidEnvironments } from 'plaid'

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
            'PLAID-PUBLIC-KEY': process.env.PLAID_PUBLIC_KEY,
        }
    }
})


export const plaidClient = new PlaidApi(configuration)