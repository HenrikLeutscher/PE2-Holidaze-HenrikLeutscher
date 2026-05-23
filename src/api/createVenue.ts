import { BASE_API_URL } from "./api";
import type { Venue, VenueInput } from "../types/venue";

export async function createVenue(formData: VenueInput, token: string) {
  try {
    const response = await fetch(`${BASE_API_URL}/holidaze/venues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (
      (response.status === 200 || response.status === 201) &&
      data?.data?.id
    ) {
      return data.data; // Return created venue data
    }

    throw new Error(
      data?.errors?.[0]?.message || data?.message || "Unknown error",
    );
  } catch (error) {
    throw error;
  }
}
