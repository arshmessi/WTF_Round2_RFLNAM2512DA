import React, { useState } from "react";

interface EventBookingFormProps {
  eventId: string;
  onClose: () => void;
  onBook: (eventId: string, tickets: number) => void;
}

const EventBookingForm: React.FC<EventBookingFormProps> = ({
  eventId,
  onClose,
  onBook,
}) => {
  const [tickets, setTickets] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tickets > 0) {
      onBook(eventId, tickets);
      onClose();
    }
  };

  return (
    <div>
      <h3>Book Tickets</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={tickets}
          onChange={(e) => setTickets(Number(e.target.value))}
          min="1"
        />
        <button type="submit">Book</button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default EventBookingForm;
