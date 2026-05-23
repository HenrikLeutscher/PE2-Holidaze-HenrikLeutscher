import { Link } from "react-router-dom";
import { VenueImage } from "./VenueImage";
import { VenueLocation } from "./ui/VenueLocation";
import { getFacilities } from "../helpers/getFacilities";
import { Venue } from "../types/venue";

export function VenueCard({ venue }: { venue: Venue }) {
  return (
    <Link to={`/venue/${venue.id}`} className="venue-card">
      <div className="relative w-full">
        <VenueImage venue={venue} className="h-44 md:h-60" />
        <VenueLocation venue={venue} />
      </div>
      <div className="flex flex-col gap-2 px-5 border-x border-b rounded-b-2xl border-primary pt-3">
        <div className="flex flex-row justify-between">
          <h3 className="flex-1 line-clamp-1 text-header3">{venue.name}</h3>
          {venue.rating > 0 ? (
            <p className="text-body">⭐ {venue.rating}</p>
          ) : (
            <p className="line-through opacity-50">⭐ {venue.rating}</p>
          )}
        </div>
        <p className="text-body">Price: {venue.price}$ / night</p>
        <p className="text-body">Guest Capacity: {venue.maxGuests}</p>
        <div className="border-primary gap-x-2 border-t-2 px-2">
          {getFacilities(venue.meta)}
        </div>
      </div>
    </Link>
  );
}
