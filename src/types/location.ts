export interface Location {
  id: string;
  name: string;
  description: string;
  batch: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}