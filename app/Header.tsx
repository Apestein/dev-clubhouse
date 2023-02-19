import Link from "next/link"
import { getSession, signIn, signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function Header() {
  const { data: session } = useSession()
  console.log(session)
  return (
    <header>
      <nav className="flex items-center gap-3">
        <Link href="/">None Members</Link>
        <Link href="/members">Members Only</Link>
        {session ? (
          <button onClick={() => signOut()}>Logout</button>
        ) : (
          <button onClick={() => signIn()}>Login</button>
        )}
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
