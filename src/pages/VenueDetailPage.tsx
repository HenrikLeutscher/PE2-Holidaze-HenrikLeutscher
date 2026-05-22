import { useEffect, useState } from "react";
import { getSingleVenue } from "../api/getSingleVenue";
import { Navigate, useParams } from "react-router-dom";
import type { Venue } from "../types/venue";
import { VenueImageDetail } from "../components/VenueImage";
import { Loading } from "../components/ui/Loading";
import { getFacilities } from "../helpers/getFacilities";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/useAuth";
import { deleteVenue } from "../api/deleteVenue";
import { useNavigate } from "react-router-dom";
import { Availability } from "../components/venueDetailPage/availability";
import { createBooking } from "../api/createBooking";
import { AlertModal } from "../components/ui/AlertModal";
import { PopupMessage } from "../components/ui/PopupMessage";
import { formatCreatedDate } from "../helpers/formatCreatedDate";

export function VenueDetailPage() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [popup, setPopup] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [selectedDates, setSelectedDates] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      document.title = "Venue Details | Holidaze";
      return;
    }

    async function fetchVenue() {
      setIsLoading(true);
      try {
        const fetchedVenue = await getSingleVenue(id as string);
        setVenue(fetchedVenue);
        document.title = `${fetchedVenue.name} | Holidaze`;
      } catch (error) {
        console.error("Error fetching venue details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVenue();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  if (!venue) {
    return <Navigate to="/NotFoundPage" />;
  }

  document.title = `${venue?.name || "Venue Details"} | Holidaze`;

  const handleBooking = async () => {
    if (!token || !venue) {
      alert("Please ensure you are logged in.");
      return;
    }
    if (!selectedDates.start || !selectedDates.end) {
      alert("Please select a date range.");
      return;
    }

    if (guests < 1 || guests > venue.maxGuests) {
      alert(
        `This venue can accommodate between 1 and ${venue.maxGuests} guests. Please adjust the number of guests accordingly.`,
      );
      return;
    }

    const { start, end } = selectedDates;

    try {
      await createBooking(
        {
          dateFrom: start.toISOString(),
          dateTo: end.toISOString(),
          guests,
          venueId: venue.id,
        },
        token,
      );

      setPopup({
        message: "Booking successful!",
        type: "success",
      });
      setSelectedDates({ start: null, end: null });
    } catch (error) {
      console.error("Error creating booking:", error);
      setPopup({
        message: "Failed to create booking.",
        type: "error",
      });
    }
  };

  const handleDeleteVenue = async () => {
    if (venue.owner?.name !== user?.name) {
      alert("You can only delete your own Venues");
      return;
    }

    if (!token) {
      alert("You must be logged in to delete a venue.");
      return;
    }

    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);

    if (!venue || !token) return;

    const success = await deleteVenue(venue.id, token);
    if (success) {
      setVenue(null);
      navigate("/venues");
    }
  };

  return (
    <div className="p-6 w-full md:w-2/3 mx-auto shadow-2xl rounded-xl my-5">
      <VenueImageDetail venue={venue} />

      <div className="flex flex-col md:flex-row mt-6 gap-8">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-6 text-left">
          <h1 className="text-3xl font-bold">{venue.name}</h1>
          <p className="text-gray-500 italic">
            {venue.location.city ? venue.location.city + ", " : ""}
            {venue.location.country} - Hosted by{` `}
            {venue.owner?.name ?? "Unknown"}
          </p>
          <div className="flex gap-4 flex-wrap">
            <p className="text-small">
              Published: {formatCreatedDate(venue.created)}
            </p>
            <p className="text-small">
              Updated: {formatCreatedDate(venue.updated)}
            </p>
          </div>

          <p className="text-gray-700">{venue.description}</p>

          <div className="flex gap-4 flex-wrap">
            {getFacilities(venue.meta)}
          </div>
        </div>

        {/* Right column */}
        <div className="w-full md:w-1/3 shrink-0 bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4 items-center">
          <p className="text-yellow-500 font-semibold">
            ⭐ {venue.rating > 0 ? `${venue.rating}` : "No reviews yet"}
          </p>
          <p className="text-2xl font-bold">{venue.price} / night</p>
          <p className="text-gray-700 text-center">
            Max Guest Capacity:<br></br> {venue.maxGuests}
          </p>
          <Availability
            venueId={venue.id}
            onSelectDates={(start, end) => setSelectedDates({ start, end })}
          />
          {user && user?.name !== venue.owner?.name && (
            <>
              <div className="w-full flex flex-col items-start gap-1">
                <label htmlFor="guests" className="font-semibold text-gray-700">
                  Number of Guests
                </label>
                <input
                  id="guests"
                  type="number"
                  min={1}
                  max={venue.maxGuests}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-1"
                />
              </div>
              <Button
                text="Book Now"
                type="button"
                className="btn-primary w-full"
                onClick={handleBooking}
                disabled={isDisabled}
                loading={isLoading}
              />
            </>
          )}
          {!user && (
            <p className="text-sm text-muted text-center">
              Log in to book this venue.
            </p>
          )}
          {user && user.name === venue.owner?.name && (
            <>
              <Button
                text="Edit Venue"
                type="button"
                className="btn-edit w-full"
                onClick={() => navigate(`/edit-venue/${venue.id}`)}
                disabled={isDisabled}
                loading={isLoading}
              />
              <Button
                text="Delete Venue"
                type="button"
                className="btn-delete w-full"
                onClick={handleDeleteVenue}
                disabled={isDisabled || isLoading}
                loading={isLoading}
              />
            </>
          )}
          {showDeleteModal && (
            <AlertModal
              message="Are you sure you want to delete this venue?"
              onConfirm={confirmDelete}
              onCancel={() => setShowDeleteModal(false)}
            />
          )}
          {popup && (
            <PopupMessage
              message={popup.message}
              type={popup.type}
              onComplete={() => setPopup(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
