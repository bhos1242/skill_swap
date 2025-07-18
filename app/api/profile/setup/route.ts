import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { ProfileSetupFormData } from "@/lib/types/profile";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
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

    // Find the user by email
    let existingUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!existingUser) {
      // If user doesn't exist, create them first (this shouldn't happen with proper OAuth flow)
      existingUser = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || ""
        }
      });
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: body.name.trim(),
        ...(body.location && { location: body.location.trim() }),
        ...(body.skillsOffered && { skillsOffered: body.skillsOffered }),
        ...(body.skillsWanted && { skillsWanted: body.skillsWanted }),
        ...(body.profileVisibility && { profileVisibility: body.profileVisibility }),
        profileCompleted: true,
        ...(body.bio && { bio: body.bio.trim() }),
        ...(body.timezone && { timezone: body.timezone }),
        // Store availability as JSON string for now
        ...(body.availability && {
          availabilityData: JSON.stringify(body.availability)
        }),
      }
    });

    // Handle availability separately if the relation exists
    if (body.availability) {
      try {
        // Try to create/update availability record
        const availabilityModel = prisma.userAvailability;
        if (availabilityModel) {
          await availabilityModel.upsert({
            where: { userId: updatedUser.id },
            create: {
              userId: updatedUser.id,
              weekdays: body.availability.weekdays,
              weekends: body.availability.weekends,
              mornings: body.availability.mornings,
              afternoons: body.availability.afternoons,
              evenings: body.availability.evenings,
              flexible: body.availability.flexible,
            },
            update: {
              weekdays: body.availability.weekdays,
              weekends: body.availability.weekends,
              mornings: body.availability.mornings,
              afternoons: body.availability.afternoons,
              evenings: body.availability.evenings,
              flexible: body.availability.flexible,
            }
          });
        }
      } catch (availabilityError) {
        console.log("Availability update skipped:", availabilityError);
      }
    }

    // Return profile data
    const userWithProfile = updatedUser;

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
        availability: userWithProfile.availabilityData ? JSON.parse(userWithProfile.availabilityData) : null,
        createdAt: userWithProfile.createdAt,
        updatedAt: userWithProfile.updatedAt
      }
    });

  } catch (error) {
    console.error("Profile setup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Parse availability data from JSON field
    let availability = {
      weekdays: false,
      weekends: false,
      mornings: false,
      afternoons: false,
      evenings: false,
      flexible: false
    };

    try {
      if (user.availabilityData) {
        const parsedAvailability = JSON.parse(user.availabilityData);
        availability = {
          weekdays: Boolean(parsedAvailability.weekdays),
          weekends: Boolean(parsedAvailability.weekends),
          mornings: Boolean(parsedAvailability.mornings),
          afternoons: Boolean(parsedAvailability.afternoons),
          evenings: Boolean(parsedAvailability.evenings),
          flexible: Boolean(parsedAvailability.flexible)
        };
      }
    } catch (error) {
      console.log("Availability parse error:", error);
    }

    // Combine user data with availability
    const userWithAvailability = {
      ...user,
      availability
    };

    return NextResponse.json({ user: userWithAvailability });

  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
