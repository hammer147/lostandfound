import { FC, ReactNode } from 'react'
import MainNavigation from './main-navigation'

type Props = { children: ReactNode }

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="bg-slate-300 h-screen">
      <MainNavigation />
      <main className='p-4'>
        {children}
      </main>
    </div>
  )
}

export default Layout
