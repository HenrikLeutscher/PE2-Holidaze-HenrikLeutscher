import { useEffect, useState } from "react";
import { getVenues } from "../api/venues";
import { VenueCard } from "../components/VenueCard";
import { getLatestVenues } from "../api/dataFilters";
import { getTopVenues } from "../api/dataFilters";
import { Loading } from "../components/ui/Loading";
import { Button } from "../components/ui/Button";
import { Link, useNavigate } from "react-router";

export function HomePage() {
  const [latestVenues, setLatestVenues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topVenues, setTopVenues] = useState<any[]>([]);
  const navigate = useNavigate();
  document.title = "Home | Holidaze";

  useEffect(() => {
    async function fetchVenues() {
      try {
        const { venues } = await getVenues();
        const latest = getLatestVenues(venues);
        const top = getTopVenues(venues);
        setLatestVenues(latest);
        setTopVenues(top);
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVenues();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="main-section py-20">
      <div className="border-y py-2">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-5">
          <h1 className="text-header1">Latest Venues</h1>
          <Button
            text="View All"
            className="ml-5"
            onClick={() => navigate("/venues")}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {latestVenues.map((venue: any) => (
            <div key={venue.id}>
              <VenueCard venue={venue} />
            </div>
          ))}
        </div>
      </div>
      <div className="border-y py-2">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-5">
          <h1 className="text-header1">Top Venues</h1>
          <Button
            text="View All"
            className="ml-5"
            onClick={() => navigate("/venues")}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {topVenues.map((venue: any) => (
            <div key={venue.id}>
              <VenueCard venue={venue} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
