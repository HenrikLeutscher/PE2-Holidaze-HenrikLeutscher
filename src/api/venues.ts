import { BASE_API_URL } from "./api";

export async function getVenues() {
  const response = await fetch(
    `${BASE_API_URL}/holidaze/venues?_owner=true&_bookings=true`,
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

  const sortedVenues = [...venuesArray].sort(
    (a: any, b: any) =>
      new Date(b.created).getTime() - new Date(a.created).getTime(),
  );

  return { venues: sortedVenues, totalCount };
}
