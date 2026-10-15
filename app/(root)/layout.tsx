import MobileNav from "@/components/mobile-nav"
import Sidebar from "@/components/side-bar"
import { getLoggedInUser } from "@/lib/actions/user.actions"
import Image from "next/image"
import { redirect } from "next/navigation"

export default  async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const logginUser = await getLoggedInUser()
  return (
    <main className="flex h-screen w-full font-inter">
        <Sidebar user={logginUser} />
        <div className="flex flex-col size-full">
          <div className="root-layout">
            <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
            < MobileNav user={logginUser}/>
          </div>
        {children}
        </div>
    </main>
  )
}
