import { BASE_API_URL } from "./api";

export async function createVenue(formData: any, token: string) {
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

    console.log("createVenue response:", response.status, data);

    if (
      (response.status === 200 || response.status === 201) &&
      data?.data?.id
    ) {
      alert("Venue created successfully!");
    } else {
      alert("Failed to create venue: " + (data?.message || "Unknown error"));
      return null;
    }
  } catch (error: any) {
    alert("Failed to create venue: " + error.message);
    return null;
  }
}
