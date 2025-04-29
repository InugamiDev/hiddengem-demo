"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type TripDetailModalProps = {
  trip: {
    id: string;
    destination: string;
    startDate: string;
    endDate: string;
    budget: string;
    interests: string[];
    accommodation: string;
    transportation: string;
    tripStage: number;
  };
  onClose: () => void;
};

export function TripDetailModal({ trip, onClose }: TripDetailModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch("/api/trip-plans/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trip),
      });

      if (!response.ok) throw new Error("Failed to download trip plan");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${trip.destination}-trip-plan.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading trip plan:", error);
      alert("Failed to download trip plan");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">{trip.destination}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Trip Duration</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Budget</h3>
            <p className="text-sm text-muted-foreground">{trip.budget}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Accommodation</h3>
            <p className="text-sm text-muted-foreground">{trip.accommodation}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Transportation</h3>
            <p className="text-sm text-muted-foreground">{trip.transportation}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Interests</h3>
            <div className="flex flex-wrap gap-1">
              {trip.interests.map((interest, index) => (
                <span key={index} className="text-xs px-2 py-1 bg-secondary rounded-full">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full sm:w-auto"
            >
              {isDownloading ? "Preparing Download..." : "Download Trip Plan (XLSX)"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}