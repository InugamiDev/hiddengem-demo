"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/map/map-view";
import { useAuth } from "@/contexts/auth-context";
import { Input } from "@/components/ui/input";
import { TripPlanner } from "@/components/trip/trip-planner";

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

type SavedLocation = {
  id: string;
  name: string;
  type: string;
  insiderTip?: string;
  coordinates: { lat: number; lng: number };
  createdAt: string;
};

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
    localPreferences?: Record<string, string | number | boolean>;
    vibeKeywords?: string[];
    avoidTouristy?: boolean;
    localAreas?: string[];
    culturalInterests?: string[];
    dietaryNeeds?: string[];
    travelStage?: {
      current: number;
      name: string;
      progress: number;
      requirements: string[];
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
};

export function InfoPanel({ formData }: InfoPanelProps) {
  const { user } = useAuth();
  const hasFormData = Object.keys(formData).length > 0;
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [newLocationName, setNewLocationName] = useState("");
  const [showSavedLocations, setShowSavedLocations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const basicInfo = ["destination", "startDate", "endDate", "budget"];

  useEffect(() => {
    if (user) {
      fetchSavedLocations();
    }
  }, [user]);

  const fetchSavedLocations = async () => {
    try {
      const response = await fetch("/api/saved-locations");
      if (!response.ok) throw new Error("Failed to fetch saved locations");
      const data = await response.json();
      setSavedLocations(data);
    } catch (error) {
      console.error("Error fetching saved locations:", error);
      alert("Failed to load saved locations");
    }
  };

  type LocationToSave = {
    title?: string;
    type?: string;
    insiderTip?: string;
    coordinates: [number, number] | { lat: number; lng: number };
  };

  const handleSaveLocation = async (location: LocationToSave) => {
    try {
      setIsLoading(true);
      const coordinates = Array.isArray(location.coordinates) 
        ? { lat: location.coordinates[0], lng: location.coordinates[1] }
        : location.coordinates;

      const response = await fetch("/api/saved-locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: location.title || newLocationName,
          type: location.type || "Custom Location",
          insiderTip: location.insiderTip,
          coordinates
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save location");

      alert("Location saved successfully");
      await fetchSavedLocations();
      setNewLocationName("");
    } catch (error) {
      console.error("Error saving location:", error);
      alert(error instanceof Error ? error.message : "Failed to save location");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/saved-locations?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete location");
      alert("Location deleted successfully");
      await fetchSavedLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
      alert("Failed to delete location");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewLocation = (coordinates: { lat: number; lng: number }) => {
    if (!newLocationName) {
      alert("Please enter a location name first");
      return;
    }
    handleSaveLocation({
      title: newLocationName,
      coordinates
    });
  };

  const saveTripPlan = async () => {
    try {
      const response = await fetch("/api/trip-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save trip plan");
      alert("Trip plan saved successfully");
    } catch (error) {
      console.error("Error saving trip plan:", error);
      alert("Failed to save trip plan");
    }
  };

  const formatValue = (value: unknown): string => {
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
    <div className="h-[calc(100vh-7rem)] p-2 sm:p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
      {!hasFormData ? (
        <Card className="p-3 sm:p-4">
          <p className="text-muted-foreground text-sm sm:text-base">
            Start chatting to plan your trip. I&apos;ll help you discover authentic local experiences!
          </p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {formData.travelStage && (
            <Card className="p-3 sm:p-4">
              <h2 className="text-base sm:text-lg font-semibold mb-3">Trip Planning Progress</h2>
              <TripPlanner
                currentStage={formData.travelStage.current}
                progress={formData.travelStage.progress}
                requirements={formData.travelStage.requirements}
              />
            </Card>
          )}

          <Card className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
              <h2 className="text-base sm:text-lg font-semibold">Basic Trip Info</h2>
              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveTripPlan}
                  className="flex items-center gap-2 w-full sm:w-auto text-sm"
                >
                  <SaveIcon />
                  Save Trip
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {basicInfo.map(key => {
                const value = formData[key as keyof typeof formData];
                if (!value) return null;
                return (
                  <div key={key} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <span className="font-medium text-sm">{formatKey(key)}</span>
                    <span className="text-muted-foreground text-sm break-words sm:text-right">{formatValue(value)}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {user && (
            <Card className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-semibold">Saved Locations</h2>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSavedLocations(!showSavedLocations)}
                  className="w-full sm:w-auto text-sm"
                >
                  {showSavedLocations ? "Hide" : "Show"}
                </Button>
              </div>
              
              {showSavedLocations && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="Location name"
                      value={newLocationName}
                      onChange={e => setNewLocationName(e.target.value)}
                      className="flex-1 text-sm"
                    />
                    <Button 
                      variant="outline"
                      disabled={!newLocationName || isLoading}
                      onClick={() => setNewLocationName("")}
                      className="w-full sm:w-auto text-sm"
                    >
                      Clear
                    </Button>
                  </div>

                  <div className="h-[250px] sm:h-[400px] rounded-lg overflow-hidden">
                    <MapView
                      center={
                        savedLocations.length > 0 
                          ? [savedLocations[0].coordinates.lat, savedLocations[0].coordinates.lng]
                          : [0, 0]
                      }
                      markers={savedLocations.map(loc => ({
                        id: loc.id,
                        position: [loc.coordinates.lat, loc.coordinates.lng],
                        title: loc.name,
                        description: `${loc.type}${loc.insiderTip ? ` - ${loc.insiderTip}` : ''}`
                      }))}
                      isEditable={true}
                      onLocationSave={handleNewLocation}
                      onMarkerDelete={handleDeleteLocation}
                    />
                  </div>

                  {savedLocations.length > 0 && (
                    <div className="grid gap-2">
                      {savedLocations.map(location => (
                        <div key={location.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-2 bg-muted rounded-lg">
                          <div className="w-full sm:w-auto">
                            <h3 className="font-medium text-sm">{location.name}</h3>
                            <p className="text-xs text-muted-foreground">{location.type}</p>
                          </div>
                          <Button 
                            variant="destructive"
                            size="sm"
                            disabled={isLoading}
                            onClick={() => handleDeleteLocation(location.id)}
                            className="w-full sm:w-auto text-sm"
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}

          {formData.functionCall?.data?.suggestions && (
            <Card className="p-3 sm:p-4">
              <h2 className="text-base sm:text-lg font-semibold mb-3">Suggested Places</h2>
              <div className="grid gap-3 sm:gap-4">
                {formData.functionCall.data.suggestions.map((suggestion, index) => (
                  <div key={index} className="space-y-2 pb-3 border-b last:border-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div className="w-full sm:w-auto">
                        <h3 className="font-medium text-sm">{suggestion.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{suggestion.address}</p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => window.open(`https://www.google.com/maps?q=${suggestion.coordinates[0]},${suggestion.coordinates[1]}`, '_blank')}
                          className="bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90 flex-1 sm:flex-none"
                          title="View on Map"
                        >
                          <MapIcon />
                        </button>
                        <button
                          onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(suggestion.title)}`, '_blank')}
                          className="bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90 flex-1 sm:flex-none"
                          title="Search on Google"
                        >
                          <SearchIcon />
                        </button>
                        {user && (
                          <button
                            onClick={() => handleSaveLocation(suggestion)}
                            className="bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90 flex-1 sm:flex-none"
                            title="Save Location"
                          >
                            <SaveIcon />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{suggestion.description}</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2 text-xs">
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

          {formData.destination && formData.functionCall?.type === "map" && formData.functionCall.data?.coordinates && (
            <Card className="p-3 sm:p-4">
              <h2 className="text-base sm:text-lg font-semibold mb-3">Location</h2>
              <div className="h-[250px] sm:h-[400px] rounded-lg overflow-hidden">
                <MapView
                  center={formData.functionCall.data?.coordinates || [0, 0]}
                  markers={[
                    {
                      position: formData.functionCall.data?.coordinates || [0, 0],
                      title: formData.destination,
                      description: formData.functionCall.data?.description
                    }
                  ]}
                />
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}