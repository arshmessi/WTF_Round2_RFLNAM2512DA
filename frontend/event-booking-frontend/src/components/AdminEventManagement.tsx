import React, { useState, useEffect } from "react";
import {
  fetchAllEvents,
  createEvent,
  modifyEvent,
  deleteEvent,
  searchEvents,
} from "../services/api";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Container,
  IconButton,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom"; // Import useNavigate

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
  const [editingEvent, setEditingEvent] = useState<Event | null>(null); // Track the event being edited
  const [isEditing, setIsEditing] = useState(false); // Control form display
  const [isSearchActive, setIsSearchActive] = useState(false); // Track if search is active
  const [noResultsFound, setNoResultsFound] = useState(false); // Track no results state

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await fetchAllEvents(token);
      setEvents(response.data);
      setNoResultsFound(false); // Reset no results state
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await searchEvents(searchQuery);
      if (response.data.length === 0) {
        setNoResultsFound(true); // Set no results found state
        setEvents([]); // Clear events if none found
      } else {
        setEvents(response.data);
        setNoResultsFound(false); // Reset no results state
      }
      setIsSearchActive(true); // Set search active
    } catch (error) {
      setNoResultsFound(true);
      setIsSearchActive(true);
      console.error("Search failed", error);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery({ name: "", location: "" });
    loadEvents(); // Reload all events
    setIsSearchActive(false); // Reset search active
    setNoResultsFound(false); // Reset no results found state
  };

  const handleDelete = async (eventId: number) => {
    try {
      await deleteEvent(eventId, token);
      loadEvents();
    } catch (error) {
      console.error("Failed to delete event", error);
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

  const handleEditClick = (event: Event) => {
    setEditingEvent(event); // Set the event to be edited
    setIsEditing(true); // Show the edit form
  };

  const handleModifyEvent = async () => {
    if (editingEvent) {
      try {
        await modifyEvent(editingEvent.id, editingEvent, token);
        loadEvents();
        setEditingEvent(null); // Clear after editing
        setIsEditing(false); // Hide edit form
      } catch (error) {
        console.error("Failed to modify event", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingEvent(null); // Clear selected event
    setIsEditing(false); // Hide edit form
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEditing && editingEvent) {
      setEditingEvent({ ...editingEvent, [e.target.name]: e.target.value });
    } else {
      setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    }
  };

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session storage
    navigate("/"); // Redirect to home page
  };

  const handleGoToDashboard = () => {
    navigate("/admin-dashboard"); // Redirect to admin page
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Event Management
      </Typography>

      {/* Buttons for Logout and Go to Dashboard */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleGoToDashboard}
          sx={{ marginRight: 2 }}
        >
          Return to Dashboard
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Search Box */}
      <Box mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search by name"
              variant="outlined"
              value={searchQuery.name}
              onChange={(e) =>
                setSearchQuery({ ...searchQuery, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search by location"
              variant="outlined"
              value={searchQuery.location}
              onChange={(e) =>
                setSearchQuery({ ...searchQuery, location: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              fullWidth
            >
              Search
            </Button>
            {isSearchActive && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClearSearch}
                fullWidth
                sx={{ mt: 2 }}
              >
                Clear Search
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Event List */}
      <Grid container spacing={3}>
        {noResultsFound ? (
          <Typography variant="body1">No such event found.</Typography>
        ) : events.length ? (
          events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6">{event.name}</Typography>
                  <Typography variant="body2">{event.description}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Location: {event.location}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Date: {event.date}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Price: ${event.ticketPrice}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={2}>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(event)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(event.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">Loading events...</Typography>
        )}
      </Grid>

      {/* Create or Edit Event Form */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          {isEditing ? "Edit Event" : "Create New Event"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Event Name"
              name="name"
              variant="outlined"
              value={
                isEditing && editingEvent ? editingEvent.name : newEvent.name
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              value={
                isEditing && editingEvent ? editingEvent.date : newEvent.date
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              variant="outlined"
              value={
                isEditing && editingEvent
                  ? editingEvent.location
                  : newEvent.location
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              variant="outlined"
              value={
                isEditing && editingEvent
                  ? editingEvent.description
                  : newEvent.description
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ticket Price"
              name="ticketPrice"
              type="number"
              variant="outlined"
              value={
                isEditing && editingEvent
                  ? editingEvent.ticketPrice
                  : newEvent.ticketPrice
              }
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={isEditing ? handleModifyEvent : handleCreateEvent}
          sx={{ mt: 2 }}
        >
          {isEditing ? "Update Event" : "Create Event"}
        </Button>
        {isEditing && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancelEdit}
            sx={{ mt: 2, ml: 2 }}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default AdminEventManagement;
