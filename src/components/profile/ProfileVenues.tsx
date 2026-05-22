import { useEffect, useState } from "react";
import { getUserVenues } from "../../api/getUserVenuesAndBookings";
import { useAuth } from "../../context/useAuth";
import { Loading } from "../ui/Loading";
import { VenueCard } from "../VenueCard";

export function ProfileVenues() {
  const { user, token } = useAuth();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !user) {
      setLoading(false);
      setError("You must be logged in to view this page.");
      return;
    }

    const fetchUserVenues = async () => {
      try {
        setLoading(true);
        setError("");

        const userData = { name: user.name, accessToken: token };

        const data = await getUserVenues(userData, token);
        setVenues(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserVenues();
  }, [token, user]);

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-500 my-auto">{error}</p>;

  return (
    <div>
      <h2 className="text-header2 font-bold mb-4 text-center">Your Venues</h2>
      {venues.length === 0 ? (
        <p className="text-center">You currently have 0 active venues.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {venues.map((venue: any) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  );
}
