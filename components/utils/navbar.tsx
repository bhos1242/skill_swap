"use client"

import Link from "next/link"
import Image from "next/image"
import { AuthStatus } from "@/app/components/auth-status"

export function Navbar() {
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
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-sky-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/search"
              className="text-gray-600 hover:text-sky-600 transition-colors font-medium"
            >
              Search Skills
            </Link>
            <Link
              href="/profile"
              className="text-gray-600 hover:text-sky-600 transition-colors font-medium"
            >
              My Profile
            </Link>
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
