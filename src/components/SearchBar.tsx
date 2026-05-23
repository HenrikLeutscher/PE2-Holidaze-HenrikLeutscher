import { useState, useEffect, useRef } from "react";
import { BASE_API_URL } from "../api/api";
import type { Venue } from "../types/venue";
import type { searchBarProps } from "../types/searchBarProps";
import { useNavigate } from "react-router-dom";
import { VenueDropDownList } from "./ui/VenueDropdownList";

export function SearchBar({ searchQuery, setSearchQuery }: searchBarProps) {
  const [results, setResults] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    setHasSearched(false);

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_API_URL}/holidaze/venues/search?q=${encodeURIComponent(
            searchQuery,
          )}&_owner=true&_bookings=true&limit=10&sort=created&order=desc`,
        );
        if (!res.ok) throw new Error("Failed to search venues");
        const data = await res.json();
        setResults(data.data || []);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
        setHasSearched(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setResults([]);
        setHasSearched(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-1/2 mx-auto" ref={dropdownRef}>
      <input
        id="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search venues..."
        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      {loading && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 p-2 text-center">
          Loading results...
        </div>
      )}
      {results.length > 0 && !loading && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-120 overflow-y-auto z-50">
          <ul>
            {results.map((venue) => (
              <li
                key={venue.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-center flex flex-row border-b-2 border-primary justify-between items-center"
                onClick={() => {
                  navigate(`/venue/${venue.id}`);
                }}
              >
                <VenueDropDownList venue={venue} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {searchQuery.trim() &&
        hasSearched &&
        results.length === 0 &&
        !loading && (
          <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 p-2 text-center">
            No results could be found
          </div>
        )}
    </div>
  );
}
