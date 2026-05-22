import { BASE_API_URL } from "./api";
import type { BookingPayLoad } from "../types/BookingProps";

export async function createBooking(formData: BookingPayLoad, token: string) {
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

    if (
      (response.status === 200 || response.status === 201) &&
      data?.data?.id
    ) {
      return data.data;
    }

    let message =
      data?.errors?.[0]?.message || data?.message || "Unknown error";

    if (message.toLowerCase().includes("overlap")) {
      message = "Selected dates overlap with an existing booking.";
    }

    throw new Error(message);
  } catch (error: any) {
    throw new Error(error.message || "Failed to create booking");
  }
}
