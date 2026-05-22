import { BASE_API_URL } from "./api";

export async function deleteVenue(venueId: string, token: string) {
  try {
    const response = await fetch(`${BASE_API_URL}/holidaze/venues/${venueId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
      },
    });

    if (response.ok) {
      alert("Venue deleted successfully!");
      return true;
    } else {
      const errorData = await response.json();
      alert(
        "Failed to delete venue: " + (errorData.error || response.statusText),
      );
      return false;
    }
  } catch (error: any) {
    alert("Failed to delete venue: " + error.message);
    return false;
  }
}
