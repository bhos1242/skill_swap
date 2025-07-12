"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Inbox,
  Filter,
  Calendar,
  MessageSquare,
  ArrowRight,
  MapPin,
  Star,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewForm } from "@/components/reviews/review-form";
import { MessageThread } from "@/components/messaging/message-thread";
import { ScheduleMeeting } from "@/components/scheduling/schedule-meeting";

interface SwapRequest {
  id: string;
  senderId: string;
  receiverId: string;
  skillOffered: string;
  skillWanted: string;
  message?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    image?: string;
    location?: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
    image?: string;
    location?: string;
  };
}

interface RequestsResponse {
  requests: SwapRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function RequestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<SwapRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "sent" | "received">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<RequestsResponse['pagination'] | null>(null);
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showMessageThread, setShowMessageThread] = useState<string | null>(null);
  const [showScheduleMeeting, setShowScheduleMeeting] = useState<string | null>(null);

  // Redirect if not authenticated
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

  const fetchRequests = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        type: activeTab,
        status: statusFilter,
        page: page.toString(),
        limit: "10"
      });

      const response = await fetch(`/api/swap-requests?${params}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }

      const data: RequestsResponse = await response.json();
      setRequests(data.requests);
      setPagination(data.pagination);
      setCurrentPage(page);

    } catch (err) {
      console.error("Fetch requests error:", err);
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/swap-requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update request");
      }

      // Refresh the requests list
      fetchRequests(currentPage);
    } catch (err) {
      console.error("Update request error:", err);
      setError(err instanceof Error ? err.message : "Failed to update request");
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchRequests();
    }
  }, [session, activeTab, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "ACCEPTED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "CANCELLED":
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canAcceptReject = (request: SwapRequest) => {
    return request.status === "PENDING" && request.receiverId === session?.user?.id;
  };

  const canComplete = (request: SwapRequest) => {
    return request.status === "ACCEPTED" && 
           (request.senderId === session?.user?.id || request.receiverId === session?.user?.id);
  };

  const canCancel = (request: SwapRequest) => {
    return request.status === "PENDING" && request.senderId === session?.user?.id;
  };

  const canReview = (request: SwapRequest) => {
    return request.status === "COMPLETED";
  };

  const canMessage = (request: SwapRequest) => {
    return request.status === "ACCEPTED" || request.status === "COMPLETED";
  };

  const canSchedule = (request: SwapRequest) => {
    return request.status === "ACCEPTED";
  };

  const handleReviewSubmit = async (reviewData: { rating: number; comment: string }) => {
    if (!showReviewForm) return;

    const request = requests.find(r => r.id === showReviewForm);
    if (!request) return;

    const isReceived = request.receiverId === session?.user?.id;
    const otherUser = isReceived ? request.sender : request.receiver;

    try {
      setIsSubmittingReview(true);

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: otherUser.id,
          rating: reviewData.rating,
          comment: reviewData.comment,
          swapId: request.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      setShowReviewForm(null);
      // Optionally refresh the requests list or show success message
    } catch (err) {
      console.error("Review submission error:", err);
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Skill Exchange Requests
          </h1>
          <p className="text-xl text-gray-600">
            Manage your skill exchange requests and connections
          </p>
        </div>

        {/* Tabs and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-white text-sky-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                All Requests
              </button>
              <button
                onClick={() => setActiveTab("sent")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "sent"
                    ? "bg-white text-sky-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Send className="w-4 h-4" />
                Sent
              </button>
              <button
                onClick={() => setActiveTab("received")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "received"
                    ? "bg-white text-sky-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Inbox className="w-4 h-4" />
                Received
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          {pagination && (
            <div className="text-sm text-gray-600">
              Showing {requests.length} of {pagination.total} requests
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
            <p className="text-gray-600">Loading requests...</p>
          </div>
        )}

        {/* Requests List */}
        {!isLoading && !error && (
          <>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === "sent" 
                    ? "You haven't sent any requests yet." 
                    : activeTab === "received"
                    ? "You haven't received any requests yet."
                    : "No requests to display."}
                </p>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Find People to Connect With
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => {
                  const isReceived = request.receiverId === session?.user?.id;
                  const otherUser = isReceived ? request.sender : request.receiver;
                  
                  return (
                    <div
                      key={request.id}
                      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {/* User Avatar */}
                          <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center overflow-hidden">
                            {otherUser.image ? (
                              <Image
                                src={otherUser.image}
                                alt={otherUser.name}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-sky-600" />
                            )}
                          </div>
                          
                          {/* User Info */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {otherUser.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              {otherUser.location && (
                                <>
                                  <MapPin className="w-3 h-3" />
                                  <span>{otherUser.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status}
                        </div>
                      </div>

                      {/* Skill Exchange Details */}
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-green-800 mb-1">
                            {isReceived ? "They want to learn:" : "You offered to teach:"}
                          </h4>
                          <p className="text-green-700 font-semibold">{request.skillOffered}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-800 mb-1">
                            {isReceived ? "They can teach:" : "You want to learn:"}
                          </h4>
                          <p className="text-blue-700 font-semibold">{request.skillWanted}</p>
                        </div>
                      </div>

                      {/* Message */}
                      {request.message && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h4 className="text-sm font-medium text-gray-800 mb-1">Message:</h4>
                          <p className="text-gray-700">{request.message}</p>
                        </div>
                      )}

                      {/* Actions and Timestamp */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {isReceived ? "Received" : "Sent"} {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {canAcceptReject(request) && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(request.id, "ACCEPTED")}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(request.id, "REJECTED")}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          
                          {canComplete(request) && (
                            <button
                              onClick={() => handleStatusUpdate(request.id, "COMPLETED")}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              Mark Complete
                            </button>
                          )}
                          
                          {canCancel(request) && (
                            <button
                              onClick={() => handleStatusUpdate(request.id, "CANCELLED")}
                              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                            >
                              Cancel
                            </button>
                          )}

                          {canMessage(request) && (
                            <button
                              onClick={() => setShowMessageThread(request.id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1"
                            >
                              <MessageSquare className="w-4 h-4" />
                              Message
                            </button>
                          )}

                          {canSchedule(request) && (
                            <button
                              onClick={() => setShowScheduleMeeting(request.id)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-1"
                            >
                              <Video className="w-4 h-4" />
                              Schedule
                            </button>
                          )}

                          {canReview(request) && (
                            <button
                              onClick={() => setShowReviewForm(request.id)}
                              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium flex items-center gap-1"
                            >
                              <Star className="w-4 h-4" />
                              Review
                            </button>
                          )}

                          <Link
                            href={`/profile/${otherUser.id}`}
                            className="px-4 py-2 border border-sky-600 text-sky-600 rounded-lg hover:bg-sky-50 transition-colors text-sm font-medium"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => fetchRequests(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => fetchRequests(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Message Thread Modal */}
        {showMessageThread && (
          (() => {
            const request = requests.find(r => r.id === showMessageThread);
            if (!request) return null;

            return (
              <MessageThread
                swapRequest={request}
                isOpen={true}
                onClose={() => setShowMessageThread(null)}
              />
            );
          })()
        )}

        {/* Schedule Meeting Modal */}
        {showScheduleMeeting && (
          (() => {
            const request = requests.find(r => r.id === showScheduleMeeting);
            if (!request) return null;

            const isReceived = request.receiverId === session?.user?.id;
            const otherUser = isReceived ? request.sender : request.receiver;

            return (
              <ScheduleMeeting
                swapRequestId={request.id}
                otherUserName={otherUser.name}
                skillOffered={request.skillOffered}
                skillWanted={request.skillWanted}
                isOpen={true}
                onClose={() => setShowScheduleMeeting(null)}
                onScheduled={() => {
                  setShowScheduleMeeting(null);
                  // Optionally show success message
                }}
              />
            );
          })()
        )}

        {/* Review Form Modal */}
        {showReviewForm && (
          (() => {
            const request = requests.find(r => r.id === showReviewForm);
            if (!request) return null;

            const isReceived = request.receiverId === session?.user?.id;
            const otherUser = isReceived ? request.sender : request.receiver;

            return (
              <ReviewForm
                receiverId={otherUser.id}
                receiverName={otherUser.name}
                swapId={request.id}
                onSubmit={handleReviewSubmit}
                onCancel={() => setShowReviewForm(null)}
                isLoading={isSubmittingReview}
              />
            );
          })()
        )}
      </div>
    </div>
  );
}
