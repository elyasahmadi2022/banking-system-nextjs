import MobileNav from "@/components/mobile-nav"
import Sidebar from "@/components/side-bar"
import Image from "next/image"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const logginUser = {
    firstName: "elyas",
    lastName: "ahmadi",
    email: "contact@bigTech.pro"
  }
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
