import { InputField } from "../ui/InputField";
import { BasicVenueFieldsProps } from "../../types/VenueFormProps";
import { sanitizeInput } from "../../helpers/sanitizeInput";

export function BasicVenueFields({
  formData,
  setFormData,
}: BasicVenueFieldsProps) {
  return (
    <div>
      <InputField
        label="Venue Name *"
        type="text"
        name="name"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: sanitizeInput(e.target.value) })
        }
        placeholder="Enter venue name"
        required
      />
      <InputField
        label="Venue Description *"
        type="text"
        name="description"
        value={formData.description}
        onChange={(e) =>
          setFormData({
            ...formData,
            description: sanitizeInput(e.target.value),
          })
        }
        placeholder="Enter venue description"
        required
      />
      {/* Multiple Media Inputs */}
      <label className="font-semibold text-gray-700">Images</label>
      {formData.media.map((media, index) => (
        <div key={index} className="flex gap-2 my-4 items-center">
          <InputField
            name={`mediaUrl${index}`}
            label={`Image URL ${index + 1}`}
            type="text"
            value={media.url}
            onChange={(e) => {
              const newMedia = [...formData.media];
              newMedia[index].url = e.target.value;
              setFormData({ ...formData, media: newMedia });
            }}
            placeholder="Enter venue media URL"
          />
          <InputField
            name={`mediaAlt${index}`}
            label={`Image ALT ${index + 1}`}
            type="text"
            value={media.alt}
            onChange={(e) => {
              const newMedia = [...formData.media];
              newMedia[index].alt = sanitizeInput(e.target.value);
              setFormData({ ...formData, media: newMedia });
            }}
            placeholder="Enter media ALT text"
          />
          <button
            type="button"
            className="text-red-500 font-bold mt-2"
            onClick={() => {
              const newMedia = formData.media.filter((_, i) => i !== index);
              setFormData({
                ...formData,
                media: newMedia.length ? newMedia : [{ url: "", alt: "" }],
              });
            }}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-blue-500 font-semibold mt-1"
        onClick={() =>
          setFormData({
            ...formData,
            media: [...formData.media, { url: "", alt: "" }],
          })
        }
      >
        + Add Image
      </button>
      <InputField
        label="Price *"
        type="number"
        name="price"
        value={formData.price}
        onChange={(e) =>
          setFormData({ ...formData, price: Number(e.target.value) })
        }
        placeholder="Enter venue price"
        required
      />
      <InputField
        label="Max Guests *"
        type="number"
        name="maxGuests"
        value={formData.maxGuests}
        onChange={(e) =>
          setFormData({ ...formData, maxGuests: Number(e.target.value) })
        }
        placeholder="Enter max guests"
        required
      />
    </div>
  );
}
