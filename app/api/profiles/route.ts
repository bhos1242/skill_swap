import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    // Build where clause for filtering
    const whereClause: Record<string, unknown> = {
      email: {
        not: session.user.email
      }
    };

    // Add search filters - simplified for now
    if (search) {
      whereClause.name = {
        contains: search,
        mode: "insensitive"
      };
    }

    if (location) {
      whereClause.location = {
        contains: location,
        mode: "insensitive"
      };
    }

    // Get profiles with pagination - simplified to avoid type issues
    const [profiles, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
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

    // Add default values for missing fields and ensure Google image is included
    const profilesWithDefaults = profiles.map((profile) => ({
      id: profile.id,
      name: profile.name || "Unknown User",
      image: profile.image, // Keep Google profile image
      email: profile.email, // Include email for debugging
      location: profile.location || null,
      skillsOffered: profile.skillsOffered || [],
      skillsWanted: profile.skillsWanted || [],
      bio: profile.bio || null,
      timezone: profile.timezone || "America/New_York",
      availabilityData: profile.availabilityData || null,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      averageRating: 0, // Default rating
      reviewCount: 0 // Default review count
    }));

    return NextResponse.json({
      profiles: profilesWithDefaults,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("Get profiles error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
