"use client";

import { Card } from "@/components/ui/card";
import { MapView } from "@/components/map/map-view";

const MapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </svg>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

type InfoPanelProps = {
  formData: {
    destination?: string;
    startDate?: Date;
    endDate?: Date;
    budget?: string;
    interests?: string[];
    accommodation?: string;
    transportation?: string;
    mealType?: string[];
    activities?: string[];
    localPreferences?: Record<string, any>;
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
};

export function InfoPanel({ formData }: InfoPanelProps) {
  const hasFormData = Object.keys(formData).length > 0;

  // Basic trip info fields
  const basicInfo = ["destination", "startDate", "endDate", "budget"];
  
  // Travel preferences fields
  const preferences = ["interests", "accommodation", "transportation", "mealType", "activities"];
  
  // Local experience fields
  const localExp = ["avoidTouristy", "localAreas", "culturalInterests", "dietaryNeeds"];

  const formatValue = (value: any): string => {
    if (!value) return '';
    if (value instanceof Date) return new Date(value).toLocaleDateString();
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return '';
    return String(value);
  };

  const formatKey = (key: string): string => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  };

  return (
    <div className="h-[calc(100vh-7rem)] p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
      {!hasFormData ? (
        <Card className="p-4">
          <p className="text-muted-foreground">
            Start chatting to plan your trip. I'll help you discover authentic local experiences!
          </p>
        </Card>
      ) : (
        <>
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-3">Basic Trip Info</h2>
            <div className="space-y-2">
              {basicInfo.map(key => {
                const value = formData[key as keyof typeof formData];
                if (!value) return null;
                return (
                  <div key={key} className="flex justify-between items-center">
                    <span className="font-medium text-sm">{formatKey(key)}</span>
                    <span className="text-muted-foreground">{formatValue(value)}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {preferences.some(key => formData[key as keyof typeof formData]) && (
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-3">Travel Preferences</h2>
              <div className="space-y-3">
                {preferences.map(key => {
                  const value = formData[key as keyof typeof formData];
                  if (!value) return null;
                  return (
                    <div key={key} className="space-y-1">
                      <span className="font-medium text-sm">{formatKey(key)}</span>
                      <p className="text-muted-foreground text-sm">{formatValue(value)}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {localExp.some(key => formData[key as keyof typeof formData]) && (
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-3">Local Experience Preferences</h2>
              <div className="space-y-3">
                {localExp.map(key => {
                  const value = formData[key as keyof typeof formData];
                  if (!value) return null;
                  return (
                    <div key={key} className="space-y-1">
                      <span className="font-medium text-sm">{formatKey(key)}</span>
                      <p className="text-muted-foreground text-sm">{formatValue(value)}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {formData.functionCall?.data?.suggestions && (
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-3">Suggested Places</h2>
              <div className="space-y-4">
                {formData.functionCall.data.suggestions.map((suggestion, index) => (
                  <div key={index} className="space-y-2 pb-3 border-b last:border-0 last:pb-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-medium">{suggestion.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{suggestion.address}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(`https://www.google.com/maps?q=${suggestion.coordinates[0]},${suggestion.coordinates[1]}`, '_blank')}
                          className="bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90"
                          title="View on Map"
                        >
                          <MapIcon />
                        </button>
                        <button
                          onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(suggestion.title)}`, '_blank')}
                          className="bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90"
                          title="Search on Google"
                        >
                          <SearchIcon />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span className="bg-secondary px-2 py-1 rounded">{suggestion.area}</span>
                      <span className="bg-secondary px-2 py-1 rounded">{suggestion.type}</span>
                    </div>
                    {suggestion.insiderTip && (
                      <p className="text-xs italic bg-secondary p-2 rounded">
                        💡 Insider tip: {suggestion.insiderTip}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {formData.destination && formData.functionCall?.type === "map" && formData.functionCall.data?.coordinates && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Location</h2>
          <MapView
            location={formData.destination}
            center={formData.functionCall.data?.coordinates || [0, 0]}
            markers={[
              {
                position: formData.functionCall.data?.coordinates || [0, 0],
                title: formData.destination,
                description: formData.functionCall.data?.description
              }
            ]}
          />
        </Card>
      )}
    </div>
  );
}