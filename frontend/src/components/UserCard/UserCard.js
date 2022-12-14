import {
  Avatar,
  Box,
  CardContent,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import Card from "@mui/material/Card";
import { purple } from "@mui/material/colors";
import Title from "components/Title/Title";
import { BASE_URL, EMPLOYEES } from "Constants/apiURLs";
import { useCallback, useEffect, useState } from "react";
import { getLocalStorage, setLocalStorage } from "util/Storage/Storage";

function UserCard() {
  const data = JSON.parse(getLocalStorage("user"));
  const id = data.id;
  const [user, setUser] = useState({});
  const [ed, setEd] = useState({});

  const getEmployeeData = useCallback(() => {
    fetch(`${BASE_URL}${EMPLOYEES}${id}/`)
      .then((res) => res.json())
      .then((result) => {
        if (data.email === "mobile")
          setLocalStorage(
            "user",
            JSON.stringify({
              id: data.id,
              email: result.email,
              token: data.token,
            })
          );
        const userData = {
          Name: `${result.first_name} ${result.last_name}`,
          Designation: result.designation,
          Mobile: result.mobile,
          Email: result.email,
          Gender: result.gender,
          Address: `${result.address},${result.city},${result.state},${result.country}`,
          DOJ: result.date_of_joining,
          DOB: result.dob,
        };
        setUser(userData);
        const edu = {
          education_12th_percentage: result.education_12th_percentage,
          education_10th_percentage: result.education_10th_percentage,
          education_grad_percentage: result.education_grad_percentage,
        };
        setEd(edu);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, data.id, data.email, data.token]);
  function stringAvatar(name) {
    return {
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }
  useEffect(() => {
    getEmployeeData();
  }, [getEmployeeData]);

  return user.Name ? (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="start">
          {user.Name && (
            <Avatar
              {...stringAvatar(user?.Name)}
              sx={{ width: 60, height: 60, bgcolor: purple[300], mr: "10px" }}
            />
          )}
          <Title>User Profile</Title>
        </Box>
        <Stack direction="column" p={3}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="body1" color="text.primary">
              Name:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.Name}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="body1" color="text.primary">
              Designation:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.Designation}
            </Typography>
          </Stack>
        </Stack>

        <Divider />
        <Stack direction="column" p={3}>
          <Typography variant="h6" color="primary">
            Contact Information:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="body1" color="text.primary">
              Mobile:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.Mobile}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="body1" color="text.primary">
              Email:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.Email}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack direction="column" p={3}>
          <Typography variant="h6" color="primary">
            Personal Details:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="body1" color="text.primary">
              Gender:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.Gender}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="body1" color="text.primary">
              Address:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.Address}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="body1" color="text.primary">
              Date of Birth:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.DOB}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="body1" color="text.primary">
              Date of Joining:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.DOJ}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack direction="column" p={3}>
          <Typography variant="h6" color="primary">
            Education:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="body1" color="text.primary">
              10th Percentage:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`${ed.education_10th_percentage}%`}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="body1" color="text.primary">
              12th Percentage:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`${ed.education_12th_percentage}%`}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="body1" color="text.primary">
              Graduation Percentage:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`${ed.education_grad_percentage}%`}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  ) : (
    <h1>No Data To Display!</h1>
  );
}

export default UserCard;
