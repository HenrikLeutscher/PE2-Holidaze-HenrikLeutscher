import { Venue } from "../../types/venue";

export function VenueLocation({ venue }: { venue: Venue }) {
  const city = venue.location.city;
  const country = venue.location.country;

  if (!city && !country) {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 p-2 m-2 text-white bg-primary  rounded-xl text-xs md:text-md">
      <span className="text-small">{city ? city + ", " : ""}</span>
      <span className="text-small">{country}</span>
    </div>
  );
}
