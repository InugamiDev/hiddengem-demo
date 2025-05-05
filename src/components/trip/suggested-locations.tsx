"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Location } from "@/types/location";

interface SuggestedLocationsProps {
  locations: Location[];
  onLocationSelect?: (location: Location) => void;
}

export function SuggestedLocations({ locations, onLocationSelect }: SuggestedLocationsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group locations by batch
  const groupedLocations = filteredLocations.reduce((acc, location) => {
    if (!acc[location.batch]) {
      acc[location.batch] = [];
    }
    acc[location.batch].push(location);
    return acc;
  }, {} as Record<number, Location[]>);

  return (
    <Card className="p-4 mb-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Suggested Locations</h3>
        
        <Input
          type="text"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />

        <div className="space-y-6">
          {Object.entries(groupedLocations)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([batch, batchLocations]) => (
              <div key={batch} className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Suggestion Set {batch}
                </h4>
                <div className="grid gap-2">
                  {batchLocations.map((location) => (
                    <div
                      key={location.id}
                      className="p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer"
                      onClick={() => onLocationSelect?.(location)}
                    >
                      <h5 className="font-medium">{location.name}</h5>
                      <p className="text-sm text-muted-foreground">{location.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
}