import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { getLoggedInStaff, getLoggedInUser } from "@/lib/actions/user.actions";
import { createBank, createTransactionTable } from "@/lib/db/banking";
import { createExpensesTable } from "@/lib/db/expenses";
import { createAdminTable, createStaffsTable, getAdmin } from "@/lib/db/office";
import { createSession, createStaffSession, createUserTable } from "@/lib/db/statement";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  createAdminTable();
  const loggedIn = await getLoggedInUser();
  const staffLoggedIn = await getLoggedInStaff();

//   const getAdmins = await getAdmin();

//  if (getAdmins.length === 0) redirect('/admin-signup');

  // const adminLoggedIn = await getLoggedInStaff();
  // console.log("Are you logged in?",loggedIn)

                        await createUserTable();
                        await createBank();
                        await createTransactionTable();
                        await createSession();
                        await createExpensesTable();
                        await createStaffSession();
                        await createStaffsTable();
                      
 
                        
  // if(staffLoggedIn === 'staff'){
  //   redirect('/staffs')
  // }

  if(!loggedIn) redirect('/sign-in')

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />

      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
          <div>
            <MobileNav user={loggedIn} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
