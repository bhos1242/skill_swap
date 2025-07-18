import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { ProfileSetupFormData } from "@/lib/types/profile";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: ProfileSetupFormData = await request.json();

    // Validate required fields
    const errors: string[] = [];

    if (!body.name?.trim()) {
      errors.push("Name is required");
    }

    if (!body.skillsOffered || body.skillsOffered.length === 0) {
      errors.push("At least one skill offered is required");
    }

    if (!body.skillsWanted || body.skillsWanted.length === 0) {
      errors.push("At least one skill wanted is required");
    }

    if (!body.availability || !Object.values(body.availability).some(Boolean)) {
      errors.push("Availability selection is required");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Update user profile - using any type to handle Prisma type issues
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: body.name.trim(),
        ...(body.location && { location: body.location.trim() }),
        ...(body.skillsOffered && { skillsOffered: body.skillsOffered }),
        ...(body.skillsWanted && { skillsWanted: body.skillsWanted }),
        ...(body.profileVisibility && { profileVisibility: body.profileVisibility }),
        ...(body.bio && { bio: body.bio.trim() }),
        ...(body.timezone && { timezone: body.timezone }),
        // Store availability as JSON string
        ...(body.availability && {
          availabilityData: JSON.stringify(body.availability)
        }),
      }
    });

    // Availability is now stored in the user record as JSON

    // Return updated user profile
    const userWithProfile = updatedUser;

    // Parse availability from JSON
    let availability = null;
    try {
      if (userWithProfile.availabilityData) {
        availability = JSON.parse(userWithProfile.availabilityData);
      }
    } catch (error) {
      console.log("Availability parse error:", error);
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: userWithProfile.id,
        name: userWithProfile.name,
        email: userWithProfile.email,
        image: userWithProfile.image, // Preserve Google profile image
        location: userWithProfile.location || null,
        skillsOffered: userWithProfile.skillsOffered || [],
        skillsWanted: userWithProfile.skillsWanted || [],
        profileVisibility: userWithProfile.profileVisibility || "PUBLIC",
        profileCompleted: true,
        bio: userWithProfile.bio || null,
        timezone: userWithProfile.timezone || "America/New_York",
        availability: availability,
        createdAt: userWithProfile.createdAt,
        updatedAt: userWithProfile.updatedAt
      }
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
