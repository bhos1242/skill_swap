declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      profileCompleted?: boolean
    }
  }

  interface User {
    id: string
    profileCompleted?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}
