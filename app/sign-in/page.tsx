import type { Metadata } from "next";
import Link from "next/link";
import { GoogleSignInButton } from "./components";

export const metadata: Metadata = {
  title: "Sign In - Skill Swap",
  description:
    "Sign in to Skill Swap to start exchanging skills with our community. Connect with people who want to teach skills they know in exchange for learning skills they need.",
  openGraph: {
    title: "Sign In - Skill Swap",
    description:
      "Sign in to Skill Swap to start exchanging skills with our community.",
    type: "website",
  },
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-6 transition-colors"
          >
            ← Back to Skill Swap
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to continue your skill exchange journey
          </p>
        </div>

        {/* Sign-in Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                className="text-white"
                fill="currentColor"
              >
                {/* Origami Exchange Icon */}
                <path d="M16 4 L24 12 L20 12 L20 16 L12 16 L12 12 L8 12 Z" />
                <path d="M16 28 L8 20 L12 20 L12 16 L20 16 L20 20 L24 20 Z" />
                <line
                  x1="12"
                  y1="16"
                  x2="20"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Skill Swap
            </h2>
            <p className="text-gray-600 text-sm">
              Where Skills Come Full Circle
            </p>
          </div>

          {/* Sign-in Form */}
          <div className="space-y-6">
            {/* Google Sign-in Button */}
            <GoogleSignInButton />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Why sign in?
                </span>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-3 h-3 text-sky-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Create Your Profile
                  </p>
                  <p className="text-xs text-gray-600">
                    Showcase your skills and learning interests
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-3 h-3 text-sky-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Connect & Exchange
                  </p>
                  <p className="text-xs text-gray-600">
                    Find perfect skill matches in our community
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-3 h-3 text-sky-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Track Progress
                  </p>
                  <p className="text-xs text-gray-600">
                    Monitor your learning journey and exchanges
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            By signing in, you agree to our{" "}
            <Link
              href="/terms"
              className="text-sky-600 hover:text-sky-700 underline"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-sky-600 hover:text-sky-700 underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
