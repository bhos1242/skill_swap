"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Star,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Heart,
  MessageCircle,
  TrendingUp,
  Award
} from "lucide-react";
import { CreateRequestModal } from "@/components/requests/create-request-modal";

interface MatchScore {
  compatibilityScore: number;
  skillMatches: {
    canTeach: string[];
    canLearn: string[];
  };
  availabilityMatch: number;
  locationMatch: boolean;
  overallScore: number;
}

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
  matchScore?: MatchScore | null;
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

  // Enhanced filters
  const [showFilters, setShowFilters] = useState(false);
  const [skillsOfferedFilter, setSkillsOfferedFilter] = useState<string[]>([]);
  const [skillsWantedFilter, setSkillsWantedFilter] = useState<string[]>([]);
  const [minRatingFilter, setMinRatingFilter] = useState<number | undefined>(undefined);
  const [availabilityDaysFilter, setAvailabilityDaysFilter] = useState<string[]>([]);
  const [availabilityTimesFilter, setAvailabilityTimesFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("compatibility");

  // Skill input states
  const [skillOfferedInput, setSkillOfferedInput] = useState("");
  const [skillWantedInput, setSkillWantedInput] = useState("");

  // Request modal state
  const [showRequestModal, setShowRequestModal] = useState<UserProfile | null>(null);

  const fetchProfiles = async (page = currentPage) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sortBy
      });

      if (searchTerm.trim()) params.append("search", searchTerm.trim());
      if (locationFilter.trim()) params.append("location", locationFilter.trim());

      if (skillsOfferedFilter.length > 0) {
        params.append("skillsOffered", skillsOfferedFilter.join(","));
      }

      if (skillsWantedFilter.length > 0) {
        params.append("skillsWanted", skillsWantedFilter.join(","));
      }

      if (minRatingFilter !== undefined) {
        params.append("minRating", minRatingFilter.toString());
      }

      if (availabilityDaysFilter.length > 0) {
        params.append("availabilityDays", availabilityDaysFilter.join(","));
      }

      if (availabilityTimesFilter.length > 0) {
        params.append("availabilityTimes", availabilityTimesFilter.join(","));
      }

      const response = await fetch(`/api/profiles/search?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch profiles");
      }

      const data: SearchResponse = await response.json();
      setProfiles(data.profiles);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : "Failed to load profiles");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for filter management
  const addSkillOffered = () => {
    if (skillOfferedInput.trim() && !skillsOfferedFilter.includes(skillOfferedInput.trim())) {
      setSkillsOfferedFilter([...skillsOfferedFilter, skillOfferedInput.trim()]);
      setSkillOfferedInput("");
    }
  };

  const removeSkillOffered = (skill: string) => {
    setSkillsOfferedFilter(skillsOfferedFilter.filter(s => s !== skill));
  };

  const addSkillWanted = () => {
    if (skillWantedInput.trim() && !skillsWantedFilter.includes(skillWantedInput.trim())) {
      setSkillsWantedFilter([...skillsWantedFilter, skillWantedInput.trim()]);
      setSkillWantedInput("");
    }
  };

  const removeSkillWanted = (skill: string) => {
    setSkillsWantedFilter(skillsWantedFilter.filter(s => s !== skill));
  };

  const toggleAvailabilityDay = (day: string) => {
    setAvailabilityDaysFilter(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const toggleAvailabilityTime = (time: string) => {
    setAvailabilityTimesFilter(prev =>
      prev.includes(time)
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setSkillsOfferedFilter([]);
    setSkillsWantedFilter([]);
    setMinRatingFilter(undefined);
    setAvailabilityDaysFilter([]);
    setAvailabilityTimesFilter([]);
    setSortBy("compatibility");
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProfiles(1);
  };

  useEffect(() => {
    fetchProfiles();
  }, [currentPage, sortBy]);

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

        {/* Enhanced Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {/* Basic Search Row */}
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by name or skills
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g., JavaScript, cooking..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="e.g., New York, London..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="compatibility">Best Match</option>
                <option value="rating">Highest Rated</option>
                <option value="recent">Recently Joined</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="flex-1 px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                {isLoading ? "Searching..." : "Search"}
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
                  showFilters
                    ? 'bg-sky-100 border-sky-300 text-sky-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t pt-6 mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Skills Offered Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills They Offer
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillOfferedInput}
                      onChange={(e) => setSkillOfferedInput(e.target.value)}
                      placeholder="Add skill..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      onKeyDown={(e) => e.key === 'Enter' && addSkillOffered()}
                    />
                    <button
                      onClick={addSkillOffered}
                      className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillsOfferedFilter.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkillOffered(skill)}
                          className="text-green-500 hover:text-green-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills Wanted Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills They Want
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillWantedInput}
                      onChange={(e) => setSkillWantedInput(e.target.value)}
                      placeholder="Add skill..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      onKeyDown={(e) => e.key === 'Enter' && addSkillWanted()}
                    />
                    <button
                      onClick={addSkillWanted}
                      className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillsWantedFilter.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkillWanted(skill)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={minRatingFilter || ""}
                    onChange={(e) => setMinRatingFilter(e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearAllFilters}
                    className="w-full px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
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
                  {/* Compatibility Score */}
                  {profile.matchScore && sortBy === "compatibility" && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Compatibility</span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-lg font-bold text-green-600">
                            {profile.matchScore.overallScore}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${profile.matchScore.overallScore}%` }}
                        ></div>
                      </div>
                      {/* Skill Matches */}
                      {(profile.matchScore.skillMatches.canTeach.length > 0 || profile.matchScore.skillMatches.canLearn.length > 0) && (
                        <div className="mt-2 text-xs">
                          {profile.matchScore.skillMatches.canTeach.length > 0 && (
                            <div className="flex items-center gap-1 text-green-600">
                              <Heart className="w-3 h-3" />
                              <span>You can teach: {profile.matchScore.skillMatches.canTeach.slice(0, 2).join(", ")}</span>
                              {profile.matchScore.skillMatches.canTeach.length > 2 && (
                                <span>+{profile.matchScore.skillMatches.canTeach.length - 2} more</span>
                              )}
                            </div>
                          )}
                          {profile.matchScore.skillMatches.canLearn.length > 0 && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <Award className="w-3 h-3" />
                              <span>You can learn: {profile.matchScore.skillMatches.canLearn.slice(0, 2).join(", ")}</span>
                              {profile.matchScore.skillMatches.canLearn.length > 2 && (
                                <span>+{profile.matchScore.skillMatches.canLearn.length - 2} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

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
                        {profile.matchScore?.locationMatch && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            <MapPin className="w-3 h-3" />
                            Same area
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.round(profile.averageRating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {profile.averageRating > 0
                        ? `${profile.averageRating.toFixed(1)} (${profile.reviewCount})`
                        : "No reviews"
                      }
                    </span>
                  </div>

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

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/profile/${profile.id}`}
                      className="flex-1 px-4 py-2 border border-sky-600 text-sky-600 rounded-lg font-medium hover:bg-sky-50 transition-colors text-center"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => setShowRequestModal(profile)}
                      className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Connect
                    </button>
                  </div>
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

        {/* Create Request Modal */}
        {showRequestModal && (
          <CreateRequestModal
            targetUser={showRequestModal}
            isOpen={true}
            onClose={() => setShowRequestModal(null)}
            onSuccess={() => {
              setShowRequestModal(null);
              // Optionally show success message or redirect to requests page
            }}
          />
        )}
      </div>
    </div>
  );
}
