"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  Users,
  Plus,
  X,
  CheckCircle
} from "lucide-react";

interface ScheduleMeetingProps {
  swapRequestId: string;
  otherUserName: string;
  skillOffered: string;
  skillWanted: string;
  isOpen: boolean;
  onClose: () => void;
  onScheduled?: () => void;
}

interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
}

export function ScheduleMeeting({
  swapRequestId,
  otherUserName,
  skillOffered,
  skillWanted,
  isOpen,
  onClose,
  onScheduled
}: ScheduleMeetingProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [meetingType, setMeetingType] = useState<"video" | "phone" | "in-person">("video");
  const [duration, setDuration] = useState("60");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate next 14 days for date selection
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    return dates;
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);

    try {
      // Create meeting proposal message
      const meetingDetails = {
        date: selectedDate,
        time: selectedTime,
        type: meetingType,
        duration: parseInt(duration),
        location: meetingType === "in-person" ? location : undefined,
        notes: notes.trim() || undefined
      };

      const meetingMessage = `📅 **Meeting Proposal**

**Skill Exchange:** ${skillOffered} ↔ ${skillWanted}
**Date:** ${new Date(selectedDate).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}
**Time:** ${selectedTime}
**Duration:** ${duration} minutes
**Type:** ${meetingType === "video" ? "📹 Video Call" : meetingType === "phone" ? "📞 Phone Call" : "🏢 In-Person"}
${meetingType === "in-person" && location ? `**Location:** ${location}` : ""}
${notes ? `**Notes:** ${notes}` : ""}

Please confirm if this works for you!`;

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          swapRequestId,
          content: meetingMessage,
          messageType: "SCHEDULING"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send meeting proposal");
      }

      onScheduled?.();
      onClose();
      
      // Reset form
      setSelectedDate("");
      setSelectedTime("");
      setMeetingType("video");
      setDuration("60");
      setLocation("");
      setNotes("");

    } catch (error) {
      console.error("Schedule meeting error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule Meeting
          </DialogTitle>
          <DialogDescription>
            Propose a meeting time with {otherUserName} for your skill exchange
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meeting Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Meeting Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={meetingType === "video" ? "default" : "outline"}
                size="sm"
                onClick={() => setMeetingType("video")}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <Video className="w-4 h-4" />
                <span className="text-xs">Video</span>
              </Button>
              <Button
                type="button"
                variant={meetingType === "phone" ? "default" : "outline"}
                size="sm"
                onClick={() => setMeetingType("phone")}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <Phone className="w-4 h-4" />
                <span className="text-xs">Phone</span>
              </Button>
              <Button
                type="button"
                variant={meetingType === "in-person" ? "default" : "outline"}
                size="sm"
                onClick={() => setMeetingType("in-person")}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <MapPin className="w-4 h-4" />
                <span className="text-xs">In-Person</span>
              </Button>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              required
            >
              <option value="">Select a date</option>
              {generateDates().map((date) => (
                <option key={date.value} value={date.value}>
                  {date.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              >
                <option value="">Select time</option>
                {generateTimeSlots().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="30">30 min</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>

          {/* Location (for in-person meetings) */}
          {meetingType === "in-person" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter meeting location..."
                required={meetingType === "in-person"}
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details or agenda items..."
              rows={3}
            />
          </div>

          {/* Skill Exchange Summary */}
          <div className="bg-sky-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-sky-900 mb-2">Skill Exchange</h4>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary">{skillOffered}</Badge>
              <span className="text-gray-500">↔</span>
              <Badge variant="secondary">{skillWanted}</Badge>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedDate || !selectedTime || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Propose Meeting
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
