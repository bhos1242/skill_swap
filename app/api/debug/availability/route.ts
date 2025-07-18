import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Try to get availability data
    let availability = null;
    let availabilityError = null;

    try {
      availability = await prisma.userAvailability.findUnique({
        where: { userId: user.id }
      });
    } catch (error) {
      availabilityError = error instanceof Error ? error.message : "Unknown error";
    }

    // Get all availability records for debugging
    let allAvailability = [];
    try {
      allAvailability = await prisma.userAvailability.findMany();
    } catch (error) {
      console.log("Error fetching all availability:", error);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      availability,
      availabilityError,
      allAvailabilityRecords: allAvailability.length,
      debug: {
        userAvailabilityModelExists: !!prisma.userAvailability,
        prismaModels: Object.keys(prisma).filter(key => !key.startsWith('$'))
      }
    });

  } catch (error) {
    console.error("Debug availability error:", error);
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
