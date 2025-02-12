import { createAdminTable, getAdmin } from "@/lib/db/office";
import Image from "next/image";
import Link from 'next/link';
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
createAdminTable();
const getAdmins = await getAdmin();

//  if (getAdmins.length === 0) redirect('/admin-signup');

  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {children}
      <div className="auth-asset">
        <div>
          <Image 
            src="/icons/auth-image.jpg"
            alt="Auth image"
            width={500}
            height={500}
            className="rounded-l-xl object-contain"
          />
        </div>
          <Link href={'/staffs'} className="form-link">
              Office Use 
            </Link>
      </div>
    </main>
  );
}
