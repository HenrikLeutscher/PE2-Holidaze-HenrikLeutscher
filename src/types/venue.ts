import type { Booking, Media } from "./booking.ts";

export interface Venue {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  location: {
    address: string;
    city: string;
    continent: string;
    country: string;
    zip: string;
    lat: number;
    lng: number;
  };
  media: Media[];
  owner: {
    name: string;
    email: string;
    bio: string;
    avatar: Media;
    banner: Media;
  };

  bookings?: Booking[];
}

export type VenueInput = Omit<
  Venue,
  "id" | "created" | "updated" | "owner" | "bookings"
>;
