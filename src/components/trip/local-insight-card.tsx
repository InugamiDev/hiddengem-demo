"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

type LocalInsightProps = {
  title: string;
  description: string;
  address: string;
  insiderTip?: string;
  bestTime?: string;
  priceRange?: string;
  imageUrl?: string;
  tags: string[];
  area: string;
  coordinates?: [number, number];
  onClick?: () => void;
};

export function LocalInsightCard({
  title,
  description,
  address,
  insiderTip,
  bestTime,
  priceRange,
  imageUrl,
  tags,
  area,
  coordinates,
  onClick,
}: LocalInsightProps) {
  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (coordinates) {
      window.open(`https://www.google.com/maps?q=${coordinates[0]},${coordinates[1]}`, '_blank');
    }
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://www.google.com/search?q=${encodeURIComponent(title)}`, '_blank');
  };
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      {imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
            <span className="text-white text-sm font-medium">{area}</span>
          </div>
        </div>
      )}
      <CardHeader>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-start justify-between gap-2 mt-2">
          <div className="flex-1">
            <CardTitle className="text-xl">{title}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">{address}</div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleMapClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90 p-2 rounded-md"
              title="View on Map"
            >
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
            </button>
            <button
              onClick={handleSearchClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90 p-2 rounded-md"
              title="Search on Google"
            >
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
            </button>
          </div>
        </div>
        <CardDescription className="mt-3">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {insiderTip && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium">💎 Insider Tip</p>
            <p className="text-sm text-muted-foreground">{insiderTip}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {bestTime && (
            <div>
              <p className="font-medium">Best Time</p>
              <p className="text-muted-foreground">{bestTime}</p>
            </div>
          )}
          {priceRange && (
            <div>
              <p className="font-medium">Local Price Range</p>
              <p className="text-muted-foreground">{priceRange}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}