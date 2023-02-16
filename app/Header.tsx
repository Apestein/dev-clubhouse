"use client"
import Link from "next/link"
import { getSession, signIn, signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Header() {
  // const [user, setUser] = useState<any>(null)
  // useEffect(() => {
  //   async function fetchSession() {
  //     const session = await getSession()
  //     setUser(session?.user)
  //     console.log(session)
  //   }
  //   fetchSession()
  // }, [])
  const { data: session } = useSession()
  console.log(session)
  return (
    <header>
      <nav className="flex gap-3">
        <Link href="/">None Members</Link>
        <Link href="/members">Members Only</Link>
        {session ? (
          <button onClick={() => signOut()}>Logout</button>
        ) : (
          <button onClick={() => signIn()}>Login</button>
        )}
        <h3>{session?.user?.name}</h3>
      </nav>
    </header>
  )
}
