import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - Skill Swap",
  description:
    "Privacy policy for Skill Swap skill exchange platform. Learn how we collect, use, and protect your personal information.",
  openGraph: {
    title: "Privacy Policy - Skill Swap",
    description: "Privacy policy for Skill Swap skill exchange platform.",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-4 transition-colors"
          >
            ← Back to Skill Swap
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              1. Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Personal Information
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Name and contact information</li>
                  <li>
                    Profile information including skills offered and wanted
                  </li>
                  <li>Optional profile photo and location</li>
                  <li>Availability preferences and scheduling information</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Usage Information
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Platform interaction data and feature usage</li>
                  <li>Communication logs within the platform</li>
                  <li>Skill exchange history and ratings</li>
                  <li>Search queries and browsing patterns</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Facilitate skill matching and exchange connections</li>
              <li>Enable communication between users for coordination</li>
              <li>Improve platform functionality and user experience</li>
              <li>Maintain platform security and prevent abuse</li>
              <li>Send important platform updates and notifications</li>
              <li>Generate anonymized analytics for platform improvement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              3. Information Sharing
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  With Other Users
                </h3>
                <p className="text-gray-700">
                  Your profile information (name, skills, availability) is
                  visible to other users to facilitate skill matching. You
                  control what information to include in your public profile.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  With Third Parties
                </h3>
                <p className="text-gray-700">
                  We do not sell or rent your personal information to third
                  parties. We may share anonymized, aggregated data for research
                  or platform improvement purposes.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              4. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Encrypted data transmission and storage</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Secure hosting infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              5. Your Privacy Rights
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Access and Control
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>View and update your profile information at any time</li>
                  <li>Control your privacy settings and profile visibility</li>
                  <li>Download your data in a portable format</li>
                  <li>Delete your account and associated data</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Communication Preferences
                </h3>
                <p className="text-gray-700">
                  You can control what notifications you receive and how we
                  communicate with you through your account settings.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              6. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as your account is
              active or as needed to provide services. When you delete your
              account, we will remove your personal information within 30 days,
              except where retention is required for legal compliance or
              legitimate business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              7. Cookies and Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar technologies to enhance your
              experience, remember your preferences, and analyze platform usage.
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              8. Children&apos;s Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Skill Swap is intended for users 18 years and older. We do not
              knowingly collect personal information from children under 18. If
              we become aware of such collection, we will take steps to delete
              the information promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              9. Policy Updates
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically to reflect changes
              in our practices or legal requirements. We will notify users of
              significant changes and post the updated policy with a new
              effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              10. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy or how we handle
              your personal information, please contact us through the
              platform&apos;s support system or review our
              <Link
                href="/terms"
                className="text-sky-600 hover:text-sky-700 underline"
              >
                Terms & Conditions
              </Link>
              .
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 text-center space-x-4">
          <Link
            href="/terms"
            className="text-sky-600 hover:text-sky-700 underline"
          >
            Terms & Conditions
          </Link>
          <span className="text-gray-400">•</span>
          <Link
            href="/refund"
            className="text-sky-600 hover:text-sky-700 underline"
          >
            Refund Policy
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/" className="text-sky-600 hover:text-sky-700 underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
