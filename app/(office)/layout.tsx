 import AdminSidebar from "@/components/AdminSidebar";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import StaffSidebar from "@/components/StaffSidebar";
import { getLoggedInStaff, getLoggedInUser } from "@/lib/actions/user.actions";
import { createAdminTable, getAdmin } from "@/lib/db/office";
import { createStaffSession, getStaffSession, insertStaffSession } from "@/lib/db/statement";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
createAdminTable();
   const getAdmins = await getAdmin();

 if (getAdmins.length === 0) redirect('/sign-in');

  await createStaffSession();
 const getUserSessions = await getStaffSession();

  getUserSessions.length === 0 && await insertStaffSession(1,"");

// console.log("we got here")

  const loggedIn = await getLoggedInStaff();
  // const loggedIn = [];
  console.log("Are you logged in?",loggedIn)

  if(!loggedIn) redirect('/staff-signIn')

  return (
    <main className="flex h-screen w-full font-inter">
      <StaffSidebar />

      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
          <div>
            {/* <MobileNav user={loggedIn} /> */}
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
