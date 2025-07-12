"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { AuthStatus } from "@/app/components/auth-status"

export function Navbar() {
  const { data: session } = useSession()

  // Check if user is admin
  const isAdmin = session?.user?.email && [
    "admin@skillswap.com",
    "bhosvivek123@gmail.com"
  ].includes(session.user.email)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/web-app-manifest-192x192.png"
              alt="Skill Swap Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-gray-900">Skill Swap</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/search">Search Skills</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/profile">My Profile</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/requests">Requests</Link>
            </Button>
            {isAdmin && (
              <Button variant="ghost" asChild>
                <Link href="/admin">Admin</Link>
              </Button>
            )}
          </div>

          {/* Auth Status */}
          <div className="flex items-center">
            <AuthStatus />
          </div>
        </div>
      </div>
    </nav>
  )
}
