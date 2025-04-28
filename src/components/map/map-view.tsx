"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import type { Icon, LatLngExpression, LeafletMouseEvent } from "leaflet";
import type { MapContainerProps } from "react-leaflet";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useMapEvents as useLeafletMapEvents } from "react-leaflet";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

type MapViewProps = {
  center: LatLngExpression;
  markers?: Array<{
    position: LatLngExpression;
    title: string;
    description?: string;
    id?: string;
  }>;
  onLocationSave?: (location: { lat: number; lng: number }) => void;
  onMarkerDelete?: (id: string) => void;
  isEditable?: boolean;
};

function MapEvents({ onClick }: { onClick: (e: LeafletMouseEvent) => void }) {
  useLeafletMapEvents({
    click: onClick,
  });
  return null;
}

export function MapView({ 
  center, 
  markers = [], 
  onLocationSave,
  onMarkerDelete,
  isEditable = false 
}: MapViewProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapIcon, setMapIcon] = useState<Icon | null>(null);
  const [tempMarker, setTempMarker] = useState<LatLngExpression | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setIsClient(true);
    import('leaflet').then((L) => {
      setMapIcon(
        L.icon({
          iconUrl: "/marker-icon.png",
          iconRetinaUrl: "/marker-icon-2x.png",
          shadowUrl: "/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      );
    });
  }, []);

  const handleMapClick = (e: LeafletMouseEvent) => {
    if (!isEditable || !user) return;
    setTempMarker([e.latlng.lat, e.latlng.lng]);
  };

  const handleSaveLocation = () => {
    if (tempMarker && onLocationSave) {
      const [lat, lng] = tempMarker as [number, number];
      onLocationSave({ lat, lng });
      setTempMarker(null);
    }
  };

  if (!isClient || !mapIcon) {
    return (
      <div className="h-[300px] w-full rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full rounded-lg overflow-hidden border relative">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        {...({} as MapContainerProps)}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onClick={handleMapClick} />
        {markers.map((marker, index) => (
          <Marker key={marker.id || index} position={marker.position} icon={mapIcon}>
            <Popup>
              <div>
                <h3 className="font-semibold">{marker.title}</h3>
                {marker.description && <p className="text-sm">{marker.description}</p>}
                {isEditable && marker.id && onMarkerDelete && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => onMarkerDelete(marker.id!)}
                  >
                    Delete Pin
                  </Button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        {tempMarker && (
          <Marker position={tempMarker} icon={mapIcon}>
            <Popup>
              <div className="flex flex-col gap-2">
                <p className="text-sm">Save this location?</p>
                <Button size="sm" onClick={handleSaveLocation}>Save Pin</Button>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      {isEditable && !user && (
        <div className="absolute top-2 right-2 bg-white p-2 rounded shadow-md">
          <p className="text-sm text-muted-foreground">Sign in to save locations</p>
        </div>
      )}
    </div>
  );
}