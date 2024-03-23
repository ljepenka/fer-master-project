import { Container, Link, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { appTheme } from "../../App";

function CircularProgressWithLabel(props) {
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: appTheme.spacing(2),
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          maxHeight: "50%",
          width: "100%",
          gap: appTheme.spacing(2),
          padding: appTheme.spacing(2),
        }}
      >
        <Typography variant="p" sx={{ fontWeight: "bold" }}>
          {props.message}
        </Typography>
        <Box sx={{ position: "relative", display: "flex" }}>
          <CircularProgress variant="determinate" size={100} {...props} value={props.value * 20} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h5">{`${props.value}s`}</Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="p" display="inline">
            {"Redirecting to "}
            {props.redirectionpage && props.redirectto ? (
              <Link underline="none" onClick={() => navigate(props.redirectto)}>
                <Typography display="inline" sx={{ textDecoration: "none" }}>{`${props.redirectionpage}`}</Typography>
              </Link>
            ) : (
              <Link underline="none" onClick={() => navigate("/")}>
                <Typography display="inline" sx={{ textDecoration: "none" }}>
                  Home
                </Typography>
              </Link>
            )}
            {" in"}
            <Typography variant="span" sx={{ fontWeight: "bold" }} color="primary">
              {` ${props.value}s.`}
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
  message: PropTypes.string,
  redirectionpage: PropTypes.string,
  redirectto: PropTypes.string,
};

const Unauthorized = ({ message, redirectTo, redirectionPage }) => {
  const [progress, setProgress] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 0 ? prev - 1 : -1));
      if (progress <= 0) navigate(redirectTo ?? "/");
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [navigate, progress, redirectTo]);

  return (
    <CircularProgressWithLabel
      value={progress}
      message={location.state?.message ?? message ?? "404 page not found"}
      redirectionpage={redirectionPage}
      redirectto={redirectTo}
    />
  );
};

export default Unauthorized;
