import { BASE_API_URL } from "./api";

export async function getVenues(
  page = 1,
  limit = 24,
  order: "asc" | "desc" = "desc",
) {
  const response = await fetch(
    `${BASE_API_URL}/holidaze/venues?_owner=true&_bookings=true&page=${page}&limit=${limit}&sort=created&sortOrder=${order}`,
  );

  if (!response.ok) {
    let message = "An error occurred while fetching venues";

    try {
      const json = await response.json();
      message = json.message || message;
    } catch {}

    throw new Error(message);
  }

  const json = await response.json();
  const venuesArray = json.data || [];
  const totalCount = json.meta?.totalCount || venuesArray.length;

  return { venues: venuesArray, totalCount };
}
