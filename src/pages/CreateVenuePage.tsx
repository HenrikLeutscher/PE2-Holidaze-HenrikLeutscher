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
import { PopupMessage } from "../components/ui/PopupMessage";
import { getErrorMessages } from "../helpers/getErrorMessages";

export function CreateVenuePage() {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
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

    if (!formData.price) {
      setError("Price must be greater than zero.");
      return;
    }

    if (!formData.maxGuests) {
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
      const createdVenue = await createVenue(formDataPayload, token);

      setPopup({
        message: "Venue created successfully!",
        type: "success",
      });

      setTimeout(() => {
        navigate(`/venue/${createdVenue.id}`);
      }, 2000);
    } catch (error) {
      setPopup({
        message: getErrorMessages(error),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 px-5 md:px-0 my-auto max-w-200 mx-auto overflow-x-hidden">
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
          disabled={loading}
          loading={loading}
        />
      </form>
      {popup && (
        <PopupMessage
          message={popup.message}
          type={popup.type}
          onComplete={() => setPopup(null)}
        />
      )}
    </div>
  );
}
