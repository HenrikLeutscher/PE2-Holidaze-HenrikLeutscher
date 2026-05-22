import { BASE_API_URL } from "./api";

export async function getVenueBookings(venueId: string, token?: string) {
  const response = await fetch(
    `${BASE_API_URL}/holidaze/venues/${venueId}?_bookings=true`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
        "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }

  const json = await response.json();

  return json.data.bookings ?? [];
}
