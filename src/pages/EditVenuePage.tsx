import { Navigate, useParams } from "react-router-dom";
import { Loading } from "../components/ui/Loading";
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { VenueLocation } from "../components/createVenueForm/location";
import { BasicVenueFields } from "../components/createVenueForm/BasicVenueFields";
import { MetaFields } from "../components/createVenueForm/MetaFields";
import { invalidInput } from "../helpers/sanitizeInput";
import { useNavigate } from "react-router-dom";
import { getSingleVenue } from "../api/getSingleVenue";
import { editVenue } from "../api/editVenue";
import { PopupMessage } from "../components/ui/PopupMessage";

export function EditVenuePage() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
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

  if (!id) {
    return <div>Invalid venue ID.</div>;
  }

  useEffect(() => {
    document.title = `Edit ${formData.name || "Venue"} | Holidaze`;
    if (user) {
      setIsLoading(false);
    }
  }, [user, formData.name]);

  if (!user || !token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    if (!id || !token) return;

    setIsLoading(true);

    const fetchVenue = async () => {
      try {
        const singleVenue = await getSingleVenue(id);
        setFormData({
          name: singleVenue.name || "",
          description: singleVenue.description || "",
          media: singleVenue.media.length
            ? singleVenue.media
            : [{ url: "", alt: "" }],
          price: singleVenue.price || 0,
          maxGuests: singleVenue.maxGuests || 0,
          rating: singleVenue.rating || 0,
          meta: {
            wifi: singleVenue.meta?.wifi || false,
            parking: singleVenue.meta?.parking || false,
            breakfast: singleVenue.meta?.breakfast || false,
            pets: singleVenue.meta?.pets || false,
          },
          location: {
            address: singleVenue.location?.address || "",
            city: singleVenue.location?.city || "",
            zip: singleVenue.location?.zip || "",
            country: singleVenue.location?.country || "",
            continent: singleVenue.location?.continent || "",
            lat: singleVenue.location?.lat || 0,
            lng: singleVenue.location?.lng || 0,
          },
        });
      } catch (err) {
        console.error("Failed to fetch venue for editing:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenue();
  }, [id, token]);

  if (isLoading) {
    return <Loading />;
  }

  const handleEditVenue = async () => {
    setError("");
    setIsDisabled(true);

    if (!token) return;

    if (!formData.name.trim()) {
      setError("Name is required.");
      setIsDisabled(false);
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required.");
      setIsDisabled(false);
      return;
    }

    if (!formData.price || formData.price <= 0) {
      setError("Price must be greater than zero.");
      setIsDisabled(false);
      return;
    }

    if (!formData.maxGuests || formData.maxGuests <= 0) {
      setError("Max Guests must be greater than zero.");
      setIsDisabled(false);
      return;
    }

    {
      /* Input Validation */
    }

    if (invalidInput(formData.name)) {
      setError(
        "Name contains invalid characters. Only letters, numbers, and spaces are allowed.",
      );
      setIsDisabled(false);
      return;
    }

    if (invalidInput(formData.description)) {
      setError(
        "Description contains invalid characters. Only letters, numbers, and spaces are allowed.",
      );
      setIsDisabled(false);
      return;
    }

    if (invalidInput(formData.media[0].alt)) {
      setError(
        "Media ALT text contains invalid characters. Only letters, numbers, and spaces are allowed.",
      );
      setIsDisabled(false);
      return;
    }

    if (invalidInput(formData.location.address)) {
      setError(
        "Location address contains invalid characters. Only letters, numbers, and spaces are allowed.",
      );
      setIsDisabled(false);
      return;
    }

    if (invalidInput(formData.location.country)) {
      setError(
        "Location address contains invalid characters. Only letters, numbers, and spaces are allowed.",
      );
      setIsDisabled(false);
      return;
    }

    if (invalidInput(formData.location.city)) {
      setError(
        "Location address contains invalid characters. Only letters, numbers, and spaces are allowed.",
      );
      setIsDisabled(false);
      return;
    }

    setLoading(true);

    const formDataPayload = {
      ...formData,
      media: formData.media.filter((media) => media.url.trim() !== ""),
    };

    try {
      const editedVenue: any = await editVenue(id, formDataPayload, token);

      setShowPopup(true);

      setTimeout(() => {
        navigate(`/venue/${editedVenue.id}`);
      }, 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
      setIsDisabled(false);
    }
  };

  return (
    <div className="container py-10 px-5 md:px-0 my-auto max-w-200 mx-auto overflow-x-hidden">
      <h1 className="text-header1 mb-6 text-center">Edit Venue</h1>
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
          text="Edit Venue"
          type="button"
          className="flex mx-auto"
          onClick={handleEditVenue}
          disabled={isDisabled || loading}
          loading={loading}
        />
      </form>
      {showPopup && (
        <PopupMessage
          message="Venue successfully edited!"
          type="success"
          onComplete={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}
