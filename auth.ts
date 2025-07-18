import GoogleProvider from "next-auth/providers/google"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      try {
        if (account?.provider === "google" && user.email) {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          })

          // If user doesn't exist, create them
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "",
                ...(user.image && { image: user.image })
              }
            })
          }
        }
        return true
      } catch (error) {
        console.error("Error during sign in:", error)
        return false
      }
    },
    async session({ session }: { session: any }) {
      // Add any custom session data here
      if (session.user?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email }
          });

          if (dbUser) {
            session.user.id = dbUser.id
            session.user.profileCompleted = dbUser.profileCompleted || false
          }
        } catch (error) {
          console.error("Error fetching user data for session:", error)
        }
      }
      return session
    },
    async jwt({ token, account }: { token: any; account: any }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
}
