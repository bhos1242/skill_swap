"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ProfileSetupForm } from "@/components/profile/profile-setup-form";
import { ProfileSetupFormData } from "@/lib/types/profile";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProfileSetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to sign-in if not authenticated
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/sign-in");
    return null;
  }

  const handleProfileComplete = async (formData: ProfileSetupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save profile");
      }

      // Redirect to dashboard or home page after successful setup
      router.push("/?setup=complete");
    } catch (err) {
      console.error("Profile setup error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Your Profile
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Welcome to Skill Swap, {session?.user?.name}! 
            </p>
            <p className="text-gray-600">
              Let&apos;s set up your profile so you can start connecting with other learners and teachers.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Profile Setup Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Setup Form */}
        <ProfileSetupForm
          onComplete={handleProfileComplete}
          initialData={{
            name: session?.user?.name || "",
          }}
          isLoading={isLoading}
        />

        {/* Help Text */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Why do we need this information?
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                • <strong>Skills:</strong> Help us match you with the right learning partners
              </p>
              <p>
                • <strong>Availability:</strong> Ensure you connect with people who share your schedule
              </p>
              <p>
                • <strong>Location:</strong> Find local opportunities for in-person skill exchanges
              </p>
              <p>
                • <strong>Privacy:</strong> You control who can see your profile and contact you
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-2xl mx-auto mt-8 text-center text-sm text-gray-500">
          <p>
            By completing your profile, you agree to our{" "}
            <Link href="/terms" className="text-sky-600 hover:text-sky-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-sky-600 hover:text-sky-700">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
