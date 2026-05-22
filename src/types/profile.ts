import type { Venue } from "./venue";
import type { Booking } from "./booking";
import type { Media } from "./booking";

export interface Profile {
  name: string;
  email: string;
  bio?: string;
  banner?: Media;
  avatar?: Media;
  venueManager: boolean;
  venues: Venue[];
  bookings: Booking[];
  _count?: {
    venues: number;
    bookings: number;
  };
}
