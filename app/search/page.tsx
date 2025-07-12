"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  image?: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  bio?: string;
  timezone?: string;
  availability?: {
    weekdays: boolean;
    weekends: boolean;
    mornings: boolean;
    afternoons: boolean;
    evenings: boolean;
    flexible: boolean;
  };
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

interface SearchResponse {
  profiles: UserProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function SearchPage() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<SearchResponse['pagination'] | null>(null);

  const fetchProfiles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
      });

      if (searchTerm) params.append("search", searchTerm);
      if (locationFilter) params.append("location", locationFilter);

      const response = await fetch(`/api/profiles?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch profiles");
      }

      const data: SearchResponse = await response.json();
      setProfiles(data.profiles);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : "Failed to load profiles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProfiles();
  };

  const formatAvailability = (availability?: UserProfile['availability']) => {
    if (!availability) return "Not specified";

    const times = [];
    if (availability.mornings) times.push("Mornings");
    if (availability.afternoons) times.push("Afternoons");
    if (availability.evenings) times.push("Evenings");
    if (availability.flexible) times.push("Flexible");

    return times.length > 0 ? times.join(", ") : "Not specified";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Search Skills
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing skills to learn and find people who want to teach
            what you know
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for skills, topics, or keywords..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* Location Filter */}
            <div className="lg:w-48">
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Location..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-8 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for profiles...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {pagination ? `Found ${pagination.total} profiles` : "No profiles found"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  {/* Profile Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-sky-200 rounded-full flex items-center justify-center overflow-hidden">
                      {profile.image ? (
                        <Image
                          src={profile.image}
                          alt={profile.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-sky-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {profile.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {profile.location && (
                          <>
                            <MapPin className="w-3 h-3" />
                            <span>{profile.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  {profile.reviewCount > 0 && (
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">
                        {profile.averageRating}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({profile.reviewCount} reviews)
                      </span>
                    </div>
                  )}

                  {/* Bio */}
                  {profile.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {profile.bio}
                    </p>
                  )}

                  {/* Skills Offered */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Can teach:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {profile.skillsOffered.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {profile.skillsOffered.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{profile.skillsOffered.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Skills Wanted */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Wants to learn:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {profile.skillsWanted.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {profile.skillsWanted.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{profile.skillsWanted.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="mb-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>{formatAvailability(profile.availability)}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors">
                    View Profile
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <span className="text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Don&apos;t see what you&apos;re looking for?
            </h2>
            <p className="text-gray-600 mb-6">
              Join our community and post your own skills or learning requests.
              Connect with like-minded people who share your passion for
              learning.
            </p>
            <Link
              href="/sign-in"
              className="inline-block px-8 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors"
            >
              Join Skill Swap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
