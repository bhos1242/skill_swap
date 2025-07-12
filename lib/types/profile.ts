export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  image?: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: UserAvailability;
  profileVisibility: ProfileVisibility;
  profileCompleted: boolean;
  bio?: string;
  timezone?: string;
}

export interface UserAvailability {
  weekdays: boolean;
  weekends: boolean;
  mornings: boolean;
  afternoons: boolean;
  evenings: boolean;
  flexible: boolean;
}

export enum ProfileVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export interface ProfileSetupFormData {
  name: string;
  location: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: UserAvailability;
  profileVisibility: ProfileVisibility;
  bio: string;
  timezone: string;
}

export interface ProfileSetupStep {
  id: number;
  title: string;
  description: string;
  fields: string[];
  isValid: (data: Partial<ProfileSetupFormData>) => boolean;
}

// Predefined skill categories for the skill selector
export const SKILL_CATEGORIES = {
  'Technology': [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Cybersecurity',
    'Cloud Computing',
    'DevOps',
    'UI/UX Design',
    'Database Management',
    'Software Testing'
  ],
  'Creative': [
    'Graphic Design',
    'Photography',
    'Video Editing',
    'Creative Writing',
    'Digital Art',
    'Animation',
    'Web Design',
    'Logo Design',
    'Illustration',
    'Content Creation'
  ],
  'Business': [
    'Digital Marketing',
    'Project Management',
    'Sales',
    'Accounting',
    'Business Strategy',
    'Leadership',
    'Public Speaking',
    'Negotiation',
    'Customer Service',
    'Entrepreneurship'
  ],
  'Languages': [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Chinese (Mandarin)',
    'Japanese',
    'Korean',
    'Arabic'
  ],
  'Health & Fitness': [
    'Yoga',
    'Personal Training',
    'Nutrition',
    'Meditation',
    'Pilates',
    'Running',
    'Weight Training',
    'Mental Health',
    'Massage Therapy',
    'Dance'
  ],
  'Culinary': [
    'Cooking',
    'Baking',
    'Wine Tasting',
    'Cocktail Making',
    'Vegetarian Cooking',
    'International Cuisine',
    'Food Photography',
    'Meal Planning',
    'Grilling',
    'Pastry Making'
  ],
  'Crafts & Hobbies': [
    'Knitting',
    'Woodworking',
    'Gardening',
    'Pottery',
    'Jewelry Making',
    'Painting',
    'Sewing',
    'Origami',
    'Calligraphy',
    'DIY Projects'
  ],
  'Music': [
    'Guitar',
    'Piano',
    'Violin',
    'Drums',
    'Singing',
    'Music Theory',
    'Songwriting',
    'Audio Engineering',
    'DJ Skills',
    'Music Production',
    'Bass Guitar',
    'Saxophone'
  ]
} as const;

// Common timezones for the timezone selector
export const COMMON_TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney',
  'Pacific/Auckland'
] as const;

export type SkillCategory = keyof typeof SKILL_CATEGORIES;
export type Skill = typeof SKILL_CATEGORIES[SkillCategory][number];
export type Timezone = typeof COMMON_TIMEZONES[number];
