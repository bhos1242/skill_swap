import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch messages for a conversation
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
    const swapRequestId = searchParams.get("swapRequestId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    if (!swapRequestId) {
      return NextResponse.json(
        { message: "swapRequestId parameter is required" },
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

    // Verify user is part of this swap request
    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id: swapRequestId }
    });

    if (!swapRequest) {
      return NextResponse.json(
        { message: "Swap request not found" },
        { status: 404 }
      );
    }

    if (swapRequest.senderId !== currentUser.id && swapRequest.receiverId !== currentUser.id) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    // Fetch messages
    const [messages, totalCount] = await Promise.all([
      (prisma as unknown as { message: { findMany: (args: Record<string, unknown>) => Promise<unknown[]> } }).message.findMany({
        where: { swapRequestId },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        },
        skip: offset,
        take: limit
      }),
      (prisma as unknown as { message: { count: (args: Record<string, unknown>) => Promise<number> } }).message.count({
        where: { swapRequestId }
      })
    ]);

    // Mark messages as read for current user
    await (prisma as unknown as { message: { updateMany: (args: Record<string, unknown>) => Promise<unknown> } }).message.updateMany({
      where: {
        swapRequestId,
        senderId: { not: currentUser.id },
        readAt: null
      },
      data: {
        readAt: new Date()
      }
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      messages: messages || [],
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
    console.error("Fetch messages error:", error);
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

// POST - Send a new message
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
    const { swapRequestId, content, messageType = "TEXT" } = body;

    // Validate required fields
    if (!swapRequestId || !content?.trim()) {
      return NextResponse.json(
        { message: "Missing required fields: swapRequestId, content" },
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

    // Verify user is part of this swap request
    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id: swapRequestId }
    });

    if (!swapRequest) {
      return NextResponse.json(
        { message: "Swap request not found" },
        { status: 404 }
      );
    }

    if (swapRequest.senderId !== currentUser.id && swapRequest.receiverId !== currentUser.id) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    // Create the message
    const message = await (prisma as unknown as { message: { create: (args: Record<string, unknown>) => Promise<unknown> } }).message.create({
      data: {
        swapRequestId,
        senderId: currentUser.id,
        content: content.trim(),
        messageType
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json({
      message: "Message sent successfully",
      data: message
    }, { status: 201 });

  } catch (error) {
    console.error("Send message error:", error);
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
