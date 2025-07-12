import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { 
  filterUsers, 
  sortByCompatibility, 
  UserProfile as MatchingUserProfile 
} from "@/lib/utils/skill-matching";

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
    const skillsOffered = searchParams.get("skillsOffered")?.split(",").filter(Boolean) || [];
    const skillsWanted = searchParams.get("skillsWanted")?.split(",").filter(Boolean) || [];
    const minRating = searchParams.get("minRating") ? parseFloat(searchParams.get("minRating")!) : undefined;
    const availabilityDays = searchParams.get("availabilityDays")?.split(",").filter(Boolean) || [];
    const availabilityTimes = searchParams.get("availabilityTimes")?.split(",").filter(Boolean) || [];
    const sortBy = searchParams.get("sortBy") || "compatibility"; // compatibility, rating, recent
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Get current user's profile for matching
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    }) as any;

    if (!currentUser) {
      return NextResponse.json(
        { message: "Current user not found" },
        { status: 404 }
      );
    }

    // Parse current user's availability
    let currentUserAvailability = null;
    try {
      if (currentUser.availabilityData) {
        currentUserAvailability = JSON.parse(currentUser.availabilityData);
      }
    } catch (error) {
      console.log("Error parsing current user availability:", error);
    }

    // Get all other users (excluding current user)
    const allUsers = await prisma.user.findMany({
      where: {
        email: {
          not: session.user.email
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    }) as any[];

    // Transform users to match the expected format
    const transformedUsers: MatchingUserProfile[] = allUsers.map((user: any) => {
      let availability = null;
      try {
        if (user.availabilityData) {
          availability = JSON.parse(user.availabilityData);
        }
      } catch (error) {
        console.log("Error parsing user availability:", error);
      }

      return {
        id: user.id,
        name: user.name || "Unknown User",
        image: user.image || null,
        location: user.location || null,
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        bio: user.bio || null,
        timezone: user.timezone || null,
        availability: availability || {
          weekdays: false,
          weekends: false,
          mornings: false,
          afternoons: false,
          evenings: false,
          flexible: false
        },
        averageRating: 0, // TODO: Calculate from reviews
        reviewCount: 0, // TODO: Calculate from reviews
        createdAt: user.createdAt.toISOString()
      };
    });

    // Apply filters
    const filteredUsers = filterUsers(transformedUsers, {
      searchTerm: search,
      location,
      skillsOffered,
      skillsWanted,
      minRating,
      availabilityDays,
      availabilityTimes
    });

    // Sort users based on sortBy parameter
    let sortedUsers;
    if (sortBy === "compatibility") {
      const currentUserProfile = {
        skillsOffered: currentUser.skillsOffered || [],
        skillsWanted: currentUser.skillsWanted || [],
        location: currentUser.location,
        availability: currentUserAvailability
      };
      
      sortedUsers = sortByCompatibility(currentUserProfile, filteredUsers);
    } else if (sortBy === "rating") {
      sortedUsers = filteredUsers
        .map(user => ({ ...user, matchScore: null }))
        .sort((a, b) => b.averageRating - a.averageRating);
    } else { // recent
      sortedUsers = filteredUsers
        .map(user => ({ ...user, matchScore: null }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

    // Calculate pagination info
    const totalCount = sortedUsers.length;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      profiles: paginatedUsers.map(user => ({
        ...user,
        matchScore: user.matchScore ? {
          compatibilityScore: user.matchScore.compatibilityScore,
          skillMatches: user.matchScore.skillMatches,
          availabilityMatch: user.matchScore.availabilityMatch,
          locationMatch: user.matchScore.locationMatch,
          overallScore: user.matchScore.overallScore
        } : null
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        search,
        location,
        skillsOffered,
        skillsWanted,
        minRating,
        availabilityDays,
        availabilityTimes,
        sortBy
      }
    });

  } catch (error) {
    console.error("Enhanced search error:", error);
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
