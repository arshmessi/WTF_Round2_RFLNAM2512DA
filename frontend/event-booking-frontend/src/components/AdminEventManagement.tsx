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
  Modal,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

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
  const [newEvent, setNewEvent] = useState<Event>({
    id: 0,
    name: "",
    date: "",
    location: "",
    description: "",
    ticketPrice: 0,
  });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ name: "", location: "" });
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [focusedEvent, setFocusedEvent] = useState<Event | null>(null);
  const [expandedDescription, setExpandedDescription] = useState<number | null>(
    null
  );
  const [isSearchOngoing, setIsSearchOngoing] = useState(false); // New state for search
  const [showCreateEventCard, setShowCreateEventCard] = useState(false); // State to show/hide create event card

  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await fetchAllEvents(token);
      setEvents(response.data);
      setNoResultsFound(false);
      setIsSearchOngoing(false); // Reset search status on load
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  };

  const handleSearch = async () => {
    setIsSearchOngoing(true); // Mark search as ongoing
    try {
      const response = await searchEvents(searchQuery);
      if (response.data.length === 0) {
        setNoResultsFound(true);
        setEvents([]);
      } else {
        setEvents(response.data);
        setNoResultsFound(false);
      }
    } catch (error) {
      setNoResultsFound(true);
      console.error("Search failed", error);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery({ name: "", location: "" });
    loadEvents();
    setNoResultsFound(false);
    setIsSearchOngoing(false); // Reset search status
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
        id: 0,
        name: "",
        date: "",
        location: "",
        description: "",
        ticketPrice: 0,
      });
      setShowCreateEventCard(false); // Hide the create event card after creation
    } catch (error) {
      console.error("Failed to create event", error);
    }
  };

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setIsEditing(true);
  };

  const handleModifyEvent = async () => {
    if (editingEvent) {
      try {
        await modifyEvent(editingEvent.id, editingEvent, token);
        loadEvents();
        setEditingEvent(null);
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to modify event", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEditing && editingEvent) {
      setEditingEvent({ ...editingEvent, [e.target.name]: e.target.value });
    } else {
      setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const handleGoToDashboard = () => {
    navigate("/admin-dashboard");
  };

  const handleEventClick = (event: Event) => {
    setFocusedEvent(event); // Set the event to be focused
  };

  const handleCloseFocus = () => {
    setFocusedEvent(null); // Clear the focused event
  };

  const toggleDescription = (eventId: number) => {
    setExpandedDescription(expandedDescription === eventId ? null : eventId);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Event Management
      </Typography>

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
            {/* Show clear search button only when search is ongoing */}
            {isSearchOngoing && (
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

      {/* Horizontal Scroll Container for Events */}
      <Box sx={{ overflowX: "auto", mb: 4 }}>
        <Stack direction="row" spacing={2}>
          {noResultsFound ? (
            <Typography variant="body1">No such event found.</Typography>
          ) : events.length ? (
            events.map((event) => (
              <Card
                key={event.id}
                sx={{ width: 300, flexShrink: 0 }} // Prevent card from shrinking
                onClick={() => handleEventClick(event)} // Click event for focus
              >
                <CardContent>
                  <Typography variant="h6">{event.name}</Typography>
                  <Typography variant="body2">
                    {event.description.substring(0, 50)}...
                  </Typography>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(event);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(event.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1">Loading events...</Typography>
          )}
        </Stack>
      </Box>

      {/* Button to Create New Event */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowCreateEventCard(true)} // Show create event card
      >
        Create Event
      </Button>

      {/* Create Event Card */}
      <Modal
        open={showCreateEventCard}
        onClose={() => setShowCreateEventCard(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Create Event
          </Typography>
          <TextField
            label="Event Name"
            name="name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newEvent.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Event Date"
            name="date"
            variant="outlined"
            fullWidth
            margin="normal"
            type="date"
            value={newEvent.date}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Location"
            name="location"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newEvent.location}
            onChange={handleInputChange}
          />
          <TextField
            label="Description"
            name="description"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newEvent.description}
            onChange={handleInputChange}
          />
          <TextField
            label="Ticket Price"
            name="ticketPrice"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            value={newEvent.ticketPrice}
            onChange={handleInputChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateEvent}
            sx={{ mt: 2 }}
          >
            Create Event
          </Button>
        </Box>
      </Modal>

      {/* Editing Event Card */}
      <Modal open={isEditing} onClose={handleCancelEdit}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Modify Event
          </Typography>
          <TextField
            label="Event Name"
            name="name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editingEvent?.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Event Date"
            name="date"
            variant="outlined"
            fullWidth
            margin="normal"
            type="date"
            value={editingEvent?.date}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Location"
            name="location"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editingEvent?.location}
            onChange={handleInputChange}
          />
          <TextField
            label="Description"
            name="description"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editingEvent?.description}
            onChange={handleInputChange}
          />
          <TextField
            label="Ticket Price"
            name="ticketPrice"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            value={editingEvent?.ticketPrice}
            onChange={handleInputChange}
          />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleModifyEvent}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Focused Event Modal */}
      <Modal open={Boolean(focusedEvent)} onClose={handleCloseFocus}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // width: { xs: "75%", sm: 400 }, // Responsive width
            border: "1px solid #ccc", // Light border color
            borderRadius: "16px", // Rounded corners
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for depth

            bgcolor: "background.paper",
            // boxShadow: 24,
            p: 4,
            maxWidth: "65%",
            maxHeight: "80vh", // Set a maximum height for the modal
            overflowY: "auto", // Enable vertical scrolling
          }}
        >
          <Typography variant="h6" gutterBottom>
            {focusedEvent?.name}
          </Typography>
          <Typography variant="body2">{focusedEvent?.description}</Typography>
          <Typography variant="body2" color="textSecondary">
            Location: {focusedEvent?.location}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Date: {focusedEvent?.date}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Price: ${focusedEvent?.ticketPrice}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseFocus}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default AdminEventManagement;
