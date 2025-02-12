import { logoutAccount, logoutStaff } from '@/lib/actions/user.actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const StaffFooter = ({ type = 'desktop' }: AdminFooterProps) => {
  const router = useRouter();

  const handleLogOut = async () => {
    const loggedOut = await logoutStaff();

    if(loggedOut) router.push('/')
  }

  return (
    <footer className="footer">
      <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
        <p className="text-xl font-bold text-gray-700">
          {/* {user?.firstName[0]}Admin */}
        </p>
      </div>

      <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
          <h1 className="text-14 truncate text-gray-700 font-semibold">
            {/* {user?.firstName}  */}
            
          </h1>
          <p className="text-14 truncate font-normal text-gray-600">
            {/* {user?.email} */}pidtera micro credit limited
          </p>
      </div>

      <div className="footer_image" onClick={handleLogOut}>
        <Image src="icons/logout.svg" fill alt="jsm" />
      </div>
    </footer>
  )
}

export default StaffFooter