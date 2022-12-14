import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { ReactComponent as Svg404 } from "assets/icons/E404.svg";
import { useNavigate } from "react-router-dom";
import styles from "./Error404.style";

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <Box sx={styles.section404Block}>
      <Box sx={styles.contentBlock}>
        <Svg404 />
        <Typography paragraph sx={styles.subHeadingBlock}>
          Looks like the page you&apos;re looking for has been taken down
        </Typography>
        <Button onClick={() => navigate(-1)} variant="contained">
          Go Back
        </Button>
      </Box>
    </Box>
  );
};

export default Error404;
