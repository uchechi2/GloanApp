import AdminSidebar from "@/components/AdminSidebar";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { getLoggedInStaff, getLoggedInUser } from "@/lib/actions/user.actions";
import { getAdmin } from "@/lib/db/office";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInStaff();
  const getAdmins = await getAdmin();

 if (getAdmins.length === 0) redirect('/sign-in');
  // const loggedIn = [];
//   console.log("Are you logged in?",loggedIn)

  // if(!loggedIn) redirect('/sign-in')

  return (
    <main className="flex h-screen w-full font-inter">
      <AdminSidebar />

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
