import { createLinkToken, exchangePublicToken } from "@/lib/actions/user.actions"
import { PlaidLinkProps } from "@/types"
import { useRouter } from "next/navigation"
import  { useCallback, useEffect, useState } from "react"
import {PlaidLinkOptions, PlaidLinkOnSuccess, usePlaidLink} from "react-plaid-link"
import { Button } from "./ui/button"
function PlaidLink({ user, variant }: PlaidLinkProps) {
    const router = useRouter()
    const [token,setToken] = useState<string>("")
    useEffect(() => {
        const getLinkToken = async () => {
            const data = await createLinkToken(user)
            console.log(data?.linkToken)
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
        <Button className={'plaidlink-primary'} onClick={() => open()} disabled={!ready}>Connect Bank</Button>
      ) : variant === "ghost" ? (
        <button>Connect Bank</button>
      ) : (
        <button>Connect Bank</button>
      )}
    </>
  )
}

export default PlaidLink
