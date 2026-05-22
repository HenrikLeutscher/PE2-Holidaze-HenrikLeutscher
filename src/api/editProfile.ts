import { BASE_API_URL } from "./api";

export async function editProfile(
  username: string,
  formData: {
    bio?: string;
    avatar?: { url: string; alt?: string };
    banner?: { url: string; alt?: string };
  },
  token: string,
) {
  try {
    const response = await fetch(
      `${BASE_API_URL}/holidaze/profiles/${username}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(formData),
      },
    );

    const data = await response.json();

    if (
      (response.status === 200 || response.status === 201) &&
      data?.data?.name
    ) {
      return data.data; // Return the edited profile data
    } else {
      throw new Error(
        "Failed to edit profile: " + (data?.message || "Unknown error"),
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error editing profile:", error.message);
      throw new Error(`Error editing profile: ${error.message}`);
    } else {
      console.error("Unknown error editing profile:", error);
      throw new Error("Unknown error editing profile");
    }
  }
}
