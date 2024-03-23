import { Box, Divider, LinearProgress } from "@mui/material";

const ProgressOrDivider = ({ progress, color }) => {
  return progress ? (
    <Box>
      <LinearProgress color={color ?? "secondary"} />
    </Box>
  ) : (
    <Divider />
  );
};

export default ProgressOrDivider;
