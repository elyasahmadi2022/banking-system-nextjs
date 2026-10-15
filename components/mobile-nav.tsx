"use client"
import React from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link"
import { sidebarLinks } from "@/constants"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Footer from "./footer"
import { MobileNavProps } from "@/types"
const MobileNav = ({ user }: MobileNavProps) => {
  const pathname = usePathname()
  return (
    <section className=" ">
      <Sheet>
        <SheetTrigger>
          <Image src="/icons/hamburger.svg" width={30} height={30} alt="menu" />
        </SheetTrigger>
        <SheetContent side="left">
          <Link href={"/"} className="flex items-center gap-1 px-4">
            <Image
              src="/icons/logo.svg"
              width={34}
              height={34}
              alt="logo"
              className="size-6 max-xl:size-14"
            />
            <h1 className="font-ibm-plex-serif text-26 font-bold text-black-1">
              Horizon
            </h1>
          </Link>
          <div className="mobilenav-sheet">
            <SheetClose>
              <nav className="flex h-full flex-col gap-4 pt-16 pl-3 text-white">
                {sidebarLinks.map((item) => {
                  const isActive =
                    pathname === item.route ||
                    pathname.startsWith(item.route + "/")
                  return (
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href={item.route}
                          key={item.label}
                          className={cn("mobilenav-sheet_close w-full", {
                            "bg-bank-gradient": isActive,
                          })}
                        />
                      }
                      key={item.label}
                    >
                        <Image
                          src={item.imgURL}
                          alt="icon"
                          width={20}
                          height={20}
                          className={cn({
                            "brightness-[3] invert-0": isActive,
                          })}
                        />
                      <p
                        className={cn("text-16 font-semibold text-black-2", {
                          "text-white": isActive,
                        })}
                      >
                        {item.label}
                      </p>
                    </SheetClose>
                  )
                })}
                USER
              </nav>
            </SheetClose>
          </div>
          <Footer type="mobile"  user={user} />
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav
