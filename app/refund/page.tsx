import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy - Skill Swap",
  description:
    "Cancellation and refund policy for Skill Swap skill exchange platform. Learn about our policies for skill exchange cancellations and dispute resolution.",
  openGraph: {
    title: "Cancellation & Refund Policy - Skill Swap",
    description:
      "Cancellation and refund policy for Skill Swap skill exchange platform.",
    type: "website",
  },
};

export default function RefundPage() {
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
            Cancellation & Refund Policy
          </h1>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              1. Platform Nature
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Skill Swap operates as a{" "}
              <strong>barter-based skill exchange platform</strong> where users
              trade knowledge and expertise without monetary transactions. Since
              no money changes hands between users, traditional refund policies
              do not apply to skill exchanges themselves.
            </p>
            <div className="bg-sky-50 border-l-4 border-sky-400 p-4 rounded">
              <p className="text-sky-800 font-medium">
                Important: Skill Swap facilitates skill exchanges through a
                barter system - no payments are processed through our platform.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              2. Skill Exchange Cancellations
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Before Exchange Begins
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    Either party may cancel a skill exchange arrangement before
                    it begins
                  </li>
                  <li>
                    We encourage 24-48 hours notice for cancellations when
                    possible
                  </li>
                  <li>No penalties apply for pre-exchange cancellations</li>
                  <li>
                    Users should communicate respectfully about cancellation
                    reasons
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  During Ongoing Exchanges
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    Multi-session exchanges can be discontinued by mutual
                    agreement
                  </li>
                  <li>
                    Partial completion should be acknowledged and rated
                    appropriately
                  </li>
                  <li>
                    Both parties should discuss fair resolution for incomplete
                    exchanges
                  </li>
                  <li>Platform mediation available for dispute resolution</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              3. Dispute Resolution
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Step 1: Direct Communication
                </h3>
                <p className="text-gray-700">
                  Users are encouraged to resolve issues directly through
                  respectful communication within the platform&apos;s messaging
                  system.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Step 2: Platform Mediation
                </h3>
                <p className="text-gray-700">
                  If direct resolution fails, users can request platform
                  mediation through our support system. We will review the
                  situation and provide guidance for fair resolution.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Step 3: Account Actions
                </h3>
                <p className="text-gray-700">
                  In cases of repeated violations or bad faith participation, we
                  may take account actions including warnings, temporary
                  restrictions, or permanent suspension.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              4. Premium Features (Future)
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Should SkillCircle introduce premium features or paid services in
              the future, the following policies would apply:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>30-day money-back guarantee for premium subscriptions</li>
              <li>Pro-rated refunds for cancelled annual subscriptions</li>
              <li>No refunds for promotional or discounted pricing</li>
              <li>Refund processing within 5-10 business days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              5. Account Termination
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Voluntary Account Deletion
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Users may delete their accounts at any time</li>
                  <li>
                    Complete ongoing exchanges before account deletion when
                    possible
                  </li>
                  <li>
                    Account data will be removed within 30 days of deletion
                    request
                  </li>
                  <li>No refunds applicable as the platform is free to use</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Platform-Initiated Termination
                </h3>
                <p className="text-gray-700">
                  Accounts terminated for policy violations will not be eligible
                  for any refunds of premium features (if applicable).
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              6. Fair Exchange Principles
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-3">
                Our Commitment to Fair Exchanges
              </h3>
              <ul className="list-disc list-inside text-blue-800 space-y-2">
                <li>
                  Equal value exchange - both parties should provide comparable
                  time and effort
                </li>
                <li>
                  Quality instruction - users should genuinely attempt to teach
                  effectively
                </li>
                <li>
                  Respectful interaction - maintain professionalism throughout
                  exchanges
                </li>
                <li>
                  Honest feedback - provide constructive ratings and reviews
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              7. Reporting Issues
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Users experiencing issues with skill exchanges should:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Document the issue with specific details and timestamps</li>
              <li>Attempt direct resolution with the other party first</li>
              <li>Contact platform support if direct resolution fails</li>
              <li>Provide all relevant communication logs and evidence</li>
              <li>Cooperate with platform mediation efforts</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              8. Policy Updates
            </h2>
            <p className="text-gray-700 leading-relaxed">
              This Cancellation & Refund Policy may be updated to reflect
              changes in platform features or legal requirements. Users will be
              notified of significant changes, and the updated policy will be
              posted with a new effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-sky-700">
              9. Contact Support
            </h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about cancellations, disputes, or this policy,
              please contact our support team through the platform. Also review
              our{" "}
              <Link
                href="/terms"
                className="text-sky-600 hover:text-sky-700 underline"
              >
                Terms & Conditions
              </Link>{" "}
              and
              <Link
                href="/privacy"
                className="text-sky-600 hover:text-sky-700 underline"
              >
                {" "}
                Privacy Policy
              </Link>{" "}
              for additional information.
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
            href="/privacy"
            className="text-sky-600 hover:text-sky-700 underline"
          >
            Privacy Policy
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
