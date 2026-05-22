import type { Venue } from "../types/venue";
import { BASE_API_URL } from "./api";

export async function getSingleVenue(id: string): Promise<Venue> {
  const venue = await fetch(
    `${BASE_API_URL}/holidaze/venues/${id}?_owner=true`,
  );

  if (!venue.ok) {
    throw new Error(`Failed to fetch venue with id ${id}`);
  }

  const venueData = await venue.json();
  return venueData.data;
}
