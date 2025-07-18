import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Admin emails - in production, this should be in environment variables
const ADMIN_EMAILS = [
  "admin@skillswap.com",
  "bhosvivek123@gmail.com" // Add your email for testing
];

// GET - Fetch all users with admin privileges
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause: Record<string, unknown> = {};

    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          email: {
            contains: search,
            mode: "insensitive"
          }
        }
      ];
    }

    // Note: suspended functionality would require adding suspended field to schema
    // For now, we'll treat all users as active

    // Fetch users with stats
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          location: true,
          profileCompleted: true,
          createdAt: true,
          updatedAt: true,
          skillsOffered: true,
          skillsWanted: true
        },
        orderBy: {
          createdAt: "desc"
        },
        skip: offset,
        take: limit
      }),
      prisma.user.count({
        where: whereClause
      })
    ]);

    // Calculate pagination
    const totalPages = Math.ceil(totalCount / limit);

    // Get platform stats
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { profileCompleted: true } }),
      prisma.swapRequest.count(),
      prisma.swapRequest.count({ where: { status: "COMPLETED" } }),
      prisma.review.count()
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats: {
        totalUsers: stats[0],
        completedProfiles: stats[1],
        totalRequests: stats[2],
        completedSwaps: stats[3],
        totalReviews: stats[4]
      }
    });

  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH - Update user status (suspend/unsuspend)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { message: "Missing required fields: userId, action" },
        { status: 400 }
      );
    }

    if (!["suspend", "unsuspend", "delete"].includes(action)) {
      return NextResponse.json(
        { message: "Invalid action. Must be: suspend, unsuspend, or delete" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Prevent admin from suspending themselves
    if (user.email === session.user.email) {
      return NextResponse.json(
        { message: "Cannot perform this action on your own account" },
        { status: 400 }
      );
    }

    if (action === "delete") {
      // In production, you might want to soft delete or archive instead
      await prisma.user.delete({
        where: { id: userId }
      });

      return NextResponse.json({
        message: "User deleted successfully"
      });
    } else {
      // For now, just return success message since suspended field doesn't exist
      return NextResponse.json({
        message: `User ${action} action noted (suspended field not implemented in current schema)`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    }

  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
