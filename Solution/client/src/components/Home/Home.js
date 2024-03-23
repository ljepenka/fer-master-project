import { Container, Paper } from "@mui/material";
import { appTheme } from "../../App";

const Home = () => {
  return (
    <Container sx={{ height: "100%", padding: appTheme.spacing(2) }}>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          padding: appTheme.spacing(2),
        }}
      ></Paper>
    </Container>
  );
};

export default Home;
