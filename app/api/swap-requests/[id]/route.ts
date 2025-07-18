import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch a specific swap request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: requestId } = await params;

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

    // Fetch the swap request
    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id: requestId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            location: true,
            skillsOffered: true,
            skillsWanted: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            location: true,
            skillsOffered: true,
            skillsWanted: true
          }
        }
      }
    });

    if (!swapRequest) {
      return NextResponse.json(
        { message: "Swap request not found" },
        { status: 404 }
      );
    }

    // Check if user is involved in this request
    if (swapRequest.senderId !== currentUser.id && swapRequest.receiverId !== currentUser.id) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({ request: swapRequest });

  } catch (error) {
    console.error("Fetch swap request error:", error);
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

// PATCH - Update swap request status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: requestId } = await params;
    const body = await request.json();
    const { status, message } = body;

    // Validate status
    const validStatuses = ["ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status. Must be one of: " + validStatuses.join(", ") },
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

    // Fetch the swap request
    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id: requestId }
    });

    if (!swapRequest) {
      return NextResponse.json(
        { message: "Swap request not found" },
        { status: 404 }
      );
    }

    // Check permissions based on action
    if (status === "ACCEPTED" || status === "REJECTED") {
      // Only receiver can accept/reject
      if (swapRequest.receiverId !== currentUser.id) {
        return NextResponse.json(
          { message: "Only the receiver can accept or reject requests" },
          { status: 403 }
        );
      }
    } else if (status === "CANCELLED") {
      // Only sender can cancel (and only if pending)
      if (swapRequest.senderId !== currentUser.id) {
        return NextResponse.json(
          { message: "Only the sender can cancel requests" },
          { status: 403 }
        );
      }
      if (swapRequest.status !== "PENDING") {
        return NextResponse.json(
          { message: "Can only cancel pending requests" },
          { status: 400 }
        );
      }
    } else if (status === "COMPLETED") {
      // Either party can mark as completed (if accepted)
      if (swapRequest.senderId !== currentUser.id && swapRequest.receiverId !== currentUser.id) {
        return NextResponse.json(
          { message: "Access denied" },
          { status: 403 }
        );
      }
      if (swapRequest.status !== "ACCEPTED") {
        return NextResponse.json(
          { message: "Can only complete accepted requests" },
          { status: 400 }
        );
      }
    }

    // Update the request
    const updatedRequest = await prisma.swapRequest.update({
      where: { id: requestId },
      data: {
        status: status,
        ...(message && { message: message })
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
      message: `Request ${status.toLowerCase()} successfully`,
      request: updatedRequest
    });

  } catch (error) {
    console.error("Update swap request error:", error);
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

// DELETE - Delete a swap request (only sender can delete pending requests)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: requestId } = await params;

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

    // Fetch the swap request
    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id: requestId }
    });

    if (!swapRequest) {
      return NextResponse.json(
        { message: "Swap request not found" },
        { status: 404 }
      );
    }

    // Only sender can delete, and only pending requests
    if (swapRequest.senderId !== currentUser.id) {
      return NextResponse.json(
        { message: "Only the sender can delete requests" },
        { status: 403 }
      );
    }

    if (swapRequest.status !== "PENDING") {
      return NextResponse.json(
        { message: "Can only delete pending requests" },
        { status: 400 }
      );
    }

    // Delete the request
    await prisma.swapRequest.delete({
      where: { id: requestId }
    });

    return NextResponse.json({
      message: "Request deleted successfully"
    });

  } catch (error) {
    console.error("Delete swap request error:", error);
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
