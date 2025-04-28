"use client";

import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";
import { InfoPanel } from "../panel/info-panel";
import { useAuth } from "@/contexts/auth-context";
import { AuthDialog } from "../auth/auth-dialog";

type Message = {
  message: string;
  isUser: boolean;
  nextQuestion?: {
    text: string;
    options: string[];
    selectedOption?: string;
  };
  functionCall?: {
    type: "map";
    data?: {
      coordinates: [number, number];
      description: string;
      suggestions: Array<{
        title: string;
        description: string;
        address: string;
        area: string;
        type: string;
        coordinates: [number, number];
        insiderTip?: string;
        imageUrl?: string;
        bestTime?: string;
        priceRange?: string;
      }>;
    };
  };
};

type TripPlanFormData = {
  destination?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: string;
  interests?: string[];
  accommodation?: string;
  transportation?: string;
  mealType?: string[];
  activities?: string[];
  localPreferences?: Record<string, string | number | boolean>;
  vibeKeywords?: string[];
  avoidTouristy?: boolean;
  localAreas?: string[];
  culturalInterests?: string[];
  dietaryNeeds?: string[];
  functionCall?: {
    type: "map";
    data?: {
      coordinates: [number, number];
      description: string;
      suggestions: Array<{
        title: string;
        description: string;
        address: string;
        area: string;
        type: string;
        coordinates: [number, number];
        insiderTip?: string;
        imageUrl?: string;
        bestTime?: string;
        priceRange?: string;
      }>;
    };
  };
};

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      message: "Hello! I'm Nova from Hidden Gem. I'm excited to help you discover amazing hidden spots and local secrets. Where would you like to explore? Tell me which city you're interested in!",
      isUser: false
    },
  ]);
  const [formData, setFormData] = useState<TripPlanFormData>({});
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const sessionIdRef = useRef(nanoid());
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { message, isUser: true }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          formData,
          sessionId: sessionIdRef.current,
        }),
      });

      const data = await response.json();

      if (data.formData || data.functionCall) {
        if (!user && shouldPromptAuth(data.formData)) {
          setShowAuthDialog(true);
        }

        setFormData((prev) => ({
          ...prev,
          ...data.formData,
          functionCall: data.functionCall
        }));
      }

      const newMessage = {
        message: data.response,
        isUser: false,
        nextQuestion: data.nextQuestion,
        functionCall: data.functionCall,
      };
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          message: "Sorry, I encountered an error. Please try again.",
          isUser: false,
        },
      ]);
    }
  };

  const shouldPromptAuth = (newData: Partial<TripPlanFormData>) => {
    const data = { ...formData, ...newData };
    return !!(data.destination && (data.interests?.length || data.activities?.length));
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
        <div className="flex flex-col w-1/2">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 scrollbar-thin scrollbar-thumb-gray-300 border rounded-lg"
          >
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                {...msg}
                nextQuestion={msg.nextQuestion && {
                  ...msg.nextQuestion,
                  selectedOption: messages[index + 1]?.message
                }}
                onOptionSelect={(option) => {
                  handleSendMessage(option);
                }}
              />
            ))}
          </div>
          <div className="sticky bottom-0 bg-background p-4 border rounded-lg">
            <ChatInput
              onSend={handleSendMessage}
              placeholder={"Type your message..."}
            />
          </div>
        </div>
        <div className="w-1/2 border rounded-lg">
          <InfoPanel formData={formData} />
        </div>
      </div>

      {showAuthDialog && !user && (
        <AuthDialog 
          defaultMode="register"
          onClose={() => setShowAuthDialog(false)}
        />
      )}
    </div>
  );
}