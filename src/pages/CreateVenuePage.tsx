import { Navigate } from "react-router-dom";
import { Loading } from "../components/ui/Loading";
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { VenueLocation } from "../components/createVenueForm/location";
import { BasicVenueFields } from "../components/createVenueForm/BasicVenueFields";
import { MetaFields } from "../components/createVenueForm/MetaFields";
import { createVenue } from "../api/createVenue";
import { invalidInput } from "../helpers/sanitizeInput";
import { useNavigate } from "react-router-dom";

export function CreateVenuePage() {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    media: [
      {
        url: "",
        alt: "",
      },
    ],
    price: 0,
    maxGuests: 0,
    rating: 0,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
      lat: 0,
      lng: 0,
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Create a Venue | Holidaze";
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  if (!user || !token || !user.venueManager) {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return <Loading />;
  }

  const handleCreateVenue = async () => {
    setError("");

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required.");
      return;
    }

    if (!formData.price || formData.price <= 0) {
      setError("Price must be greater than zero.");
      return;
    }

    if (!formData.maxGuests || formData.maxGuests <= 0) {
      setError("Max Guests must be greater than zero.");
      return;
    }

    {
      /* Input Validation */
    }

    if (invalidInput(formData.name)) {
      setError(
        "Name contains invalid characters. Only letters, numbers, and spaces are allowed.",
      );
      return;
    }

    if (invalidInput(formData.description)) {
      setError(
        "Description contains invalid characters. Only letters, numbers, and spaces are allowed.",
      );
      return;
    }

    if (invalidInput(formData.media[0].alt)) {
      setError(
        "Media ALT text contains invalid characters. Only letters, numbers, and spaces are allowed.",
      );
      return;
    }

    if (invalidInput(formData.location.address)) {
      setError(
        "Location address contains invalid characters. Only letters, numbers, and spaces are allowed.",
      );
      return;
    }

    if (invalidInput(formData.location.country)) {
      setError(
        "Location address contains invalid characters. Only letters, numbers, and spaces are allowed.",
      );
      return;
    }

    if (invalidInput(formData.location.city)) {
      setError(
        "Location address contains invalid characters. Only letters, numbers, and spaces are allowed.",
      );
      return;
    }

    setLoading(true);

    const formDataPayload = {
      ...formData,
      media: formData.media.filter((media) => media.url.trim() !== ""),
    };

    try {
      const createdVenue: any = await createVenue(formDataPayload, token);

      alert("Venue created successfully!");
      navigate(`/venue/${createdVenue.id}`);

      setFormData({
        name: "",
        description: "",
        media: [{ url: "", alt: "" }],
        price: 0,
        maxGuests: 0,
        rating: 0,
        meta: { wifi: false, parking: false, breakfast: false, pets: false },
        location: {
          address: "",
          city: "",
          zip: "",
          country: "",
          continent: "",
          lat: 0,
          lng: 0,
        },
      });
    } catch (error: any) {
      setError(error.message);
      alert("Failed to create venue: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 my-auto w-200 mx-auto">
      <h1 className="text-header1 mb-6 text-center">Create a New Venue</h1>
      <form>
        <BasicVenueFields
          formData={formData as any}
          setFormData={setFormData as any}
        />

        <div className="mb-4">
          <MetaFields
            formData={formData as any}
            setFormData={setFormData as any}
          />
        </div>
        <VenueLocation
          formData={formData as any}
          setFormData={setFormData as any}
        />
        {error && (
          <p className="bg-red-500 text-white text-center py-2 my-2 rounded-2xl">
            {error}
          </p>
        )}
        <Button
          text="Create Venue"
          type="button"
          className="flex mx-auto"
          onClick={handleCreateVenue}
          disabled={isDisabled || loading}
          loading={loading}
        />
      </form>
    </div>
  );
}
