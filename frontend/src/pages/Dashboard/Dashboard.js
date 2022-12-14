import {
  Box,
  Container,
  CssBaseline,
  Link,
  Toolbar,
  Typography
} from "@mui/material";
import { DrawerNHeader } from "components/DrawerNHeader/DrawerNHeader";
import { Outlet } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function DashboardContent() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <DrawerNHeader />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </Box>
  );
}

export default function Dashboard(props) {
  return <DashboardContent heading={props.heading ? props.heading : null} />;
}
