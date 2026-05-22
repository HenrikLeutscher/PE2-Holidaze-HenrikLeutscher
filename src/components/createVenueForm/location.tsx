import type { VenueLocationProps } from "../../types/VenueFormProps";
import { InputField } from "../ui/InputField";

export function VenueLocation({ formData, setFormData }: VenueLocationProps) {
  return (
    <div className="mb-4">
      <label className="font-semibold mb-2 block">Location</label>
      <InputField
        label="Address"
        type="text"
        name="address"
        value={formData.location.address}
        onChange={(e) =>
          setFormData({
            ...formData,
            location: { ...formData.location, address: e.target.value },
          })
        }
        placeholder="123 Main St"
      />
      <InputField
        label="City"
        type="text"
        name="city"
        value={formData.location.city}
        onChange={(e) =>
          setFormData({
            ...formData,
            location: { ...formData.location, city: e.target.value },
          })
        }
        placeholder="Oslo"
      />
      <InputField
        label="Zip"
        type="text"
        name="zip"
        value={formData.location.zip}
        onChange={(e) =>
          setFormData({
            ...formData,
            location: { ...formData.location, zip: e.target.value },
          })
        }
        placeholder="0000"
      />
      <InputField
        label="Country"
        type="text"
        name="country"
        value={formData.location.country}
        onChange={(e) =>
          setFormData({
            ...formData,
            location: { ...formData.location, country: e.target.value },
          })
        }
        placeholder="Norway"
      />
      <InputField
        label="Continent"
        type="text"
        name="continent"
        value={formData.location.continent}
        onChange={(e) =>
          setFormData({
            ...formData,
            location: { ...formData.location, continent: e.target.value },
          })
        }
        placeholder="Europe"
      />
    </div>
  );
}
