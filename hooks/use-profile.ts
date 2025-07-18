"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/lib/types/profile";

interface UseProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isProfileComplete: boolean;
  refetch: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/profile/setup");
      
      if (!response.ok) {
        if (response.status === 404) {
          // User not found, redirect to profile setup
          router.push("/profile/setup");
          return;
        }
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data.user);

      // Check if profile is complete, if not redirect to setup
      if (!data.user.profileCompleted) {
        router.push("/profile/setup");
      }

    } catch (err) {
      console.error("Profile fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status, fetchProfile]);

  const isProfileComplete = profile?.profileCompleted || false;

  return {
    profile,
    isLoading,
    error,
    isProfileComplete,
    refetch: fetchProfile
  };
}

// Hook specifically for checking if profile setup is required
export function useProfileSetupCheck() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (status === "loading") return;
      
      if (status === "unauthenticated") {
        setIsChecking(false);
        return;
      }

      if (!session?.user?.email) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetch("/api/profile/setup");
        
        if (response.ok) {
          const data = await response.json();
          if (!data.user.profileCompleted) {
            setShouldRedirect(true);
            router.push("/profile/setup");
          }
        } else if (response.status === 404) {
          setShouldRedirect(true);
          router.push("/profile/setup");
        }
      } catch (error) {
        console.error("Profile check error:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkProfile();
  }, [session, status, router]);

  return { isChecking, shouldRedirect };
}
