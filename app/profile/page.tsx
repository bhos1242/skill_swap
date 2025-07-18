"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReviewsList } from "@/components/reviews/reviews-list";
import {
  User,
  Edit,
  MapPin,
  Clock,
  Eye,
  EyeOff,
  Star,
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  bio?: string;
  timezone?: string;
  profileVisibility: "PUBLIC" | "PRIVATE";
  profileCompleted: boolean;
  availability?: {
    weekdays: boolean;
    weekends: boolean;
    mornings: boolean;
    afternoons: boolean;
    evenings: boolean;
    flexible: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for update success message
  const updated = searchParams.get("updated");

  // Memoized function to fetch profile data
  const fetchProfile = useCallback(async () => {
    if (status !== "authenticated") return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/profile/setup");
    
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data.user);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle redirect for unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  // Memoized availability formatter
  const formatAvailability = useMemo(() => {
    return (availability?: UserProfile['availability']) => {
      if (!availability) return "Not specified";

      const days = [];
      if (availability.weekdays) days.push("Weekdays");
      if (availability.weekends) days.push("Weekends");

      const times = [];
      if (availability.mornings) times.push("Mornings");
      if (availability.afternoons) times.push("Afternoons");
      if (availability.evenings) times.push("Evenings");
      if (availability.flexible) times.push("Flexible");

      const dayStr = days.length > 0 ? days.join(", ") : "";
      const timeStr = times.length > 0 ? times.join(", ") : "";

      if (dayStr && timeStr) return `${dayStr} - ${timeStr}`;
      if (dayStr) return dayStr;
      if (timeStr) return timeStr;
      return "Not specified";
    };
  }, []);

  // Early returns for different states
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
    return null; // The useEffect will handle the redirect
  }

  // Show loading state for profile data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button asChild>
            <Link href="/profile/setup">
              Complete Profile Setup
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">It looks like you haven&apos;t completed your profile setup yet.</p>
          <Button asChild>
            <Link href="/profile/setup">
              Complete Profile Setup
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        {updated && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                <p className="text-green-700 font-medium">
                  Profile updated successfully!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-6 mb-6 md:mb-0">
                <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center overflow-hidden">
                  {profile.image ? (
                    <Image
                      src={profile.image}
                      alt={profile.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-sky-600" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {profile.name}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      {profile.profileVisibility === "PUBLIC" ? (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>Public Profile</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>Private Profile</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <Button asChild>
                <Link href="/profile/edit">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>

            {profile.bio && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
              </div>
            )}
            </CardContent>
          </Card>

          {/* Skills Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Skills Offered */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-green-600" />
                  Skills I Can Teach
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.skillsOffered.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skillsOffered.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No skills added yet</p>
                )}
              </CardContent>
            </Card>

            {/* Skills Wanted */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  Skills I Want to Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.skillsWanted.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skillsWanted.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No skills added yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Availability & Settings */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Availability */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Availability
              </h2>
              <p className="text-gray-600">{formatAvailability(profile.availability)}</p>
              {profile.timezone && (
                <p className="text-sm text-gray-500 mt-2">
                  Timezone: {profile.timezone.replace(/_/g, ' ')}
                </p>
              )}
            </div>

            {/* Profile Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                Profile Information
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member since:</span>
                  <span className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last updated:</span>
                  <span className="font-medium">
                    {new Date(profile.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profile status:</span>
                  <span className={`font-medium ${profile.profileCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                    {profile.profileCompleted ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {profile && (
          <div className="mt-8">
            <ReviewsList
              userId={profile.id}
              type="received"
              showHeader={true}
              limit={5}
            />
          </div>
        )}
      </div>
    </div>
  );
}
