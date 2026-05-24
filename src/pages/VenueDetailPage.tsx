import { useEffect, useState } from "react";
import { getSingleVenue } from "../api/getSingleVenue";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import type { Venue } from "../types/venue";
import { VenueImageDetail } from "../components/VenueImage";
import { Loading } from "../components/ui/Loading";
import { getFacilities } from "../helpers/getFacilities";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/useAuth";
import { deleteVenue } from "../api/deleteVenue";
import { Availability } from "../components/venueDetailPage/availability";
import { createBooking } from "../api/createBooking";
import { AlertModal } from "../components/ui/AlertModal";
import { PopupMessage } from "../components/ui/PopupMessage";
import { formatCreatedDate } from "../helpers/formatCreatedDate";
import { getErrorMessages } from "../helpers/getErrorMessages";
import { getVenueBookings } from "../api/getVenueBookings";
import type { Booking } from "../types/booking";

export function VenueDetailPage() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [popup, setPopup] = useState<{
    message: string;
    type: "success" | "error";
    onComplete?: () => void;
  } | null>(null);
  const [selectedDates, setSelectedDates] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [guests, setGuests] = useState(1);

  const address = venue?.location?.address?.trim();
  const zip = venue?.location?.zip?.trim();
  const city = venue?.location?.city?.trim();
  const country = venue?.location?.country?.trim();
  const continent = venue?.location?.continent?.trim();

  const venueAddress = [address, zip, city, country, continent]
    .filter(Boolean)
    .join(", ");

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

  if (isLoading) return <Loading />;
  if (!venue) return <Navigate to="/NotFoundPage" />;
  document.title = `${venue?.name || "Venue Details"} | Holidaze`;

  const handleBooking = async () => {
    if (!token || !venue) {
      setPopup({ message: "Please ensure you are logged in.", type: "error" });
      return;
    }
    if (!selectedDates.start || !selectedDates.end) {
      setPopup({ message: "Please select a date range.", type: "error" });
      return;
    }
    if (guests < 1 || guests > venue.maxGuests) {
      setPopup({
        message: `This venue can accommodate between 1 and ${venue.maxGuests} guests. Please adjust the number of guests accordingly.`,
        type: "error",
      });
      return;
    }

    const { start, end } = selectedDates;

    const existingBookings = await getVenueBookings(venue.id);
    const hasBookingOverlap = existingBookings.some((booking: Booking) => {
      const bookingStart = new Date(booking.dateFrom).getTime();
      const bookingEnd = new Date(booking.dateTo).getTime();
      return start.getTime() < bookingEnd && end.getTime() > bookingStart;
    });

    if (hasBookingOverlap) {
      setPopup({
        message:
          "The selected dates overlap with an existing booking. Please choose different dates.",
        type: "error",
      });
      return;
    }

    setIsDisabled(true);
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
      setPopup({ message: "Booking successful!", type: "success" });
      setSelectedDates({ start: null, end: null });
    } catch (error) {
      setPopup({ message: getErrorMessages(error), type: "error" });
    } finally {
      setIsDisabled(false);
    }
  };

  const handleDeleteVenue = async () => {
    if (venue.owner?.name !== user?.name) {
      setPopup({
        message: "You can only delete your own Venues",
        type: "error",
      });
      return;
    }
    if (!token) {
      setPopup({
        message: "You must be logged in to delete a venue.",
        type: "error",
      });
      return;
    }
    setShowDeleteModal(true);
    setTimeout(() => {
      navigate("/venues");
    }, 2000);
  };

  const confirmDelete = async () => {
    setIsDisabled(true);
    setShowDeleteModal(false);
    if (!venue || !token) return;

    try {
      await deleteVenue(venue.id, token);
      setPopup({ message: "Venue deleted successfully!", type: "success" });
    } catch (error) {
      setPopup({ message: getErrorMessages(error), type: "error" });
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div className="p-6 w-[90%] mx-auto shadow-2xl rounded-xl my-5">
      <VenueImageDetail venue={venue} />
      <div className="flex flex-col md:flex-row mt-6 gap-8">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-6 text-left">
          <h1 className="text-header1 font-bold">{venue.name}</h1>
          <div>
            {venueAddress && (
              <p className="text-gray-500 italic">{venueAddress}</p>
            )}
            <p className="text-gray-500 italic">
              - Hosted by {venue.owner?.name ?? "Unknown"}
            </p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <p className="text-small ">
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
          <p className="text-bodytext font-bold">${venue.price} / night</p>
          <p className="text-gray-700 text-center text-bodytext">
            Max Guest Capacity:
            <br /> {venue.maxGuests}
          </p>
          <Availability
            venueId={venue.id}
            onSelectDates={(start, end) => setSelectedDates({ start, end })}
          />
          {user && user?.name !== venue.owner?.name && (
            <>
              <div className="w-full flex flex-col items-start gap-1">
                <label
                  htmlFor="guests"
                  className="font-semibold text-gray-700 text-inputlabel"
                >
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
                loading={isDisabled}
              />
            </>
          )}
          {!user && (
            <p className="text-small text-muted text-center">
              Log in to book this venue.
            </p>
          )}
          {user && user.name === venue.owner?.name && (
            <>
              <Button
                text="Edit Venue"
                type="button"
                className="btn-edit w-full"
                disabled={isDisabled}
                onClick={() => navigate(`/edit-venue/${venue.id}`)}
              />
              <Button
                text="Delete Venue"
                type="button"
                className="btn-delete w-full"
                onClick={handleDeleteVenue}
                disabled={isDisabled}
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
              duration={3000}
            />
          )}
        </div>
      </div>
    </div>
  );
}
