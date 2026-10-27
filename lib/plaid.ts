import {PlaidApi, Configuration, PlaidEnvironments} from "plaid"

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PALID_CLIENT_ID,
            'PLAID-SECRET': process.env.PALID_SECRET
        }
    }
})

export const plaidClient = new PlaidApi(configuration)
