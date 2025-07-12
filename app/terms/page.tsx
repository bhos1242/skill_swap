import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions - Skill Swap",
  description:
    "Terms and conditions for using the Skill Swap skill exchange platform. Learn about user responsibilities, platform rules, and legal agreements.",
  openGraph: {
    title: "Terms & Conditions - Skill Swap",
    description:
      "Terms and conditions for using the Skill Swap skill exchange platform.",
    type: "website",
  },
};

export default function TermsPage() {
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
            Terms & Conditions
          </h1>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Skill Swap (&quot;the Platform&quot;), you
              accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do
              not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              2. Platform Description
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Skill Swap is a skill exchange platform that enables users to
              trade knowledge and expertise through a barter system. Users can
              offer skills they possess in exchange for learning skills they
              desire.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                Connect learners with teachers in a community-driven environment
              </li>
              <li>Facilitate skill exchanges without monetary transactions</li>
              <li>Build trust through mutual learning experiences</li>
              <li>Provide accessible learning opportunities for all users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              3. User Responsibilities
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Profile Accuracy
                </h3>
                <p className="text-gray-700">
                  Users must provide accurate information about their skills,
                  availability, and contact details.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Respectful Communication
                </h3>
                <p className="text-gray-700">
                  All interactions must be professional, respectful, and
                  constructive.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Commitment to Exchanges
                </h3>
                <p className="text-gray-700">
                  Users should honor agreed-upon skill exchange arrangements and
                  provide quality instruction.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              4. Prohibited Activities
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Creating fake profiles or misrepresenting skills</li>
              <li>Harassment, discrimination, or inappropriate behavior</li>
              <li>
                Attempting to monetize exchanges outside the platform&apos;s
                barter system
              </li>
              <li>Sharing inappropriate content or spam</li>
              <li>Violating intellectual property rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              5. Platform Availability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              While we strive to maintain continuous service, Skill Swap may
              experience downtime for maintenance, updates, or unforeseen
              circumstances. We are not liable for any inconvenience caused by
              service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Skill Swap serves as a platform to connect users but is not
              responsible for the quality, safety, or outcomes of skill
              exchanges. Users participate at their own risk and are responsible
              for their own safety and satisfaction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              7. Modifications to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Skill Swap reserves the right to modify these terms at any time.
              Users will be notified of significant changes, and continued use
              of the platform constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              8. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms & Conditions, please contact us
              through the platform&quot;s support system or visit our{" "}
              <Link
                href="/privacy"
                className="text-sky-600 hover:text-sky-700 underline"
              >
                Privacy Policy
              </Link>{" "}
              page.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 text-center space-x-4">
          <Link
            href="/privacy"
            className="text-sky-600 hover:text-sky-700 underline"
          >
            Privacy Policy
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
