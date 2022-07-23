import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'

const MainNavigation: FC = () => {
  const { data: session, status } = useSession()

  return (
    <header className=''>
      <Link href="/">
        <a>
          <div className=''>
            <Image
              src="/logo.png"
              alt="logo"
              width={80}
              height={80}
            />
            Brand Name
          </div>
        </a>
      </Link>
      <nav>
        <ul>

          {(status === 'unauthenticated') && (
            <li>
              {/* <Link href='/api/auth/signin'>Sign In</Link> */}
              <button onClick={() => signIn()}>Sign In</button>
            </li>
          )}

          {session && (
            <>
              <li>
                <Link href="/posts">My Posts</Link>
              </li>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
            </>
          )}


          {(session?.user?.role === 'ADMIN') && (
            <li>
              <Link href="/admin">Admin</Link>
            </li>
          )}

          {(status === 'authenticated') && (
            <>
              <li>
                {/* <Link href='/api/auth/signout'>Sign Out</Link> */}
                <button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button>
              </li>
              <li>
                {session?.user?.email}
              </li>
            </>
          )}

        </ul>
      </nav>
    </header>
  )
}

export default MainNavigation
