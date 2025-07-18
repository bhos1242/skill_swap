export interface UserProfile {
  id: string;
  name: string;
  image?: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  bio?: string;
  timezone?: string;
  availability?: {
    weekdays: boolean;
    weekends: boolean;
    mornings: boolean;
    afternoons: boolean;
    evenings: boolean;
    flexible: boolean;
  };
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface MatchScore {
  userId: string;
  compatibilityScore: number;
  skillMatches: {
    canTeach: string[];
    canLearn: string[];
  };
  availabilityMatch: number;
  locationMatch: boolean;
  overallScore: number;
}

/**
 * Calculate skill compatibility between current user and other users
 */
export function calculateSkillCompatibility(
  currentUserSkills: { offered: string[], wanted: string[] },
  otherUser: UserProfile
): MatchScore {
  const skillMatches = {
    canTeach: [] as string[],
    canLearn: [] as string[]
  };

  // Find skills the current user can teach to the other user
  currentUserSkills.offered.forEach(skill => {
    if (otherUser.skillsWanted.includes(skill)) {
      skillMatches.canTeach.push(skill);
    }
  });

  // Find skills the current user can learn from the other user
  currentUserSkills.wanted.forEach(skill => {
    if (otherUser.skillsOffered.includes(skill)) {
      skillMatches.canLearn.push(skill);
    }
  });

  // Calculate compatibility score (0-100)
  const teachScore = skillMatches.canTeach.length * 20; // Max 100 for 5 matches
  const learnScore = skillMatches.canLearn.length * 20; // Max 100 for 5 matches
  const compatibilityScore = Math.min(100, (teachScore + learnScore) / 2);

  return {
    userId: otherUser.id,
    compatibilityScore,
    skillMatches,
    availabilityMatch: 0, // Will be calculated separately
    locationMatch: false, // Will be calculated separately
    overallScore: compatibilityScore
  };
}

/**
 * Calculate availability compatibility between users
 */
export function calculateAvailabilityMatch(
  currentUserAvailability: UserProfile['availability'],
  otherUserAvailability: UserProfile['availability']
): number {
  if (!currentUserAvailability || !otherUserAvailability) {
    return 0;
  }

  let matches = 0;
  let total = 0;

  // Check day preferences
  if (currentUserAvailability.weekdays && otherUserAvailability.weekdays) matches++;
  if (currentUserAvailability.weekends && otherUserAvailability.weekends) matches++;
  total += 2;

  // Check time preferences
  if (currentUserAvailability.mornings && otherUserAvailability.mornings) matches++;
  if (currentUserAvailability.afternoons && otherUserAvailability.afternoons) matches++;
  if (currentUserAvailability.evenings && otherUserAvailability.evenings) matches++;
  total += 3;

  // Flexible users get bonus compatibility
  if (currentUserAvailability.flexible || otherUserAvailability.flexible) {
    matches += 1;
    total += 1;
  }

  return total > 0 ? (matches / total) * 100 : 0;
}

/**
 * Check if users are in the same location (basic string matching)
 */
export function calculateLocationMatch(
  currentUserLocation: string | undefined,
  otherUserLocation: string | undefined
): boolean {
  if (!currentUserLocation || !otherUserLocation) {
    return false;
  }

  // Simple location matching - can be enhanced with geocoding
  const currentLocation = currentUserLocation.toLowerCase().trim();
  const otherLocation = otherUserLocation.toLowerCase().trim();

  return currentLocation === otherLocation ||
    currentLocation.includes(otherLocation) ||
    otherLocation.includes(currentLocation);
}

/**
 * Calculate overall match score combining all factors
 */
export function calculateOverallMatch(
  currentUser: {
    skillsOffered: string[];
    skillsWanted: string[];
    location?: string;
    availability?: UserProfile['availability'];
  },
  otherUser: UserProfile
): MatchScore {
  const skillMatch = calculateSkillCompatibility(
    { offered: currentUser.skillsOffered, wanted: currentUser.skillsWanted },
    otherUser
  );

  const availabilityMatch = calculateAvailabilityMatch(
    currentUser.availability,
    otherUser.availability
  );

  const locationMatch = calculateLocationMatch(
    currentUser.location,
    otherUser.location
  );

  // Weight the different factors
  const skillWeight = 0.6;      // 60% - most important
  const availabilityWeight = 0.3; // 30% - important for scheduling
  const locationWeight = 0.1;    // 10% - nice to have

  const overallScore =
    (skillMatch.compatibilityScore * skillWeight) +
    (availabilityMatch * availabilityWeight) +
    (locationMatch ? 100 * locationWeight : 0);

  return {
    ...skillMatch,
    availabilityMatch,
    locationMatch,
    overallScore: Math.round(overallScore)
  };
}

/**
 * Sort users by compatibility score
 */
export function sortByCompatibility(
  currentUser: {
    skillsOffered: string[];
    skillsWanted: string[];
    location?: string;
    availability?: UserProfile['availability'];
  },
  users: UserProfile[]
): (UserProfile & { matchScore: MatchScore })[] {
  return users
    .map(user => ({
      ...user,
      matchScore: calculateOverallMatch(currentUser, user)
    }))
    .sort((a, b) => b.matchScore.overallScore - a.matchScore.overallScore);
}

/**
 * Filter users based on search criteria
 */
export function filterUsers(
  users: UserProfile[],
  filters: {
    searchTerm?: string;
    location?: string;
    skillsOffered?: string[];
    skillsWanted?: string[];
    minRating?: number;
    availabilityDays?: string[];
    availabilityTimes?: string[];
  }
): UserProfile[] {
  return users.filter(user => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesName = user.name.toLowerCase().includes(searchLower);
      const matchesBio = user.bio?.toLowerCase().includes(searchLower) || false;
      const matchesSkills = [
        ...user.skillsOffered,
        ...user.skillsWanted
      ].some(skill => skill.toLowerCase().includes(searchLower));

      if (!matchesName && !matchesBio && !matchesSkills) {
        return false;
      }
    }

    // Location filter
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      if (!user.location?.toLowerCase().includes(locationLower)) {
        return false;
      }
    }

    // Skills offered filter
    if (filters.skillsOffered && filters.skillsOffered.length > 0) {
      const hasOfferedSkill = filters.skillsOffered.some(skill =>
        user.skillsOffered.some(userSkill =>
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      if (!hasOfferedSkill) {
        return false;
      }
    }

    // Skills wanted filter
    if (filters.skillsWanted && filters.skillsWanted.length > 0) {
      const hasWantedSkill = filters.skillsWanted.some(skill =>
        user.skillsWanted.some(userSkill =>
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      if (!hasWantedSkill) {
        return false;
      }
    }

    // Rating filter
    if (filters.minRating && user.averageRating < filters.minRating) {
      return false;
    }

    // Availability filters
    if (filters.availabilityDays && filters.availabilityDays.length > 0 && user.availability) {
      const hasMatchingDay = filters.availabilityDays.some(day => {
        switch (day) {
          case 'weekdays': return user.availability!.weekdays;
          case 'weekends': return user.availability!.weekends;
          default: return false;
        }
      });
      if (!hasMatchingDay) {
        return false;
      }
    }

    if (filters.availabilityTimes && filters.availabilityTimes.length > 0 && user.availability) {
      const hasMatchingTime = filters.availabilityTimes.some(time => {
        switch (time) {
          case 'mornings': return user.availability!.mornings;
          case 'afternoons': return user.availability!.afternoons;
          case 'evenings': return user.availability!.evenings;
          case 'flexible': return user.availability!.flexible;
          default: return false;
        }
      });
      if (!hasMatchingTime) {
        return false;
      }
    }

    return true;
  });
}
