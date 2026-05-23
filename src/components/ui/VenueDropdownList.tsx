import { Venue } from "../../types/venue";

export function VenueDropDownList({ venue }: { venue: Venue }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={venue.media[0]?.url}
        alt={venue.media[0]?.alt || venue.name}
        className="w-30 h-15"
      />
      <div className="flex flex-col items-start gap-1">
        <p className="text-bodytext">{venue.name}</p>
        <p className="text-bodytext">${venue.price}</p>
      </div>
    </div>
  );
}
