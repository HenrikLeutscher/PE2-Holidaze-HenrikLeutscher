import { Venue } from "../../types/venue";
import { useNavigate } from "react-router-dom";

export function VenueDropDownList({ venue }: { venue: Venue }) {
  const navigate = useNavigate();
  return (
    <>
      <img
        src={venue.media[0]?.url}
        alt={venue.media[0]?.alt || venue.name}
        className="w-30 h-15"
      />
      <p className="text-bodytext">{venue.name}</p>
      <p className="text-bodytext">${venue.price}</p>
    </>
  );
}
