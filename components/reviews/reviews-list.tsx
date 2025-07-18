"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Star, User, Calendar, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  giver: {
    id: string;
    name: string;
    image?: string;
    location?: string;
  };
  receiver: {
    id: string;
    name: string;
    image?: string;
    location?: string;
  };
}

interface ReviewsListProps {
  userId: string;
  type?: "received" | "given";
  showHeader?: boolean;
  limit?: number;
}

export function ReviewsList({ 
  userId, 
  type = "received", 
  showHeader = true,
  limit = 10 
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchReviews = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        userId,
        type,
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await fetch(`/api/reviews?${params}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      
      if (page === 1) {
        setReviews(data.reviews);
      } else {
        setReviews(prev => [...prev, ...data.reviews]);
      }
      
      setAverageRating(data.averageRating);
      setTotalReviews(data.totalReviews);
      setCurrentPage(page);
      setHasMore(data.pagination.hasNext);

    } catch (err) {
      console.error("Fetch reviews error:", err);
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  }, [userId, type, limit]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const renderStars = (rating: number, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${size} ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (isLoading && reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      {showHeader && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {type === "received" ? "Reviews Received" : "Reviews Given"}
            </h2>
            {type === "received" && totalReviews > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                </span>
              </div>
            )}
          </div>

          {type === "received" && totalReviews > 0 && (
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter(r => r.rating === stars).length;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                
                return (
                  <div key={stars} className="flex items-center gap-2 text-sm">
                    <span className="w-3 text-gray-600">{stars}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-xs text-gray-500">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600">
            {type === "received" 
              ? "No reviews have been received yet." 
              : "No reviews have been given yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const displayUser = type === "received" ? review.giver : review.receiver;
            
            return (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center overflow-hidden">
                      {displayUser.image ? (
                        <Image
                          src={displayUser.image}
                          alt={displayUser.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-sky-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{displayUser.name}</h4>
                      {displayUser.location && (
                        <p className="text-sm text-gray-500">{displayUser.location}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      {renderStars(review.rating)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                {review.comment && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={() => fetchReviews(currentPage + 1)}
                disabled={isLoading}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Loading..." : "Load More Reviews"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
