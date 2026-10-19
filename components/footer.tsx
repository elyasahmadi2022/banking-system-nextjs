"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { logoutAccount } from "@/lib/actions/user.actions"
import { FooterProps } from "@/types"

const Footer = ({ user, type = "desktop" }: FooterProps) => {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setLogoutError(null)
    try {
      const response = await logoutAccount()
      if (!response.success) {
        setLogoutError(response.message)
        return
      }
      router.replace("/sign-in")
      router.refresh()
    } catch {
      setLogoutError("We couldn't log you out right now. Please try again.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <footer className="footer">
      <div
        className={type === "mobile" ? "footer_name-mobile" : "footer_name"}
      >
        <p className="text-xl font-bold text-gray-700 uppercase">
          {user?.name[0]}
        </p>
      </div>
      <div
        className={type === "mobile" ? "footer_email-mobile" : "footer_email"}
      >
        <h1 className="text-14 truncate font-normal text-gray-600">
          {user?.name}
        </h1>
        <p className="text-14 truncate font-normal text-gray-600">
          {user?.email}
        </p>
      </div>
      <button
        type="button"
        className="footer_image"
        onClick={handleLogout}
        disabled={isLoggingOut}
        aria-label="Log out"
      >
        <Image src="/icons/logout.svg" fill alt="" aria-hidden="true" />
      </button>
      {logoutError && (
        <p className="form-message" role="alert">
          {logoutError}
        </p>
      )}
    </footer>
  )
}

export default Footer
