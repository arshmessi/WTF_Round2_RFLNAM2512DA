// theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212", // Dark background color
      paper: "#1E1E1E", // Card background color
    },
    text: {
      primary: "#F5F5DC", // Sepia/yellowish text color
      secondary: "#D3D3D3", // Lighter text for secondary elements
    },
  },
});

export default theme;
