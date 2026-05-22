import { BASE_API_URL } from "./api";

export async function deleteBooking(bookingId: string, token: string) {
  const response = await fetch(
    `${BASE_API_URL}/holidaze/bookings/${bookingId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to delete booking: ${response.status}`);
  }

  return true;
}
