import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { LogoutIcon } from '@heroicons/react/outline'
import { LoginIcon } from '@heroicons/react/outline'
import { UserIcon } from '@heroicons/react/outline'
import { CloudIcon } from '@heroicons/react/outline'

const MainNavigation: FC = () => {
  const { data: session, status } = useSession()

  return (
    <nav className='w-full bg-green-900 shadow'>
      <div className='flex items-center justify-between px-4'>

        <div className="py-3">
          <Link href="/">
            <a>
              <div className='mr-10'>
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={300}
                  height={36}
                />
                {/* <div>LostAndFound</div> */}
              </div>
            </a>
          </Link>
        </div>

        <div>
          <ul className='flex space-x-6'>
            {session && (
              <>
                <li className='text-white font-bold flex items-center px-6 py-2.5 rounded-md hover:bg-green-600 transition duration-150 ease-in-out'>
                  <CloudIcon className='h-6 w-6 pr-1' />
                  <Link href="/posts">Items</Link>
                </li>
                <li className='text-white font-bold flex items-center px-6 py-2.5 rounded-md hover:bg-green-600 transition duration-150 ease-in-out'>
                  <UserIcon className='h-6 w-6 pr-1' />
                  <Link href="/profile">Profile</Link>
                </li>
              </>
            )}
            {(session?.user?.role === 'ADMIN') && (
              <li className='text-white px-6 py-2.5 rounded-md hover:bg-green-600 transition duration-150 ease-in-out'>
                <Link href="/admin">Admin</Link>
              </li>
            )}
          </ul>
        </div>

        <div>
          <ul className='flex items-center space-x-6'>
            {(status === 'authenticated') && (
              <>
                <li className='hidden md:block text-blue-100 px-6 py-2.5'>
                  {session?.user?.email}
                </li>
                <li>
                  {/* <Link href='/api/auth/signout'>Sign Out</Link> */}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className='flex items-center gap-1 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight truncate rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
                  >
                    <LogoutIcon className='h-6 w-6' />
                    Log Out
                  </button>
                </li>
              </>
            )}
            {(status === 'unauthenticated') && (
              <li>
                {/* <Link href='/api/auth/signin'>Sign In</Link> */}
                <button
                  onClick={() => signIn()}
                  className='flex items-center gap-1 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight truncate rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
                >
                  <LoginIcon className='h-6 w-6' />
                  Log In
                </button>
              </li>
            )}
          </ul>
        </div>

      </div>
    </nav >
  )
}

export default MainNavigation
