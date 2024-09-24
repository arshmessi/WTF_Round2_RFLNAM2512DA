// src/components/AdminEventManagement.tsx
import React, { useState, useEffect } from "react";
import {
  fetchAllEvents,
  createEvent,
  modifyEvent,
  deleteEvent,
  searchEvents,
} from "../services/api";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  ticketPrice: number;
}

interface AdminEventManagementProps {
  token: string;
}

const AdminEventManagement: React.FC<AdminEventManagementProps> = ({
  token,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    ticketPrice: 0,
  });
  const [searchQuery, setSearchQuery] = useState({ name: "", location: "" });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await fetchAllEvents(token);
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await searchEvents(searchQuery);
      setEvents(response.data);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleDelete = async (eventId: number) => {
    try {
      await deleteEvent(eventId, token);
      loadEvents();
    } catch (error) {
      console.error("Failed to delete event", error);
    }
  };

  const handleModify = async (eventId: number, eventData: Partial<Event>) => {
    try {
      await modifyEvent(eventId, eventData, token);
      loadEvents();
    } catch (error) {
      console.error("Failed to modify event", error);
    }
  };

  const handleCreateEvent = async () => {
    try {
      await createEvent(newEvent, token);
      loadEvents();
      setNewEvent({
        name: "",
        date: "",
        location: "",
        description: "",
        ticketPrice: 0,
      });
    } catch (error) {
      console.error("Failed to create event", error);
    }
  };

  return (
    <div>
      <h1>Event Management</h1>

      {/* Search Box */}
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery.name}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Search by location"
          value={searchQuery.location}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, location: e.target.value })
          }
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Event List */}
      <div>
        {events.length ? (
          events.map((event) => (
            <div key={event.id}>
              <h3>{event.name}</h3>
              <p>{event.description}</p>
              <p>Location: {event.location}</p>
              <p>Date: {event.date}</p>
              <p>Price: ${event.ticketPrice}</p>
              <button onClick={() => handleModify(event.id, event)}>
                Modify
              </button>
              <button onClick={() => handleDelete(event.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No events found</p>
        )}
      </div>

      {/* Create Event Form */}
      <div>
        <h2>Create New Event</h2>
        <input
          type="text"
          placeholder="Event Name"
          value={newEvent.name}
          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
        />
        <input
          type="date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newEvent.location}
          onChange={(e) =>
            setNewEvent({ ...newEvent, location: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Description"
          value={newEvent.description}
          onChange={(e) =>
            setNewEvent({ ...newEvent, description: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Ticket Price"
          value={newEvent.ticketPrice}
          onChange={(e) =>
            setNewEvent({ ...newEvent, ticketPrice: Number(e.target.value) })
          }
        />
        <button onClick={handleCreateEvent}>Create Event</button>
      </div>
    </div>
  );
};

export default AdminEventManagement;
