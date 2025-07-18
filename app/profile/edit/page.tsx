"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ProfileSetupForm } from "@/components/profile/profile-setup-form";
import { ProfileSetupFormData } from "@/lib/types/profile";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

export default function ProfileEditPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<Partial<ProfileSetupFormData> | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch current profile data
  useEffect(() => {
    if (status === "authenticated") {
      const fetchProfile = async () => {
        try {
          setIsLoadingProfile(true);
          const response = await fetch("/api/profile/setup");
          
          if (!response.ok) {
            throw new Error("Failed to fetch profile");
          }

          const data = await response.json();
          const user = data.user;

          // Transform the data to match ProfileSetupFormData structure
          console.log("User data received:", user); // Debug log
          console.log("Availability data:", user.availability); // Debug log

          setInitialData({
            name: user.name || "",
            location: user.location || "",
            skillsOffered: user.skillsOffered || [],
            skillsWanted: user.skillsWanted || [],
            availability: user.availability ? {
              weekdays: Boolean(user.availability.weekdays),
              weekends: Boolean(user.availability.weekends),
              mornings: Boolean(user.availability.mornings),
              afternoons: Boolean(user.availability.afternoons),
              evenings: Boolean(user.availability.evenings),
              flexible: Boolean(user.availability.flexible)
            } : {
              weekdays: false,
              weekends: false,
              mornings: false,
              afternoons: false,
              evenings: false,
              flexible: false
            },
            profileVisibility: user.profileVisibility || "PUBLIC",
            bio: user.bio || "",
            timezone: user.timezone || "America/New_York"
          });
        } catch (err) {
          console.error("Profile fetch error:", err);
          setError(err instanceof Error ? err.message : "Failed to load profile");
        } finally {
          setIsLoadingProfile(false);
        }
      };

      fetchProfile();
    }
  }, [status]);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  const handleProfileUpdate = async (formData: ProfileSetupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      // Redirect to profile view page after successful update
      router.push("/profile?updated=true");
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
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

  // Show loading state for profile data
  if (status === "authenticated" && isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    return null; // The useEffect will handle the redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Link>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-sky-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Edit Your Profile
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-2">
              Update your information, skills, and preferences
            </p>
            <p className="text-gray-600">
              Keep your profile current to get the best skill exchange matches.
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
                    Profile Update Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Edit Form */}
        {initialData && (
          <ProfileSetupForm
            onComplete={handleProfileUpdate}
            initialData={initialData}
            isLoading={isLoading}
          />
        )}

        {/* Help Text */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tips for a Great Profile
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                • <strong>Keep skills current:</strong> Add new skills you&rsquo;ve learned and remove outdated ones
              </p>
              <p>
                • <strong>Update availability:</strong> Reflect your current schedule and time preferences
              </p>
              <p>
                • <strong>Refresh your bio:</strong> Share recent experiences and current interests
              </p>
              <p>
                • <strong>Review privacy settings:</strong> Adjust visibility based on your comfort level
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
