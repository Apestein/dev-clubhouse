import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Logo from "./Logo"

export default function Header() {
  const { data: session } = useSession()
  console.log(session)
  return (
    <header>
      <nav className="mb-6 flex flex-col items-center justify-between p-3 text-xs font-bold shadow-lg md:flex-row md:text-base">
        <Logo />
        <div className="flex items-center gap-3">
          <Link href="/" className="hover:text-emerald-500">
            Home
          </Link>
          <div className="h-5 w-px bg-black opacity-25" />
          <Link href="/members" className="hover:text-emerald-500">
            Members Only
          </Link>
          <div className="h-5 w-px bg-black opacity-25" />
          {session ? (
            <button
              className="hover:text-emerald-500"
              onClick={() => signOut()}
            >
              Logout
            </button>
          ) : (
            <button className="hover:text-emerald-500" onClick={() => signIn()}>
              Login
            </button>
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
                className="rounded-full"
              />
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
