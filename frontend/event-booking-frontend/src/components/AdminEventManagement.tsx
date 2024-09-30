import React, { useState } from "react";
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
  CardMedia,
  Typography,
  TextField,
  Button,
  Container,
  IconButton,
  Stack,
  Modal,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import eventImages from "../utils/images";
import { EventCategory } from "../utils/eventType";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

interface Event {
  id: number;
  name: string;
  startDate: string; // Updated field
  endDate: string; // New field for end date
  location: string;
  description: string;
  ticketPrice: number;
  category: EventCategory;
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
    startDate: "", // Updated field
    endDate: "", // New field for end date
    location: "",
    description: "",
    ticketPrice: 0,
    category: EventCategory.other,
  });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ name: "", location: "" });
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [focusedEvent, setFocusedEvent] = useState<Event | null>(null);
  // const [expandedDescription, setExpandedDescription] = useState<number | null>(
  //   null
  // );
  const [isSearchOngoing, setIsSearchOngoing] = useState(false); // New state for search
  const [showCreateEventCard, setShowCreateEventCard] = useState(false); // State to show/hide create event card

  const navigate = useNavigate();

  const loadEvents = async () => {
    try {
      const response = await fetchAllEvents(token);
      setEvents(response.data || []);
      setNoResultsFound(false);
      setIsSearchOngoing(false); // Reset search status on load
    } catch (error) {
      console.error("Failed to fetch events", error);
      setNoResultsFound(true);
    }
  };
  // useEffect(() => {
  loadEvents();
  // }, []);

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
  const handleCategoryChange = (event: SelectChangeEvent<EventCategory>) => {
    if (isEditing && editingEvent) {
      setEditingEvent((prevEvent) => ({
        ...prevEvent!,
        category: event.target.value as EventCategory,
      }));
    } else {
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        category: event.target.value as EventCategory,
      }));
    }
  };

  const handleCreateEvent = async () => {
    try {
      await createEvent(newEvent, token);
      loadEvents();
      setNewEvent({
        id: 0,
        name: "",
        startDate: "", // Updated field
        endDate: "", // New field for end date
        location: "",
        description: "",
        ticketPrice: 0,
        category: EventCategory.other,
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

  // const toggleDescription = (eventId: number) => {
  //   setExpandedDescription(expandedDescription === eventId ? null : eventId);
  // };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "white" }}>
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
                {/* Add CardMedia for the event image */}
                <CardMedia
                  component="img"
                  height="140"
                  image={eventImages[event.category] || eventImages.other} // Use images mapped to categories
                  alt={event.name}
                />
                <CardContent>
                  <Typography variant="h6">{event.name}</Typography>
                  <Typography variant="body2">
                    {event.description.substring(0, 50)}...
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Location: {event.location}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Start Date: {event.startDate} {/* Updated field */}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    End Date: {event.endDate} {/* New field for end date */}
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

      {/* Create Event Card */}
      {showCreateEventCard && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5">Create Event</Typography>
            <TextField
              label="Name"
              variant="outlined"
              name="name"
              value={newEvent.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Start Date"
              variant="outlined"
              name="startDate" // Updated field
              value={newEvent.startDate} // Updated field
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="End Date"
              variant="outlined"
              name="endDate" // New field for end date
              value={newEvent.endDate} // New field for end date
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Location"
              variant="outlined"
              name="location"
              value={newEvent.location}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              variant="outlined"
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Ticket Price"
              variant="outlined"
              name="ticketPrice"
              value={newEvent.ticketPrice}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="number"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={newEvent.category}
                onChange={handleCategoryChange}
                fullWidth
              >
                {Object.values(EventCategory).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateEvent}
              fullWidth
              sx={{ mt: 2 }}
            >
              Create Event
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowCreateEventCard(false)}
              fullWidth
              sx={{ mt: 1 }}
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowCreateEventCard(true)}
      >
        Create New Event
      </Button>

      {/* Edit Event Modal */}
      {isEditing && editingEvent && (
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
            <Typography variant="h6">Edit Event</Typography>
            <TextField
              label="Name"
              variant="outlined"
              name="name"
              value={editingEvent.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Start Date"
              variant="outlined"
              name="startDate" // Updated field
              value={editingEvent.startDate} // Updated field
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="End Date"
              variant="outlined"
              name="endDate" // New field for end date
              value={editingEvent.endDate} // New field for end date
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Location"
              variant="outlined"
              name="location"
              value={editingEvent.location}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              variant="outlined"
              name="description"
              value={editingEvent.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Ticket Price"
              variant="outlined"
              name="ticketPrice"
              value={editingEvent.ticketPrice}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="number"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label-edit">Category</InputLabel>
              <Select
                labelId="category-label-edit"
                name="category"
                value={editingEvent?.category || ""} // Handle null case
                onChange={handleCategoryChange}
                fullWidth
              >
                {Object.values(EventCategory).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={handleModifyEvent}
              fullWidth
              sx={{ mt: 2 }}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancelEdit}
              fullWidth
              sx={{ mt: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </Modal>
      )}

      {/* Focused Event Modal */}
      {focusedEvent && (
        <Modal open={Boolean(focusedEvent)} onClose={handleCloseFocus}>
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
            <Typography variant="h6">{focusedEvent.name}</Typography>
            <Typography variant="body2">{focusedEvent.description}</Typography>
            <Typography variant="body2">
              Location: {focusedEvent.location}
            </Typography>
            <Typography variant="body2">
              Start Date: {focusedEvent.startDate}
            </Typography>
            <Typography variant="body2">
              End Date: {focusedEvent.endDate}
            </Typography>
            <Typography variant="body2">
              Price: ${focusedEvent.ticketPrice}
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseFocus}
              fullWidth
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      )}
    </Container>
  );
};

export default AdminEventManagement;
