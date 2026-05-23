import { Wifi, Car, Coffee, Dog } from "lucide-react";

export function getFacilities(meta: Record<string, boolean>) {
  if (!meta) return null;

  const facilities = [
    { key: "wifi", Icon: Wifi, label: "Wifi" },
    { key: "parking", Icon: Car, label: "Parking" },
    { key: "breakfast", Icon: Coffee, label: "Breakfast" },
    { key: "pets", Icon: Dog, label: "Pets" },
  ];

  return (
    <div className="flex flex-wrap gap-4 py-2">
      {facilities.map(({ key, Icon, label }) => (
        <div key={key} className="flex flex-col items-center gap-1">
          <Icon
            className={`w-6 h-6 ${meta[key] ? "text-green-500" : "text-red-500"}`}
          />
          <span className="text-small">{label}</span>
        </div>
      ))}
    </div>
  );
}
