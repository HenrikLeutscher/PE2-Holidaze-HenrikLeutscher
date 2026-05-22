import type { Venue } from "./venue.ts";

export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  venue: Venue;
  customer?: Customer;
}

export interface Media {
  url: string;
  alt: string;
}

export interface Customer {
  name: string;
  email: string;
  bio: string;
  avatar: Media;
  banner: Media;
}
