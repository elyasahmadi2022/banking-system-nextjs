"use server"
import { authFormSchema } from "@/components/auth-form"
import { createAdminClient, createClientSession } from "../appwrite"
import { ID } from "node-appwrite"
import { signInProps, SignUpParams } from "@/types"
import { cookies } from "next/headers"
import { parseStringify } from "../utils"
export const signIn = async ({ email, password }: signInProps) => {
  try {
    //mutations // server call
    const { account } = await createAdminClient()
    const response = await account.createEmailPasswordSession({
      email,
      password,
    })
    console.log(response)
    return parseStringify(response)
  } catch (err) {
    console.error("Error", err)
  }
}

export const signUp = async (data: SignUpParams) => {
  const { password, email, firstName, lastName } = data
  try {
    const { account } = await createAdminClient()
    const newUser = account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    )
    const session = await account.createEmailPasswordSession({
      email,
      password,
    })
    const cookieStore = await cookies()
    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    })
    return parseStringify(newUser)
  } catch (err) {
    console.error("Error", err)
  }
}

export const getLoggedInUser = async () => {
  try {
    const { account } = await createClientSession()
    const user = await account.get()
    return parseStringify(user)
  } catch (err) {
    return null
  }
}
export const logoutAccount = async () => {
  try {
    const { account } = await createAdminClient()
    await account.deleteSession({
      sessionId: "current",
    })
  } catch (err) {
    return null
  }
}
