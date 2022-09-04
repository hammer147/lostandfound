import { useSession } from 'next-auth/react'
import Image from "next/image"
import profileImg from '../../../public/profile.png'

const ProfilePage = () => {

  const { data: session} = useSession()

  return (
    <div className="container mx-auto flex flex-col items-center justify-center">
      <div>
        <Image
          src={profileImg}
          alt="Profile image"
        />
      </div>
      {session && (
        <h2 className="text-lg text-blue-900" >{session?.user?.email}</h2>
      )}
    </div>
  )
}
export default ProfilePage
