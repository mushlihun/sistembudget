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
import BillCard from "components/BillCard/BillCard";
import DialogComponent from "components/DialogComponent/DialogComponent";
import NewBill from "components/NewBill/NewBill";
import Title from "components/Title/Title";
import {
  APPROVE_BILL,
  BASE_URL,
  BILLS,
  BILLS_TO_BE_APPROVED,
  NOTIFICATIONS,
} from "Constants/apiURLs";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getLocalStorage } from "util/Storage/Storage";

function BillTable(props) {
  const [openNewBill, setOpenNewBill] = useState(false);
  const data = JSON.parse(getLocalStorage("user"));
  const token = data.token;
  const id = data.id;
  const email = data.email;
  const [billData, setBillData] = useState([]);
  const [bdata, setBData] = useState([]);
  const [open, setOpen] = useState(false);
  const table_header = [
    "Project Name",
    "Amount",
    "Issued By",
    "Status",
    "More Information",
  ];
  const convertAngularBracket = (s) => {
    if (typeof s === "number") return s;
    let item = s.split("<").slice(1);
    let arr = [];
    for (let p of item) {
      arr.push(p.split(":")[1].split(">")[0]);
    }
    return arr;
  };
  const fetch_bill_data = useCallback(() => {
    axios
      .get(`${BASE_URL}${props.emp ? BILLS : BILLS_TO_BE_APPROVED}${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let new_data = res.data;
        let my_data = [];
        new_data.forEach((row) => {
          row.issued_by = convertAngularBracket(row.issued_by);
          row.approved_by = convertAngularBracket(row.approved_by);
          // if (props.emp && row.issued_by[2] === email) my_data.push(row);
          // else if (row.approved_by[2] === email) my_data.push(row);
          my_data.push(row);
        });
        setBillData(my_data);
      });
  }, [id, token, props.emp]);

  const approveBill = (bill_id, client) => {
    axios
      .post(`${BASE_URL}${APPROVE_BILL}${bill_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        let new_data = billData;
        new_data.forEach((row) => {
          if (row.id === bill_id) row.bill_status = true;
        });
        setBillData(new_data);
        const notification_push = {
          notification_text: `Bill Approved by ${email}`,
          notification_by: id,
          notification_for: client,
        };
        axios.post(`${BASE_URL}${NOTIFICATIONS}${client}`, notification_push, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Bill approved successfully!", {
          theme: "dark",
          position: "top-center",
        });
      });
  };
  const handleClose = () => {
    setOpenNewBill(false);
  };
  useEffect(() => {
    fetch_bill_data();
  }, [fetch_bill_data, billData]);

  const showBillInfo = (row) => {
    setBData(row);
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
      <Title>{props.emp ? "My Bills" : "Bills"}</Title>
      {billData.length >= 1 ? (
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {table_header.map((row, i) => (
                <StyledTableCell key={i.toString()} align="center">
                  {row}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {billData.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{row.project_name}</TableCell>
                <TableCell align="center">&#8377;{row.amount}</TableCell>
                <TableCell align="center">{row.issued_by[2]}</TableCell>
                <TableCell align="center">
                  {row.bill_status ? "Approved" : "Pending"}
                </TableCell>
                <TableCell align="center">
                  <Button onClick={() => showBillInfo(row)}>View More</Button>
                  {!props.emp && (
                    <Button
                      onClick={() => approveBill(row.id, row.issued_by[0])}
                      disabled={row.bill_status}
                    >
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <h1>No data to display!</h1>
      )}
      {props.emp && (
        <Button
          variant="contained"
          onClick={() => setOpenNewBill(true)}
          sx={{ marginTop: "5vh" }}
        >
          Submit New Bill
        </Button>
      )}
      <Dialog
        fullWidth
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <BillCard data={bdata} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Ok</Button>
        </DialogActions>
      </Dialog>
      <DialogComponent
        title="New Bill"
        open={openNewBill}
        handleClose={() => {
          setOpenNewBill(false);
        }}
      >
        <NewBill handleClose={handleClose} />
      </DialogComponent>
    </Paper>
  );
}

export default BillTable;
