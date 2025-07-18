import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch reviews for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type") || "received"; // received, given
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    if (!userId) {
      return NextResponse.json(
        { message: "userId parameter is required" },
        { status: 400 }
      );
    }

    // Build where clause
    const whereClause = type === "given" 
      ? { giverId: userId }
      : { receiverId: userId };

    // Fetch reviews with user details
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: whereClause,
        include: {
          giver: {
            select: {
              id: true,
              name: true,
              image: true,
              location: true
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              image: true,
              location: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip: offset,
        take: limit
      }),
      prisma.review.count({
        where: whereClause
      })
    ]);

    // Calculate average rating for received reviews
    const avgRating = await prisma.review.aggregate({
      where: { receiverId: userId },
      _avg: {
        rating: true
      }
    });

    // Calculate pagination
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      reviews: reviews || [],
      averageRating: avgRating._avg.rating || 0,
      totalReviews: totalCount,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("Fetch reviews error:", error);
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

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { receiverId, rating, comment, swapId } = body;

    // Validate required fields
    if (!receiverId || !rating) {
      return NextResponse.json(
        { message: "Missing required fields: receiverId, rating" },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    if (!receiver) {
      return NextResponse.json(
        { message: "Receiver not found" },
        { status: 404 }
      );
    }

    // Prevent reviewing self
    if (currentUser.id === receiverId) {
      return NextResponse.json(
        { message: "Cannot review yourself" },
        { status: 400 }
      );
    }

    // Check if review already exists for this swap
    if (swapId) {
      const existingReview = await prisma.review.findFirst({
        where: {
          giverId: currentUser.id,
          receiverId: receiverId,
          swapId: swapId
        }
      });

      if (existingReview) {
        return NextResponse.json(
          { message: "Review already exists for this swap" },
          { status: 409 }
        );
      }
    }

    // Verify that a completed swap exists between these users
    const completedSwap = await prisma.swapRequest.findFirst({
      where: {
        OR: [
          { senderId: currentUser.id, receiverId: receiverId },
          { senderId: receiverId, receiverId: currentUser.id }
        ],
        status: "COMPLETED"
      }
    });

    if (!completedSwap) {
      return NextResponse.json(
        { message: "Can only review users you have completed swaps with" },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        giverId: currentUser.id,
        receiverId: receiverId,
        rating: rating,
        comment: comment || "",
        swapId: swapId || null
      },
      include: {
        giver: {
          select: {
            id: true,
            name: true,
            image: true,
            location: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
            location: true
          }
        }
      }
    });

    return NextResponse.json({
      message: "Review created successfully",
      review: review
    }, { status: 201 });

  } catch (error) {
    console.error("Create review error:", error);
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
