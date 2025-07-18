"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Send,
  ArrowRightLeft,
  User
} from "lucide-react";

interface CreateRequestModalProps {
  targetUser: {
    id: string;
    name: string;
    image?: string;
    skillsOffered: string[];
    skillsWanted: string[];
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateRequestModal({
  targetUser,
  isOpen,
  onClose,
  onSuccess
}: CreateRequestModalProps) {
  const [skillOffered, setSkillOffered] = useState("");
  const [skillWanted, setSkillWanted] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillOffered.trim() || !skillWanted.trim()) {
      setError("Please select both skills for the exchange");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/swap-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: targetUser.id,
          skillOffered: skillOffered.trim(),
          skillWanted: skillWanted.trim(),
          message: message.trim()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send request");
      }

      onSuccess?.();
      onClose();
      
      // Reset form
      setSkillOffered("");
      setSkillWanted("");
      setMessage("");

    } catch (err) {
      console.error("Create request error:", err);
      setError(err instanceof Error ? err.message : "Failed to send request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkillSelect = (skill: string, type: "offered" | "wanted") => {
    if (type === "offered") {
      setSkillOffered(skill);
    } else {
      setSkillWanted(skill);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send Skill Exchange Request
          </DialogTitle>
          <DialogDescription>
            Propose a skill exchange with {targetUser.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
              {targetUser.image ? (
                <Image
                  src={targetUser.image}
                  alt={targetUser.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-sky-600" />
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{targetUser.name}</h4>
              <p className="text-sm text-gray-500">Skill exchange partner</p>
            </div>
          </div>

          {/* Skill Exchange */}
          <div className="space-y-4">
            <div className="text-center">
              <ArrowRightLeft className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">Skill Exchange</h3>
            </div>

            {/* Skill You Offer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill you want to teach
              </label>
              <Input
                value={skillOffered}
                onChange={(e) => setSkillOffered(e.target.value)}
                placeholder="Enter the skill you can teach..."
                required
              />
              {targetUser.skillsWanted.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">They want to learn:</p>
                  <div className="flex flex-wrap gap-1">
                    {targetUser.skillsWanted.slice(0, 3).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillSelect(skill, "offered")}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Skill You Want */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill you want to learn
              </label>
              <Input
                value={skillWanted}
                onChange={(e) => setSkillWanted(e.target.value)}
                placeholder="Enter the skill you want to learn..."
                required
              />
              {targetUser.skillsOffered.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">They can teach:</p>
                  <div className="flex flex-wrap gap-1">
                    {targetUser.skillsOffered.slice(0, 3).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillSelect(skill, "wanted")}
                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Exchange Preview */}
          {skillOffered && skillWanted && (
            <div className="bg-sky-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-sky-900 mb-2">Exchange Summary</h4>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary">{skillOffered}</Badge>
                <ArrowRightLeft className="w-4 h-4 text-gray-500" />
                <Badge variant="secondary">{skillWanted}</Badge>
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you'd like to exchange skills..."
              rows={3}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!skillOffered.trim() || !skillWanted.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
