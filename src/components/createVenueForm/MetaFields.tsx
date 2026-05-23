import { MetaFieldsProps } from "../../types/VenueFormProps";

export function MetaFields({ formData, setFormData }: MetaFieldsProps) {
  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2 block">Amenities</h3>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {Object.keys(formData.meta || {}).map((key) => (
          <label key={key} className="mr-4 flex items-center gap-1">
            <input
              type="checkbox"
              checked={
                formData.meta?.[key as keyof typeof formData.meta] || false
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  meta: {
                    ...formData.meta,
                    [key]: e.target.checked,
                  },
                })
              }
            />
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        ))}
      </div>
    </div>
  );
}
