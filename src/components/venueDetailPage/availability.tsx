import { useEffect, useState } from "react";
import type { Booking } from "../../types/booking";
import { getVenueBookings } from "../../api/getVenueBookings";
import { useAuth } from "../../context/useAuth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AvailabilityProps {
  venueId: string;
  onSelectDates?: (start: Date, end: Date) => void;
}

export function Availability({ venueId, onSelectDates }: AvailabilityProps) {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState<
    [Date | null, Date | null]
  >([null, null]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const venueBookings = await getVenueBookings(venueId, token as string);
        setBookings(venueBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [venueId, token]);

  const excludedDates: Date[] = [];
  bookings.forEach((b) => {
    const start = new Date(b.dateFrom);
    const end = new Date(b.dateTo);
    let current = new Date(start);
    while (current <= end) {
      excludedDates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  });

  if (loading) return <div>Loading availability...</div>;

  return (
    <div className="my-4">
      <DatePicker
        selected={selectedRange[0]}
        onChange={(dates) => {
          const [start, end] = dates as [Date, Date];
          setSelectedRange([start, end]);
          if (onSelectDates && start && end) onSelectDates(start, end);
        }}
        startDate={selectedRange[0]}
        endDate={selectedRange[1]}
        selectsRange
        inline
        excludeDates={excludedDates}
        minDate={new Date()}
      />
    </div>
  );
}
