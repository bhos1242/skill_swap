import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch user's swap requests (sent and received)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all"; // all, sent, received
    const status = searchParams.get("status") || "all"; // all, pending, accepted, rejected, completed, cancelled
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

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

    // Build where clause
    const whereClause: Record<string, unknown> = {};

    if (type === "sent") {
      whereClause.senderId = currentUser.id;
    } else if (type === "received") {
      whereClause.receiverId = currentUser.id;
    } else {
      whereClause.OR = [
        { senderId: currentUser.id },
        { receiverId: currentUser.id }
      ];
    }

    if (status !== "all") {
      whereClause.status = status.toUpperCase();
    }

    // Fetch requests with user details
    const [requests, totalCount] = await Promise.all([
      prisma.swapRequest.findMany({
        where: whereClause,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              location: true
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
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
      prisma.swapRequest.count({
        where: whereClause
      })
    ]);

    // Calculate pagination
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      requests: requests || [],
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
    console.error("Fetch swap requests error:", error);
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

// POST - Create a new swap request
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
    const { receiverId, skillOffered, skillWanted, message } = body;

    // Validate required fields
    if (!receiverId || !skillOffered || !skillWanted) {
      return NextResponse.json(
        { message: "Missing required fields: receiverId, skillOffered, skillWanted" },
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

    // Prevent sending request to self
    if (currentUser.id === receiverId) {
      return NextResponse.json(
        { message: "Cannot send swap request to yourself" },
        { status: 400 }
      );
    }

    // Check for existing pending request between these users for the same skills
    const existingRequest = await prisma.swapRequest.findFirst({
      where: {
        senderId: currentUser.id,
        receiverId: receiverId,
        skillOffered: skillOffered,
        skillWanted: skillWanted,
        status: "PENDING"
      }
    });

    if (existingRequest) {
      return NextResponse.json(
        { message: "A pending request already exists for these skills" },
        { status: 409 }
      );
    }

    // Create the swap request
    const swapRequest = await prisma.swapRequest.create({
      data: {
        senderId: currentUser.id,
        receiverId: receiverId,
        skillOffered: skillOffered,
        skillWanted: skillWanted,
        message: message || "",
        status: "PENDING"
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            location: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            location: true
          }
        }
      }
    });

    return NextResponse.json({
      message: "Swap request sent successfully",
      request: swapRequest
    }, { status: 201 });

  } catch (error) {
    console.error("Create swap request error:", error);
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
