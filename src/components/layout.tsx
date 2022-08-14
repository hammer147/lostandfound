import { FC, ReactNode } from 'react'
import MainNavigation from './main-navigation'

type Props = { children: ReactNode }

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="container mx-auto bg-slate-300 text-slate-800 min-h-screen">
      <MainNavigation />
      <main className='p-3'>
        {children}
      </main>
    </div>
  )
}

export default Layout
