import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import {
  getUserBookings,
  getUserVenues,
  getVenueManagersUpcomingBookings,
} from "../../api/getUserVenuesAndBookings";
import { Loading } from "../ui/Loading";
import type { Booking } from "../../types/booking";
import { Button } from "../ui/Button";
import { AlertModal } from "../ui/AlertModal";
import { deleteBooking } from "../../api/deleteBooking";
import { PopupMessage } from "../ui/PopupMessage";
import { Link } from "react-router-dom";

export function ProfileBookings() {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [popup, setPopup] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    const fetchUserBookings = async () => {
      try {
        const userData = { name: user.name, accessToken: token };
        const data = await getUserBookings(userData);

        const bookingsData = Array.isArray(data) ? data : [];

        setBookings(bookingsData);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred while fetching your bookings.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBookings();
  }, [token, user]);

  if (isLoading) return <Loading />;

  const handleDeleteBooking = async (bookingId: string) => {
    if (!token || !user) return;

    setSelectedBookingId(bookingId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedBookingId || !token) return;

    const bookingIdToDelete = selectedBookingId;

    setShowDeleteModal(false);

    try {
      setIsDisabled(true);

      const success = await deleteBooking(bookingIdToDelete, token);

      if (success) {
        setPopup({
          message: "Booking deleted successfully",
          type: "success",
        });

        setBookings((prev) =>
          prev.filter((booking) => booking.id !== bookingIdToDelete),
        );

        setSelectedBookingId(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred while deleting the booking.");
      }
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Your Bookings</h2>
      {bookings.length === 0 && (
        <p className="text-center">You currently have 0 active bookings.</p>
      )}
      {error && <p className="text-center text-red-500 my-auto">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {bookings.map((booking: Booking) => (
          <div
            key={booking.id}
            className="shadow-xl p-4 mb-4 rounded-2xl hover:shadow-2xl"
          >
            <div className="text-small">
              <p className="text-small line-clamp-2">
                <span className="font-bold">Booking ID:</span> {booking.id}
              </p>
              <p className="text-small">
                {booking.venue?.id ? (
                  <Link
                    to={`/venue/${booking.venue.id}`}
                    className="hover:text-primary underline line-clamp-1"
                  >
                    {booking.venue.name}
                  </Link>
                ) : (
                  "Unknown Venue"
                )}
              </p>
              <div className="text-small">
                <h3 className="font-bold ">Booking Date:</h3>
                <p className="text-small">
                  Date From: {new Date(booking.dateFrom).toLocaleDateString()}
                </p>
                <p className="text-small">
                  Date To: {new Date(booking.dateTo).toLocaleDateString()}
                </p>
              </div>
              <p className="text-small">
                <span className="font-bold">Guests:</span> {booking.guests}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                text="Delete Booking"
                type="button"
                className="btn-delete w-full"
                onClick={() => {
                  handleDeleteBooking(booking.id);
                }}
                disabled={isDisabled || isLoading}
                loading={isLoading}
              />
            </div>
          </div>
        ))}
      </div>
      {showDeleteModal && (
        <AlertModal
          message={`Are you sure you want to delete booking with ID "${selectedBookingId}"? This action cannot be undone.`}
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
  );
}

export function ProfileVenueUpcomingBookings() {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    const fetchManagerBookings = async () => {
      try {
        const userData = { name: user.name, accessToken: token };

        const venues = await getUserVenues(userData, token);
        const upcomingBookings = await getVenueManagersUpcomingBookings(
          venues,
          token,
        );
        setBookings(Array.isArray(upcomingBookings) ? upcomingBookings : []);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Could not fetch upcoming bookings for your venues.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchManagerBookings();
  }, [token, user]);

  if (loading) return <Loading />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">
        Upcoming Bookings For Your Venues
      </h2>

      {error && <p className="text-center text-red-500">{error}</p>}

      {bookings.length === 0 && !error && (
        <p className="text-center">
          You have no upcoming bookings for your venues.
        </p>
      )}
      <div className="grid grid-cols-1 text-center sm:text-start sm:grid-cols-2 xl:grid-cols-3 gap-5 text-small">
        {Array.isArray(bookings) &&
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="shadow-xl p-4 mb-4 rounded-2xl hover:shadow-2xl"
            >
              {booking.venue?.id ? (
                <Link
                  to={`/venue/${booking.venue.id}`}
                  className="hover:text-primary underline line-clamp-1"
                >
                  {booking.venue.name}
                </Link>
              ) : (
                "Unknown Venue"
              )}
              <p>
                Date from: {new Date(booking.dateFrom).toLocaleDateString()}
              </p>
              <p>Date to: {new Date(booking.dateTo).toLocaleDateString()}</p>
              <p>Guests: {booking.guests}</p>
              <p>Customer: {booking.customer?.name || "Unknown customer"}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
