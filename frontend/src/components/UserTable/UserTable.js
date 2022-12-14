import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import Title from "components/Title/Title";
import UserCard from "components/UserCard/UserCard";
import { BASE_URL, GET_USERS } from "Constants/apiURLs";
import { useCallback, useEffect, useState } from "react";

function UserTable() {
  const [userData, setUserData] = useState([]);
  const [empData, setEmpData] = useState([]);
  const [open, setOpen] = useState(false);
  const table_header = [
    "Name",
    "Designation",
    "Email",
    "Mobile",
    "More Information",
  ];

  const fetch_user_data = useCallback(() => {
    axios.get(`${BASE_URL}${GET_USERS}`).then((res) => {
      setUserData(res.data);
    });
  }, []);

  useEffect(() => {
    fetch_user_data();
  }, [fetch_user_data]);

  const showPersonalInfo = (row) => {
    setEmpData(row);
    setOpen(true);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
  }));
  return (
    <Paper
      sx={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Title>Employee List</Title>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {table_header.map((row, i) => (
              <StyledTableCell key={i} align="center">
                {row}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {userData.map((row, i) => (
            <TableRow
              key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center">{`${row.first_name} ${row.last_name}`}</TableCell>
              <TableCell align="center">{row.designation}</TableCell>
              <TableCell align="center">{row.email}</TableCell>
              <TableCell align="center">{row.mobile}</TableCell>
              <TableCell align="center">
                <Button onClick={() => showPersonalInfo(row)}>View More</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        fullWidth
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <UserCard data={empData} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default UserTable;
