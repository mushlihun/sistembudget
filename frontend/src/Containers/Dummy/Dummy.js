import { Button, Grid, Paper } from "@mui/material";
import Deposits from "components/Deposits/Deposits";
import DialogComponent from "components/DialogComponent/DialogComponent";
import NewBill from "components/NewBill/NewBill";
import Orders from "components/Orders/Orders";
import { useState } from "react";
import styles from "../../components/DrawerNHeader/DrawerNHeader.style";

function Dummy(props) {
  const [openNewBill, setOpenNewBill] = useState(false);

  return (
    <>
      <Grid container spacing={3}>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={styles.paper}>
            <Deposits />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        {!props.heading && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Orders />
              <Button variant="contained" onClick={() => setOpenNewBill(true)}>
                Submit New Bill
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
      <DialogComponent
        title="New Bill"
        open={openNewBill}
        handleClose={() => {
          setOpenNewBill(false);
        }}
      >
        <NewBill />
      </DialogComponent>
    </>
  );
}

export default Dummy;
