import AuthForm from "@/components/auth-form"
import { getLoggedInUser } from "@/lib/actions/user.actions"

export default async function SignUp() {
  const user = await getLoggedInUser()
  console.log(user)
  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="sign-up" />
    </section>
  )
}
