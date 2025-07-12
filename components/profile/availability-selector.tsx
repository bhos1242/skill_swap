"use client";

import { UserAvailability } from "@/lib/types/profile";
import { Clock, Calendar, Zap } from "lucide-react";

interface AvailabilitySelectorProps {
  availability: UserAvailability;
  onAvailabilityChange: (availability: UserAvailability) => void;
  className?: string;
}

export function AvailabilitySelector({
  availability,
  onAvailabilityChange,
  className = ""
}: AvailabilitySelectorProps) {
  const handleToggle = (field: keyof UserAvailability) => {
    onAvailabilityChange({
      ...availability,
      [field]: !availability[field]
    });
  };

  const dayOptions = [
    {
      key: 'weekdays' as keyof UserAvailability,
      label: 'Weekdays',
      description: 'Monday - Friday',
      icon: Calendar
    },
    {
      key: 'weekends' as keyof UserAvailability,
      label: 'Weekends',
      description: 'Saturday - Sunday',
      icon: Calendar
    }
  ];

  const timeOptions = [
    {
      key: 'mornings' as keyof UserAvailability,
      label: 'Mornings',
      description: '6 AM - 12 PM',
      icon: Clock
    },
    {
      key: 'afternoons' as keyof UserAvailability,
      label: 'Afternoons',
      description: '12 PM - 6 PM',
      icon: Clock
    },
    {
      key: 'evenings' as keyof UserAvailability,
      label: 'Evenings',
      description: '6 PM - 11 PM',
      icon: Clock
    }
  ];

  const flexibleOption = {
    key: 'flexible' as keyof UserAvailability,
    label: 'Flexible Schedule',
    description: 'Available by arrangement',
    icon: Zap
  };

  const OptionCard = ({ 
    option, 
    isSelected, 
    onToggle 
  }: { 
    option: typeof dayOptions[0], 
    isSelected: boolean, 
    onToggle: () => void 
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`
        w-full p-4 rounded-lg border-2 transition-all duration-200 text-left
        ${isSelected 
          ? 'border-sky-500 bg-sky-50 text-sky-900' 
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`
          p-2 rounded-lg
          ${isSelected ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-500'}
        `}>
          <option.icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="font-medium">{option.label}</div>
          <div className={`text-sm ${isSelected ? 'text-sky-600' : 'text-gray-500'}`}>
            {option.description}
          </div>
        </div>
        <div className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${isSelected 
            ? 'border-sky-500 bg-sky-500' 
            : 'border-gray-300'
          }
        `}>
          {isSelected && (
            <div className="w-2 h-2 bg-white rounded-full" />
          )}
        </div>
      </div>
    </button>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Days Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Which days work best for you?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {dayOptions.map((option) => (
            <OptionCard
              key={option.key}
              option={option}
              isSelected={availability[option.key]}
              onToggle={() => handleToggle(option.key)}
            />
          ))}
        </div>
      </div>

      {/* Times Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          What times work best for you?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {timeOptions.map((option) => (
            <OptionCard
              key={option.key}
              option={option}
              isSelected={availability[option.key]}
              onToggle={() => handleToggle(option.key)}
            />
          ))}
        </div>
      </div>

      {/* Flexible Option */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Scheduling Flexibility
        </h3>
        <OptionCard
          option={flexibleOption}
          isSelected={availability[flexibleOption.key]}
          onToggle={() => handleToggle(flexibleOption.key)}
        />
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Your Availability Summary:</h4>
        <div className="text-sm text-gray-600 space-y-1">
          {availability.weekdays && <div>• Available on weekdays</div>}
          {availability.weekends && <div>• Available on weekends</div>}
          {availability.mornings && <div>• Available in mornings</div>}
          {availability.afternoons && <div>• Available in afternoons</div>}
          {availability.evenings && <div>• Available in evenings</div>}
          {availability.flexible && <div>• Flexible scheduling available</div>}
          {!Object.values(availability).some(Boolean) && (
            <div className="text-gray-400">No availability selected yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
