import { BASE_API_URL } from "./api";

export async function deleteVenue(venueId: string, token: string) {
  const response = await fetch(`${BASE_API_URL}/holidaze/venues/${venueId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
    },
  });

  if (!response.ok) {
    let message = `Failed to delete venue: ${response.status}`;
    try {
      const json = await response.json();
      message = json?.errors?.[0]?.message || json?.message || message;
    } catch {}
    throw new Error(message);
  }

  return true;
}
