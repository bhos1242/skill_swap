"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Send,
  User,
  Clock,
  CheckCircle2,

  Video,
  Phone,
  X
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  messageType: "TEXT" | "SYSTEM" | "SCHEDULING";
  createdAt: string;
  readAt?: string;
  sender: {
    id: string;
    name: string;
    image?: string;
  };
}

interface SwapRequest {
  id: string;
  skillOffered: string;
  skillWanted: string;
  status: string;
  sender: {
    id: string;
    name: string;
    image?: string;
  };
  receiver: {
    id: string;
    name: string;
    image?: string;
  };
}

interface MessageThreadProps {
  swapRequest: SwapRequest;
  isOpen: boolean;
  onClose: () => void;
}

export function MessageThread({ swapRequest, isOpen, onClose }: MessageThreadProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = session?.user?.id;
  const otherUser = swapRequest.senderId === currentUserId ? swapRequest.receiver : swapRequest.sender;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/messages?swapRequestId=${swapRequest.id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data.messages);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Fetch messages error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          swapRequestId: swapRequest.id,
          content: newMessage.trim()
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      setMessages(prev => [...prev, data.data]);
      setNewMessage("");
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Send message error:", error);
    } finally {
      setIsSending(false);
    }
  };

  const sendSchedulingMessage = async (type: "video" | "phone") => {
    const content = type === "video" 
      ? "📹 Let's schedule a video call to discuss our skill exchange!"
      : "📞 Let's schedule a phone call to discuss our skill exchange!";

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          swapRequestId: swapRequest.id,
          content,
          messageType: "SCHEDULING"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.data]);
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error("Send scheduling message error:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, swapRequest.id]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center overflow-hidden">
                {otherUser.image ? (
                  <Image
                    src={otherUser.image}
                    alt={otherUser.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-sky-600" />
                )}
              </div>
              <div>
                <DialogTitle className="text-lg">{otherUser.name}</DialogTitle>
                <DialogDescription className="text-sm">
                  {swapRequest.skillOffered} ↔ {swapRequest.skillWanted}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={swapRequest.status === "ACCEPTED" ? "default" : "secondary"}>
                {swapRequest.status}
              </Badge>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Quick Actions */}
        {swapRequest.status === "ACCEPTED" && (
          <div className="px-6 py-3 border-b bg-gray-50">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendSchedulingMessage("video")}
                className="flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                Schedule Video Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendSchedulingMessage("phone")}
                className="flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Schedule Phone Call
              </Button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start the conversation</h3>
              <p className="text-gray-600">
                Send a message to coordinate your skill exchange with {otherUser.name}
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.sender.id === currentUserId;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[70%] ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
                    <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                      {message.sender.image ? (
                        <Image
                          src={message.sender.image}
                          alt={message.sender.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-sky-600" />
                      )}
                    </div>
                    
                    <div className={`space-y-1 ${isOwnMessage ? "text-right" : "text-left"}`}>
                      <div
                        className={`inline-block px-4 py-2 rounded-lg ${
                          isOwnMessage
                            ? "bg-sky-600 text-white"
                            : message.messageType === "SCHEDULING"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(message.createdAt)}</span>
                        {isOwnMessage && message.readAt && (
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-6 border-t">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isSending}
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim() || isSending}>
              {isSending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
