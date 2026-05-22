import { BASE_API_URL } from "./api";

export async function createBooking(
  formData: {
    dateFrom: string;
    dateTo: string;
    guests: number;
    venueId: string;
  },
  token: string,
) {
  try {
    const response = await fetch(`${BASE_API_URL}/holidaze/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log("createBooking response:", response.status, data);

    if (
      (response.status === 200 || response.status === 201) &&
      data?.data?.id
    ) {
      return data.data; // Return created booking data
    } else {
      throw new Error(
        "Failed to create booking: " + (data?.message || "Unknown error"),
      );
    }
  } catch (error: any) {
    console.error("Error in createBooking:", error);
    throw error;
  }
}
