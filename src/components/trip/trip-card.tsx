"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

type TripCardProps = {
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  onClick?: () => void;
};

export function TripCard({
  title,
  description,
  imageUrl,
  category,
  onClick,
}: TripCardProps) {
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
        </div>
      )}
      <CardHeader>
        {category && (
          <CardDescription className="text-sm font-medium text-primary">
            {category}
          </CardDescription>
        )}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}