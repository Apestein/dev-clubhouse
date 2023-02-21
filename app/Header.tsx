import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"

export default function Header() {
  const { data: session } = useSession()
  console.log(session)
  return (
    <header>
      <nav className="flex items-center justify-end gap-3 font-bold">
        <Link href="/">None Members</Link>
        <div className="h-5 w-px bg-black opacity-25" />
        <Link href="/members">Members Only</Link>
        <div className="h-5 w-px bg-black opacity-25" />
        {session ? (
          <button onClick={() => signOut()}>Logout</button>
        ) : (
          <button onClick={() => signIn()}>Login</button>
        )}
        <div className="h-5 w-px bg-black opacity-25" />
        {session && (
          <>
            <h3>{session?.user?.name}</h3>
            <Image
              priority
              alt="profile-pic"
              src={
                session?.user?.image ||
                `https://api.dicebear.com/5.x/bottts/jpg?seed=${session?.user?.name}`
              }
              width={50}
              height={50}
            />
          </>
        )}
      </nav>
    </header>
  )
}
