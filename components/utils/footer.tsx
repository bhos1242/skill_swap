import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/web-app-manifest-192x192.png"
                alt="Skill Swap Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-gray-900">Skill Swap</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Where skills come full circle. Connect with people who want to teach skills they know 
              in exchange for learning skills they need.
            </p>
            <p className="text-sm text-gray-500">
              © 2024 Skill Swap. All rights reserved.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-sky-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-600 hover:text-sky-600 transition-colors">
                  Search Skills
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="text-gray-600 hover:text-sky-600 transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-sky-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-sky-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-600 hover:text-sky-600 transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Built with ❤️ for the learning community</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
