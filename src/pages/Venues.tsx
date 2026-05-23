import { useEffect, useState } from "react";
import { getVenues } from "../api/venues";
import { VenueCard } from "../components/VenueCard";
import { SearchBar } from "../components/SearchBar";
import { Loading } from "../components/ui/Loading";
import { Pagination } from "../components/Pagination";
import type { Venue } from "../types/venue";

export function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 24;

  useEffect(() => {
    document.title = "Venues | Holidaze";
    setIsLoading(true);
    getVenues(currentPage, itemsPerPage, sortOrder)
      .then(({ venues, totalCount }) => {
        setVenues(venues);
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      })
      .catch((err) => setError(err.message || "Failed to load venues"))
      .finally(() => setIsLoading(false));
  }, [currentPage, sortOrder]);

  if (isLoading) return <Loading />;
  if (error)
    return <div className="text-center my-auto text-red-600 pt-5">{error}</div>;

  return (
    <div className="pt-5">
      <h2 className="text-center text-2xl font-bold">Venues</h2>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex justify-center py-4">
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value as "asc" | "desc");
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
      <p className="text-center text-small">
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
