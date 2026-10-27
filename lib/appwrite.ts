"use server"
import { Account, Client, TablesDB, Users } from "node-appwrite"
import { cookies } from "next/headers"

export async function createClientSession(){
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)

    const cookie = await cookies()
    const session = cookie.get("appwrite-session")
    if (!session || !session.value){
        throw new Error("No session found")
    }
    client.setSession(session.value)
    return {
        get account(){
            return new Account(client)
        }
    }
}

export async function createAdminClient(){
    const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
            .setKey(process.env.NEXT_APPWRITE_SECRET!)
    return {
        get account(){
            return new Account(client)
        },
        get database(){
            return new TablesDB(client)
        },
        get users(){
            return new Users(client)
        }
    }
}