import { BASE_API_URL } from "./api";

export async function editVenue(id: string, formData: any, token: string) {
  try {
    const response = await fetch(`${BASE_API_URL}/holidaze/venues/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    console.log("editVenue response:", response.status, data);

    if (
      (response.status === 200 || response.status === 201) &&
      data?.data?.id
    ) {
      return data.data; // Return the edited venue data
    } else {
      throw new Error(
        "Failed to edit venue: " + (data?.message || "Unknown error"),
      );
    }
  } catch (error) {
    console.error("Error editing venue:", error);
    throw error;
  }
}
