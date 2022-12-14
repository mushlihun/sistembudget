import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ArticleIcon from "@mui/icons-material/Article";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  Box,
  Divider,
  IconButton,
  ListSubheader,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import NotificationPanel from "components/NotificationPanel/NotificationPanel";
import { signOut } from "firebase/auth";
import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "util/Firebase/FirebaseSetup";
import { clearLocalStorage } from "util/Storage/Storage";
import styles from "./DrawerNHeader.style";
import Article from "@mui/icons-material/Article";
import ToggleTheme from "components/ToggleTheme/ToggleTheme";

const drawerWidth = 240;
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
export const MainListItems = () => {
  const mainList = [
    { icon: <DashboardIcon />, label: "Dashboard", to: "/dashboard" },
    { icon: <CurrencyRupeeIcon />, label: "Bills", to: "/dashboard/bills" },
  ];
  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        General
      </ListSubheader>
      {mainList.map((row, i) => (
        <Link
          key={i.toString()}
          to={row.to}
          style={{ color: "inherit", textDecoration: "inherit" }}
        >
          <ListItemButton display="flex">
            <Tooltip title={row.label}>
              <ListItemIcon>{row.icon}</ListItemIcon>
            </Tooltip>
            <ListItemText primary={row.label} />
          </ListItemButton>
        </Link>
      ))}
    </React.Fragment>
  );
};
export const SecondaryListItems = () => {
  const secondaryList = [
    {
      icon: <CurrencyRupeeIcon />,
      label: "My Bills",
      to: "/dashboard/mybills",
    },
    {
      icon: <ArticleIcon />,
      label: "My Activity",
      to: "/dashboard/coming_soon",
    },
  ];
  const appList = [
    {
      icon: <CalendarMonthIcon />,
      label: "Calendar",
      to: "/dashboard/coming_soon",
    },
    {
      icon: <AccessTimeIcon />,
      label: "Clock",
      to: "/dashboard/coming_soon",
    },
  ];
  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        User Section
      </ListSubheader>
      {secondaryList.map((row, i) => (
        <Link
          key={i}
          to={row.to}
          style={{ color: "inherit", textDecoration: "inherit" }}
        >
          <ListItemButton display="flex">
            <Tooltip title={row.label}>
              <ListItemIcon>{row.icon}</ListItemIcon>
            </Tooltip>
            <ListItemText primary={row.label} />
          </ListItemButton>
        </Link>
      ))}
      <Divider />
      <ListSubheader component="div" inset>
        Apps
      </ListSubheader>
      {appList.map((row, i) => (
        <Link
          key={i}
          to={row.to}
          style={{ color: "inherit", textDecoration: "inherit" }}
        >
          <ListItemButton display="flex">
            <Tooltip title={row.label}>
              <ListItemIcon>{row.icon}</ListItemIcon>
            </Tooltip>
            <ListItemText primary={row.label} />
          </ListItemButton>
        </Link>
      ))}
    </React.Fragment>
  );
};

export const DrawerNHeader = () => {
  const [open, setOpen] = useState(true);

  const navigate = useNavigate();
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        clearLocalStorage();
        navigate("/");
      })
      .catch((error) => {
        toast.error(error, {
          theme: "dark",
          position: "top-center",
        });
      });
  };
  return (
    <Box sx={styles.containerStyle}>
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Dashboard
          </Typography>
          <ToggleTheme />
          <NotificationPanel />
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar sx={styles.toolbar}>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <MainListItems />
          <Divider sx={{ my: 1 }} />
          <SecondaryListItems />
        </List>
      </Drawer>
    </Box>
  );
};
