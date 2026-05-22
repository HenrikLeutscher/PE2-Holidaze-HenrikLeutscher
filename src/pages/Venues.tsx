import { useEffect, useState } from "react";
import { getVenues } from "../api/venues";
import { VenueCard } from "../components/VenueCard";
import { SearchBar } from "../components/SearchBar";
import { Loading } from "../components/ui/Loading";
import { Pagination } from "../components/Pagination";
import { Venue } from "../types/venue";
import { BASE_API_URL } from "../api/api";

export function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 24;

  useEffect(() => {
    document.title = "Venues | Holidaze";
    setIsLoading(true);
    getVenues(currentPage, itemsPerPage)
      .then(({ venues, totalCount }) => {
        setVenues(venues);
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      })
      .catch((err) => setError(err.message || "Failed to load venues"))
      .finally(() => setIsLoading(false));
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    const filtered = venues.filter((venue) =>
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredVenues(filtered);
  }, [searchQuery, venues]);

  if (isLoading) return <Loading />;
  if (error)
    return <div className="text-center text-red-600 pt-5">{error}</div>;

  return (
    <div className="pt-5">
      <h2 className="text-center text-2xl font-bold">Venues</h2>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <p>
        Page {currentPage} of {totalPages}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-5 px-10">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center pt-5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
