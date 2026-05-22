import { useState } from "react";
import { Venue } from "../types/venue";

export function VenueImage({
  venue,
  className = "h-60",
}: {
  venue: Venue;
  className?: string;
}) {
  const imageUrl = venue.media?.[0]?.url;
  const [hasError, setHasError] = useState(false);
  const showFallback = !imageUrl || hasError;
  const venueRating = venue.rating;

  return (
    <div className={`relative w-full`}>
      {showFallback ? (
        <div
          className={`bg-gray-200 ${className} w-full rounded-t-2xl flex items-center justify-center text-imgplaceholder`}
        >
          <span>{venue.name?.charAt(0).toUpperCase()}</span>
        </div>
      ) : (
        <>
          <img
            src={imageUrl}
            alt={venue.media?.[0]?.alt || "Venue image"}
            className={`${className} w-full rounded-t-2xl object-cover`}
            onError={() => setHasError(true)}
          />
          {venueRating === 5 && (
            <span className="absolute top-2 right-2 bg-white text-black text-small font-bold py-1 px-2 rounded rotate-4">
              Guest Favorite
            </span>
          )}
        </>
      )}
    </div>
  );
}

export function VenueImageDetail({ venue }: { venue: any }) {
  const images = venue.media?.length ? venue.media : [];
  const [mainIndex, setMainIndex] = useState(0);
  const mainImage = images[mainIndex]?.url;
  const [hasError, setHasError] = useState(false);

  const showFallback = !mainImage || hasError;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main image */}
      {showFallback ? (
        <div className="bg-gray-200 h-80 w-full flex items-center justify-center text-5xl font-bold rounded">
          {venue.name?.charAt(0).toUpperCase()}
        </div>
      ) : (
        <img
          src={mainImage}
          alt={images[mainIndex]?.alt || "Venue image"}
          className="w-full h-80 object-cover rounded"
          onError={() => setHasError(true)}
        />
      )}

      {/* Thumbnails */}
      {images.length && (
        <div className="flex gap-2 overflow-x-auto pt-2">
          {images.map((img: any, index: number) => (
            <img
              key={index}
              src={img.url}
              alt={img.alt || `Thumbnail ${index + 1}`}
              className={`h-20 w-20 object-cover rounded cursor-pointer border-2 ${
                index === mainIndex ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => setMainIndex(index)}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/150?text=No+Image";
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
