"use server"
import { AppwriteException, ID } from "node-appwrite"
import { z } from "zod"
import { createAdminClient, createClientSession } from "../appwrite"
import {
  signInProps,
  SignUpParams,
  User,
  exchangePublicTokenProps,
  createBankAccountProps,
} from "@/types"
import { cookies } from "next/headers"
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils"
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid"
import { plaidClient } from "../plaid"
import { revalidatePath } from "next/cache"
import {
  addFundingSource,
  createDwollaCustomer,
} from "../actions/dwolla.actions"
const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
  APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
} = process.env
type AuthError = {
  success: false
  message: string
}

type AuthActionResult = { success: true } | AuthError
type SignUpActionResult =
  | {
      success: true
      user: {
        $id: string
        email: string
        name: string
      }
    }
  | AuthError

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().optional(),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  address1: z.string().min(5).max(50),
  dateOfBirth: z.string().min(3),
  state: z.string().min(2).max(2),
  postalCode: z.string().min(3).max(6),
  city: z.string().min(3),
  ssn: z.string().min(3),
})

const getAuthErrorMessage = (
  error: unknown,
  operation: "sign-in" | "sign-up" | "logout"
) => {
  if (error instanceof AppwriteException) {
    if (operation === "sign-in" && error.code === 401) {
      return "The email or password is incorrect. If you don't have an account, sign up."
    }
    if (operation === "sign-up" && error.code === 409) {
      return "An account with this email already exists. Please sign in instead."
    }
    if (error.code === 429) {
      return "Too many attempts. Please wait a moment and try again."
    }
  }

  console.error(
    `${operation} failed`,
    error instanceof AppwriteException
      ? { code: error.code, type: error.type }
      : error
  )

  if (operation === "sign-in") {
    return "We couldn't sign you in right now. Please try again."
  }
  if (operation === "sign-up") {
    return "We couldn't create your account right now. Please try again."
  }
  return "We couldn't log you out right now. Please try again."
}

export const signIn = async ({
  email,
  password,
}: signInProps): Promise<AuthActionResult> => {
  const parsedCredentials = signInSchema.safeParse({
    email,
    password,
  })
  if (!parsedCredentials.success) {
    return {
      success: false,
      message: "Enter a valid email and a password with at least 8 characters.",
    } satisfies AuthError
  }

  try {
    const { account } = await createAdminClient()
    const session = await account.createEmailPasswordSession({
      email,
      password,
    })
    const cookieStore = await cookies()
    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: getAuthErrorMessage(error, "sign-in"),
    } satisfies AuthError
  }
}

export const signUp = async (
  {password, ...data}: SignUpParams
): Promise<SignUpActionResult> => {
  const parsedData = signUpSchema.safeParse(data)
  
  if (!parsedData.success) {
    return {
      success: false,
      message: "Check the registration details and try again.",
    } satisfies AuthError
  }

  const {email, firstName, lastName } = parsedData.data
  let userCreated = false
  let newUserAccount

  try {
    const { account, users, database } = await createAdminClient()
    newUserAccount = await users.create({
      userId: ID.unique(),
      email,
      password,
      name: `${firstName} ${lastName}`,
    })
    if (!newUserAccount) throw new Error("Error Creating User")

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...data,
      type: "personal",
    })
    if (!dwollaCustomerUrl) throw new Error("Error Creating Dwolla Customer")

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl)
    
    const newUser = await database.createDocument({
      databaseId: DATABASE_ID!,
      collectionId: USER_COLLECTION_ID!,
      documentId: ID.unique(),
      data: 
      {
        ...data,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      }
    })
    console.log(newUser)
    if (!newUser) throw new Error("Error creating new user into database.")
    userCreated = true

    const session = await account.createEmailPasswordSession({
      email,
      password,
    })
    const cookieStore = await cookies()
    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
    return {
      success: true,
      user: parseStringify({
        $id: newUser.$id,
        email: newUser.email,
        name: newUser.name,
      }),
    }
  } catch (error) {
    if (userCreated) {
      console.error(
        "Account created but sign-in failed",
        error instanceof AppwriteException
          ? { code: error.code, type: error.type }
          : error
      )
      return {
        success: false,
        message:
          "Your account was created, but we couldn't sign you in. Please sign in with your new account.",
      } satisfies AuthError
    }
    return {
      success: false,
      message: getAuthErrorMessage(error, "sign-up"),
    } satisfies AuthError
  }
}

export const getLoggedInUser = async () => {
  try {
    const { account } = await createClientSession()
    const user = await account.get()
    return parseStringify(user)
  } catch {
    return null
  }
}
export const logoutAccount = async (): Promise<AuthActionResult> => {
  try {
    const { account } = await createClientSession()
    await account.deleteSession({
      sessionId: "current",
    })
    const cookieStore = await cookies()
    cookieStore.delete("appwrite-session")
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: getAuthErrorMessage(error, "logout"),
    } satisfies AuthError
  }
}

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: user.name,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    }

    const response = plaidClient.linkTokenCreate(tokenParams)
    return parseStringify({
      linkToken: (await response).data.link_token,
    })
  } catch (error) {
    console.log(error)
  }
}

export const createBankAccount = async ({
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  sharableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient()
    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        sharableId,
      }
    )

    return parseStringify(bankAccount)
  } catch (err) {}
}

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    })
    const accessToken = response.data.access_token
    const itemId = response.data.item_id

    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    })

    const accountData = accountsResponse.data.accounts[0]

    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    }

    const processTokenResponse = await plaidClient.processorTokenCreate(request)
    const processorToken = processTokenResponse.data.processor_token

    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    })

    if (!fundingSourceUrl) throw Error

    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
    })

    revalidatePath("/")

    return parseStringify({
      publicTokenExchange: "complete",
    })
  } catch (error) {
    console.error("An error accurred while creating exchange token: ", error)
  }
}
