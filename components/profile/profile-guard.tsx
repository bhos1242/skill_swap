"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useProfileSetupCheck } from "@/hooks/use-profile";

interface ProfileGuardProps {
  children: React.ReactNode;
}

// Pages that don't require profile completion
const EXCLUDED_PATHS = [
  "/",
  "/sign-in",
  "/profile/setup",
  "/terms",
  "/privacy",
  "/refund",
  "/api"
];

export function ProfileGuard({ children }: ProfileGuardProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { isChecking, shouldRedirect } = useProfileSetupCheck();

  // Don't check profile completion for excluded paths
  const isExcludedPath = EXCLUDED_PATHS.some(path => 
    pathname.startsWith(path)
  );

  // Don't render anything while checking authentication or profile
  if (status === "loading" || (isChecking && !isExcludedPath)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated but on an excluded path, render normally
  if (isExcludedPath) {
    return <>{children}</>;
  }

  // If user is not authenticated, redirect to sign-in
  if (status === "unauthenticated") {
    router.push("/sign-in");
    return null;
  }

  // If profile setup is required and we're not already redirecting
  if (shouldRedirect) {
    return null; // The hook will handle the redirect
  }

  return <>{children}</>;
}
