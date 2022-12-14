import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import {
  BASE_URL,
  DELETE_NOTIFICATION,
  NOTIFICATIONS,
} from "Constants/apiURLs";
import React, { useCallback, useEffect, useState } from "react";
import { getLocalStorage } from "util/Storage/Storage";

function NotificationPanel() {
  const data = JSON.parse(getLocalStorage("user"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const convertAngularBracket = (s) => {
    let item = s.split("<").slice(1);
    let arr = [];
    for (let p of item) {
      arr.push(p.split(":")[1].split(">")[0]);
    }
    return arr;
  };
  const fetchNotifications = useCallback(() => {
    axios
      .get(`${BASE_URL}${NOTIFICATIONS}${data.id}`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      })
      .then((res) => {
        const new_data = res.data;
        new_data.forEach((row) => {
          row.notification_by = convertAngularBracket(row.notification_by);
        });
        setNotifications(new_data);
      });
  }, [data.id, data.token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  function stringAvatar(name) {
    return {
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const deleteNotification = (nid) => {
    const new_list = [];
    notifications.forEach((row) => {
      if (row.id !== nid) new_list.push(row);
    });
    setNotifications(new_list);
    axios.delete(`${BASE_URL}${DELETE_NOTIFICATION}${nid}`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });
  };

  // const markAllRead = () => {};
  return (
    <div>
      <Tooltip title="Notifications">
        <IconButton color="inherit" onClick={handleClick}>
          <Badge badgeContent={notifications.length} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h5"
            color="#90CAF9"
            component="div"
            sx={{ padding: "1px 20px" }}
          >
            Notifications
          </Typography>
          <Divider />
          {notifications.map((row, i) => (
            <Box key={i}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar {...stringAvatar(row.notification_by[2])} />
                </ListItemAvatar>
                <ListItemText
                  primary={row.notification_by[2]}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {row.notification_text}
                      </Typography>
                      <Button
                        fullWidth
                        variant="text"
                        size="small"
                        sx={{ justifyContent: "right" }}
                        onClick={() => {
                          deleteNotification(row.id);
                        }}
                      >
                        Mark as read
                      </Button>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </Box>
          ))}
        </List>
        {/* <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={markAllRead}
        >
          Mark All as read
        </Button> */}
      </Popover>
    </div>
  );
}

export default NotificationPanel;
