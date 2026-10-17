"use client"
import Image from "next/image"
import React, { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "./ui/button"
import CustomInput from "./custom-input"
import { IconLoader2 } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { signIn, signUp } from "@/lib/actions/user.actions"
export const authFormSchema = (type: string) =>
  z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: type === "sign-in" ? z.string().optional() : z.string().min(3),
    lastName: type === "sign-in" ? z.string().optional() : z.string().min(3),
    address1:
      type === "sign-in" ? z.string().optional() : z.string().min(5).max(50),
    dateOfBirth: type === "sign-in" ? z.string().optional() : z.string().min(3),
    state:
      type === "sign-in" ? z.string().optional() : z.string().min(2).max(2),
    postalCode:
      type === "sign-in" ? z.string().optional() : z.string().min(3).max(6),
    city: type === "sign-in" ? z.string().optional() : z.string().min(3).max(6),
    ssn: type === "sign-in" ? z.string().optional() : z.string().min(3),
  })

const AuthForm = ({ type }: { type: string }) => {
  const [user, setUser] = React.useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const formSchema = authFormSchema(type)
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address1: "",
      dateOfBirth: "",
      state: "",
      ssn: "",
      postalCode: "",
      city: "",
    },
  })
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      // signup - sign in
      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        })

        router.push("/")
      }
      if (type === "sign-up") {
        console.log("hello")
        const newUser = await signUp(data)
        setUser(newUser)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link
          href={"/"}
          className="mb-12 flex cursor-pointer items-center gap-2"
        >
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="logo"
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 font-semibold text-gray-900 lg:text-36">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "Please Enter your  details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{/* PlaidLink */}</div>
      ) : (
        <>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            {type === "sign-up" && (
              <>
                <div className="flex gap-4">
                  <CustomInput
                    type="text"
                    name="firstName"
                    label="First Name"
                    placeholder="Enter Your first name"
                    control={form.control}
                  />
                  <CustomInput
                    type="text"
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter Your Last Name"
                    control={form.control}
                  />
                </div>
                <CustomInput
                  type="text"
                  name="address1"
                  label="Address"
                  placeholder="Enter Your current Address"
                  control={form.control}
                />{" "}
                <CustomInput
                  type="text"
                  name="city"
                  label="City"
                  placeholder="Enter Your current City"
                  control={form.control}
                />
                <div className="flex gap-4">
                  <CustomInput
                    type="text"
                    name="state"
                    label="State"
                    placeholder="Enter Your State"
                    control={form.control}
                  />
                  <CustomInput
                    type="text"
                    name="ssn"
                    label="SNN"
                    placeholder="Enter Your SNN"
                    control={form.control}
                  />
                </div>
                <div className="flex gap-4">
                  <CustomInput
                    type="text"
                    name="postalCode"
                    label="Postal Code"
                    placeholder="Example: 1001"
                    control={form.control}
                  />
                  <CustomInput
                    type="date"
                    name="dateOfBirth"
                    label="DateOfBirth"
                    placeholder="YYYY-MM-DD"
                    control={form.control}
                  />
                </div>
              </>
            )}
            <CustomInput
              type="email"
              name="email"
              label="Email"
              placeholder="Enter Your Email"
              control={form.control}
            />
            <CustomInput
              type="password"
              name="password"
              label="Password"
              placeholder="Enter Your Password"
              control={form.control}
            />

            <div className="mt-3 w-full">
              <Button type="submit" disabled={isLoading} className={"form-btn"}>
                {isLoading ? (
                  <>
                    <IconLoader2 className="animate-spin" size={20} />
                    Loading...
                  </>
                ) : type === "sign-in" ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-400">
              {type === "sign-in"
                ? "Don't have an Account"
                : "Already have an account"}
            </p>
            <Link
              className="form-link"
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  )
}

export default AuthForm
