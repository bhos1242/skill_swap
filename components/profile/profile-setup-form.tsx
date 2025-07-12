"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, Check, User, BookOpen, Clock, Eye } from "lucide-react";
import { ProfileSetupFormData, ProfileVisibility, COMMON_TIMEZONES } from "@/lib/types/profile";
import { SkillSelector } from "./skill-selector";
import { AvailabilitySelector } from "./availability-selector";

const INITIAL_FORM_DATA: ProfileSetupFormData = {
  name: "",
  location: "",
  skillsOffered: [],
  skillsWanted: [],
  availability: {
    weekdays: false,
    weekends: false,
    mornings: false,
    afternoons: false,
    evenings: false,
    flexible: false
  },
  profileVisibility: ProfileVisibility.PUBLIC,
  bio: "",
  timezone: "America/New_York"
};

const STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "Tell us about yourself",
    icon: User,
    fields: ["name", "location", "bio", "timezone"]
  },
  {
    id: 2,
    title: "Skills You Offer",
    description: "What can you teach others?",
    icon: BookOpen,
    fields: ["skillsOffered"]
  },
  {
    id: 3,
    title: "Skills You Want",
    description: "What would you like to learn?",
    icon: BookOpen,
    fields: ["skillsWanted"]
  },
  {
    id: 4,
    title: "Availability",
    description: "When are you available?",
    icon: Clock,
    fields: ["availability"]
  },
  {
    id: 5,
    title: "Privacy Settings",
    description: "Control your profile visibility",
    icon: Eye,
    fields: ["profileVisibility"]
  }
];

interface ProfileSetupFormProps {
  onComplete: (data: ProfileSetupFormData) => Promise<void>;
  initialData?: Partial<ProfileSetupFormData>;
  isLoading?: boolean;
}

export function ProfileSetupForm({ onComplete, initialData, isLoading = false }: ProfileSetupFormProps) {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProfileSetupFormData>({
    ...INITIAL_FORM_DATA,
    name: session?.user?.name || "",
    ...initialData
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileSetupFormData, string>>>({});

  const updateFormData = (field: keyof ProfileSetupFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (stepId: number): boolean => {
    const step = STEPS.find(s => s.id === stepId);
    if (!step) return false;

    const stepErrors: Partial<Record<keyof ProfileSetupFormData, string>> = {};

    step.fields.forEach(field => {
      switch (field) {
        case "name":
          if (!formData.name.trim()) {
            stepErrors.name = "Name is required";
          }
          break;
        case "skillsOffered":
          if (formData.skillsOffered.length === 0) {
            stepErrors.skillsOffered = "Please select at least one skill you can offer";
          }
          break;
        case "skillsWanted":
          if (formData.skillsWanted.length === 0) {
            stepErrors.skillsWanted = "Please select at least one skill you want to learn";
          }
          break;
        case "availability":
          const hasAvailability = Object.values(formData.availability).some(Boolean);
          if (!hasAvailability) {
            stepErrors.availability = "Please select your availability";
          }
          break;
      }
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      await onComplete(formData);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (Optional)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => updateFormData("location", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="City, State/Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio (Optional)
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => updateFormData("bio", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Tell others about yourself, your interests, and what makes you unique..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => updateFormData("timezone", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                {COMMON_TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What skills can you teach others?
              </h3>
              <p className="text-gray-600 mb-4">
                Select skills you&rsquo;re confident teaching or sharing with others. You can add up to 10 skills.
              </p>
              <SkillSelector
                selectedSkills={formData.skillsOffered}
                onSkillsChange={(skills) => updateFormData("skillsOffered", skills)}
                placeholder="Search for skills you can teach..."
                maxSkills={10}
              />
              {errors.skillsOffered && (
                <p className="text-red-500 text-sm mt-2">{errors.skillsOffered}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What skills would you like to learn?
              </h3>
              <p className="text-gray-600 mb-4">
                Select skills you&rsquo;re interested in learning from others. You can add up to 10 skills.
              </p>
              <SkillSelector
                selectedSkills={formData.skillsWanted}
                onSkillsChange={(skills) => updateFormData("skillsWanted", skills)}
                placeholder="Search for skills you want to learn..."
                maxSkills={10}
              />
              {errors.skillsWanted && (
                <p className="text-red-500 text-sm mt-2">{errors.skillsWanted}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                When are you available for skill exchanges?
              </h3>
              <p className="text-gray-600 mb-4">
                Let others know when you&rsquo;re typically available for learning sessions.
              </p>
              <AvailabilitySelector
                availability={formData.availability}
                onAvailabilityChange={(availability) => updateFormData("availability", availability)}
              />
              {errors.availability && (
                <p className="text-red-500 text-sm mt-2">{errors.availability}</p>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Visibility Settings
              </h3>
              <div className="space-y-4">
                <label className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-sky-300 transition-colors">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value={ProfileVisibility.PUBLIC}
                    checked={formData.profileVisibility === ProfileVisibility.PUBLIC}
                    onChange={(e) => updateFormData("profileVisibility", e.target.value as ProfileVisibility)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Public Profile</div>
                    <div className="text-sm text-gray-600">
                      Your profile will be visible to all users and appear in search results.
                      This helps you connect with more people and find better skill matches.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-sky-300 transition-colors">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value={ProfileVisibility.PRIVATE}
                    checked={formData.profileVisibility === ProfileVisibility.PRIVATE}
                    onChange={(e) => updateFormData("profileVisibility", e.target.value as ProfileVisibility)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Private Profile</div>
                    <div className="text-sm text-gray-600">
                      Your profile will only be visible to users you&rsquo;ve connected with.
                      You can still search and contact others, but they won&rsquo;t see your profile until you connect.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                ${currentStep > step.id 
                  ? 'bg-sky-600 text-white' 
                  : currentStep === step.id 
                    ? 'bg-sky-100 text-sky-600 border-2 border-sky-600' 
                    : 'bg-gray-100 text-gray-400'
                }
              `}>
                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
              </div>
              {index < STEPS.length - 1 && (
                <div className={`
                  w-12 h-0.5 mx-2
                  ${currentStep > step.id ? 'bg-sky-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {STEPS[currentStep - 1]?.title}
          </h2>
          <p className="text-gray-600">
            {STEPS[currentStep - 1]?.description}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            "Saving..."
          ) : currentStep === STEPS.length ? (
            "Complete Setup"
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
