"use client";

import { useState } from "react";
import { X, Plus, Search } from "lucide-react";
import { SKILL_CATEGORIES, type SkillCategory } from "@/lib/types/profile";

interface SkillSelectorProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  placeholder?: string;
  maxSkills?: number;
  className?: string;
}

export function SkillSelector({
  selectedSkills,
  onSkillsChange,
  maxSkills = 10,
  className = ""
}: SkillSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | "All">("All");
  const [customSkill, setCustomSkill] = useState("");

  // Get all skills from all categories
  const allSkills = Object.values(SKILL_CATEGORIES).flat();
  
  // Filter skills based on search term and category
  const filteredSkills = allSkills.filter(skill => {
    const matchesSearch = skill.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || 
      SKILL_CATEGORIES[selectedCategory as SkillCategory]?.includes(skill as any);
    const notAlreadySelected = !selectedSkills.includes(skill);
    
    return matchesSearch && matchesCategory && notAlreadySelected;
  });

  const handleSkillAdd = (skill: string) => {
    if (selectedSkills.length < maxSkills && !selectedSkills.includes(skill)) {
      onSkillsChange([...selectedSkills, skill]);
    }
  };

  const handleSkillRemove = (skill: string) => {
    onSkillsChange(selectedSkills.filter(s => s !== skill));
  };

  const handleCustomSkillAdd = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim()) && selectedSkills.length < maxSkills) {
      onSkillsChange([...selectedSkills, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected Skills Display */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm font-medium"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleSkillRemove(skill)}
                className="hover:bg-sky-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedSkills.length < maxSkills && (
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-1 px-3 py-1 border-2 border-dashed border-gray-300 text-gray-600 rounded-full text-sm font-medium hover:border-sky-400 hover:text-sky-600 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add Skill
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {selectedSkills.length}/{maxSkills} skills selected
        </p>
      </div>

      {/* Skill Selector Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Search and Category Filter */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as SkillCategory | "All")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="All">All Categories</option>
              {Object.keys(SKILL_CATEGORIES).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Skills List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredSkills.length > 0 ? (
              <div className="p-2">
                {filteredSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillAdd(skill)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No skills found matching your search.
              </div>
            )}
          </div>

          {/* Custom Skill Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom skill..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCustomSkillAdd()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleCustomSkillAdd}
                disabled={!customSkill.trim() || selectedSkills.includes(customSkill.trim())}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Close Button */}
          <div className="p-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
