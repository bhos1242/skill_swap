"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  UserCheck,
  MessageSquare,
  Star,
  TrendingUp,
  Search,
  Shield,
  AlertTriangle,
  Ban,
  CheckCircle,
  Trash2,
  MapPin,
  Calendar,
  User
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  location?: string;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  skillsOffered: string[];
  skillsWanted: string[];
}

interface AdminStats {
  totalUsers: number;
  completedProfiles: number;
  totalRequests: number;
  completedSwaps: number;
  totalReviews: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: "suspend" | "unsuspend" | "delete" | null;
    user: AdminUser | null;
  }>({
    open: false,
    action: null,
    user: null
  });

  // Check admin access
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    } else if (status === "authenticated") {
      // Check if user is admin (you can implement this check)
      const adminEmails = ["admin@skillswap.com", "bhosvivek123@gmail.com"];
      if (!session?.user?.email || !adminEmails.includes(session.user.email)) {
        router.push("/");
      }
    }
  }, [status, session, router]);

  const fetchUsers = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        search: searchTerm,
        status: statusFilter
      });

      const response = await fetch(`/api/admin/users?${params}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users);
      setStats(data.stats);
      setCurrentPage(page);
      setTotalPages(data.pagination.totalPages);

    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAction = async (action: "suspend" | "unsuspend" | "delete") => {
    if (!actionDialog.user) return;

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: actionDialog.user.id,
          action
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      setActionDialog({ open: false, action: null, user: null });
      fetchUsers(currentPage); // Refresh the list

    } catch (err) {
      console.error("User action error:", err);
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchUsers();
    }
  }, [session, searchTerm, statusFilter]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Manage users and monitor platform activity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-sky-600" />
            <span className="text-sm font-medium text-gray-700">
              Admin Access
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Profiles</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedProfiles}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.completedProfiles / stats.totalUsers) * 100).toFixed(1)}% completion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRequests}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Swaps</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedSwaps}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalRequests > 0 ? ((stats.completedSwaps / stats.totalRequests) * 100).toFixed(1) : 0}% success rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalReviews}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Search, filter, and manage platform users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="all">All Users</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                {/* Users Table */}
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading users...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">{error}</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center overflow-hidden">
                                  {user.image ? (
                                    <Image
                                      src={user.image}
                                      alt={user.name}
                                      width={40}
                                      height={40}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <User className="w-5 h-5 text-sky-600" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-gray-500">{user.email}</p>
                                  {user.location && (
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                      <MapPin className="w-3 h-3" />
                                      {user.location}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Badge variant="default">Active</Badge>
                                {user.profileCompleted ? (
                                  <Badge variant="secondary">Profile Complete</Badge>
                                ) : (
                                  <Badge variant="outline">Profile Incomplete</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm space-y-1">
                                <div>Skills Offered: {user.skillsOffered?.length || 0}</div>
                                <div>Skills Wanted: {user.skillsWanted?.length || 0}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Calendar className="w-3 h-3" />
                                {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setActionDialog({
                                    open: true,
                                    action: "suspend",
                                    user
                                  })}
                                >
                                  <Ban className="w-4 h-4 mr-1" />
                                  Suspend
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setActionDialog({
                                    open: true,
                                    action: "delete",
                                    user
                                  })}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => fetchUsers(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => fetchUsers(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>
                  Detailed analytics and reporting (Coming Soon)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Advanced analytics dashboard with charts and detailed reports will be available here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation">
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>
                  Review and moderate user-generated content (Coming Soon)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Content moderation tools for reviews, profiles, and messages will be available here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Confirmation Dialog */}
        <Dialog open={actionDialog.open} onOpenChange={(open) => 
          setActionDialog({ open, action: null, user: null })
        }>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionDialog.action === "delete" ? "Delete User" : 
                 actionDialog.action === "suspend" ? "Suspend User" : "Unsuspend User"}
              </DialogTitle>
              <DialogDescription>
                {actionDialog.action === "delete" 
                  ? `Are you sure you want to permanently delete ${actionDialog.user?.name}? This action cannot be undone.`
                  : actionDialog.action === "suspend"
                  ? `Are you sure you want to suspend ${actionDialog.user?.name}? They will not be able to access the platform.`
                  : `Are you sure you want to unsuspend ${actionDialog.user?.name}? They will regain access to the platform.`
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setActionDialog({ open: false, action: null, user: null })}
              >
                Cancel
              </Button>
              <Button
                variant={actionDialog.action === "delete" ? "destructive" : "default"}
                onClick={() => actionDialog.action && handleUserAction(actionDialog.action)}
              >
                {actionDialog.action === "delete" ? (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete User
                  </>
                ) : actionDialog.action === "suspend" ? (
                  <>
                    <Ban className="w-4 h-4 mr-2" />
                    Suspend User
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Unsuspend User
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
