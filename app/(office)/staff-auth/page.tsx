import AuthForm from '@/components/AuthForm'
import StaffAuthForm from '@/components/StaffAuthForm'

const StaffSignIn = () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <StaffAuthForm type="sign-in" />
    </section>
  )
}

export default StaffSignIn