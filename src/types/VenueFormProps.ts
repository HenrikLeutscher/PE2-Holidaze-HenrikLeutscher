import type { Venue } from "./venue.ts";

export type BasicVenueFieldsProps = {
  formData: Venue;
  setFormData: React.Dispatch<React.SetStateAction<Venue>>;
};

export type MetaFieldsProps = {
  formData: Venue;
  setFormData: React.Dispatch<React.SetStateAction<Venue>>;
};

export type VenueLocationProps = {
  formData: Venue;
  setFormData: React.Dispatch<React.SetStateAction<Venue>>;
};
