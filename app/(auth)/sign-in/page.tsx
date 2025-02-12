import AdminForm from '@/components/AdminForm';
import AuthForm from '@/components/AuthForm'
import { getAdmin } from '@/lib/db/office';

const SignIn = async() => {
  
let signTag = <AuthForm type="sign-in" />;
const getAdmins = await getAdmin();

 if (getAdmins.length === 0) {
    signTag = <AdminForm type='sign-in'/>
 };

  return (
    <section className="flex-center size-full max-sm:px-6">
      {signTag}
    </section>
  )
}

export default SignIn