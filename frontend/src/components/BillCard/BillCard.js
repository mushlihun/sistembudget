import { Divider, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import Pdf from "components/Pdf/Pdf";
import Title from "components/Title/Title";
import styles from "./BillCard.style";

function BillCard(props) {
  const bill = {
    "Bill ID": props.data.id,
    "Project Name": `${props.data.project_name}`,
    Amount: props.data.amount,
    "Date of Issue": props.data.date_of_issue,
    Status: props.data.bill_status ? "Approved" : "Pending",
    Comments: props.data.comments,
    // Document: props.data.bill_document,
  };
  const issue = props.data.issued_by;
  const approve = {
    approver: props.data.approved_by,
    date: props.data.approved_on,
  };
  return (
    <Card>
      <CardContent>
        {/* <Box component="div" sx={styles.pdfBox}>
          <Pdf doc={bill.Document} />
        </Box> */}
        {/* <Title>{bill["Bill ID"]}</Title> */}
        <Box p={1}>
          {Object.entries(bill).map((row, i) => (
            <Stack
              direction="row"
              spacing={1}
              key={i.toString()}
              sx={{ alignItems: "center" }}
            >
              <Typography variant="body1" color="text.primary">
                {`${row[0]}:`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`${row[1]}`}
              </Typography>
            </Stack>
          ))}
        </Box>
        <Divider />
        <Stack direction="row" p={1} spacing={1} sx={{ alignItems: "center" }}>
          <Typography variant="body1" color="text.primary">
            Issuer:
          </Typography>
          <Stack direction="column">
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Name:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {issue[2]}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Email:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {issue[1]}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Divider />
        <Stack direction="row" spacing={1} p={1} sx={{ alignItems: "center" }}>
          <Typography variant="body1" color="text.primary">
            Approver:
          </Typography>
          <Stack direction="column">
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Name:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {approve.approver[2]}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Email:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {approve.approver[1]}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Approved On:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {approve.date}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default BillCard;
