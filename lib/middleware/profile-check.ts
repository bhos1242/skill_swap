import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkProfileCompletion(email: string): Promise<{
  isComplete: boolean;
  user?: any;
}> {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return { isComplete: false };
    }

    // For now, just check if user exists and has a name
    // The actual profile completion will be handled by the API
    const hasBasicInfo = Boolean(user.name && user.email);

    return {
      isComplete: hasBasicInfo,
      user
    };
  } catch (error) {
    console.error("Profile completion check error:", error);
    return { isComplete: false };
  } finally {
    await prisma.$disconnect();
  }
}

export async function requireCompleteProfile() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return { redirect: "/sign-in" };
  }

  const { isComplete } = await checkProfileCompletion(session.user.email);

  if (!isComplete) {
    return { redirect: "/profile/setup" };
  }

  return { redirect: null };
}
