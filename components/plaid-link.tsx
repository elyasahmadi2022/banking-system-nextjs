import { createLinkToken, exchangePublicToken } from "@/lib/actions/user.actions"
import { PlaidLinkProps } from "@/types"
import { StyledString } from "next/dist/build/swc/types"
import { useRouter } from "next/navigation"
import React, { useCallback, useEffect, useState } from "react"
import {PlaidLinkOptions, PlaidLinkOnSuccess, usePlaidLink} from "react-plaid-link"
function PlaidLink({ user, variant }: PlaidLinkProps) {
    const router = useRouter()
    const [token,setToken] = useState<string>("")

    useEffect(() => {
        const getLinkToken = async () => {
            const data = await createLinkToken(user)
            setToken(data?.linkToken)
        }
        getLinkToken()
    }, [user])
    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token) => {
        await exchangePublicToken({
            publicToken: public_token,
            user
        })

        router.push("/")
    }, [user])
    const config: PlaidLinkOptions  = {
        token,
        onSuccess
    }

    const {ready, open} = usePlaidLink(config)

  return (
    <>
      {variant === "primary" ? (
        <button className={'plaidlink-primary'} onClick={() => open()} disabled={!ready}>Connect Bank</button>
      ) : variant === "ghost" ? (
        <button>Connect Bank</button>
      ) : (
        <button>Connect Bank</button>
      )}
    </>
  )
}

export default PlaidLink
