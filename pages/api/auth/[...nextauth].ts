import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import crypto from "crypto"
import generateRandomAnimal from "random-animal-name"

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Anonymous",
      //@ts-ignore
      async authorize(credentials, req) {
        const id = crypto.randomUUID()
        const user = { name: generateRandomAnimal(), email: id }
        return user
      },
    }),
  ],
}

export default NextAuth(authOptions)
