"use client"
import Link from "next/link"
import { getSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Header() {
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    async function fetchSession() {
      const session = await getSession()
      setUser(session?.user)
    }
    fetchSession()
  }, [])
  return (
    <header>
      <nav className="flex gap-3">
        <Link href="/">None Members</Link>
        <Link href="/members">Members Only</Link>
        <button onClick={() => signIn()}>Login</button>
        <button onClick={() => signOut()}>Logout</button>
        <h3>{user?.name}</h3>
      </nav>
    </header>
  )
}
