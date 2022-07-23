import { FC, ReactNode } from 'react'
import MainNavigation from './main-navigation'

type Props = { children: ReactNode }

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <MainNavigation />
      <main className=''>
        {children}
      </main>
    </>
  )
}

export default Layout
