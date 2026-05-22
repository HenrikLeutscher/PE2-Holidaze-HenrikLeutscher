import { Venue } from "../types/venue";
import { BASE_API_URL } from "./api";

type User = {
  name: string;
  accessToken: string;
};

export async function getUserVenues(user: User, token: string) {
  if (!user?.name || !user?.accessToken) {
    throw new Error("Missing username or token");
  }

  const response = await fetch(
    `${BASE_API_URL}/holidaze/profiles/${user.name}?_venues=true&_bookings=true`,
    {
      headers: {
        "Application-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
      },
    },
  );

  if (!response.ok)
    throw new Error(`Failed to fetch venues: ${response.status}`);

  const data = await response.json();
  return data.data.venues ?? [];
}

export async function getUserBookings(user: User) {
  if (!user?.name || !user?.accessToken) {
    throw new Error("Missing username or token");
  }

  const response = await fetch(
    `${BASE_API_URL}/holidaze/profiles/${user.name}/bookings?_venue=true`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
        "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
      },
    },
  );

  if (!response.ok)
    throw new Error(`Failed to fetch bookings: ${response.status}`);
  const data = await response.json();
  return data.data;
}

export async function getVenueManagersUpcomingBookings(
  venues: Venue[],
  token: string,
) {
  const now = new Date();

  const venuesWithBookings = await Promise.all(
    venues.map(async (venue) => {
      const response = await fetch(
        `${BASE_API_URL}/holidaze/venues/${venue.id}?_bookings=true`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings for venue ${venue.id}`);
      }

      const data = await response.json();
      return { ...venue, bookings: data.data.bookings };
    }),
  );

  return venuesWithBookings
    .flatMap((venue) =>
      (venue.bookings ?? []).map((booking: any) => ({
        ...booking,
        venue: {
          name: venue.name,
          id: venue.id,
        },
      })),
    )
    .filter((booking) => new Date(booking.dateTo) >= now)
    .sort(
      (a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime(),
    );
}
