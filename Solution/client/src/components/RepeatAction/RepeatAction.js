import { Replay } from "@mui/icons-material";
import { Avatar, Box, IconButton } from "@mui/material";

const RepeatAction = ({ onClick, color, boxSx }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        ...boxSx,
      }}
    >
      <IconButton color="inherit" onClick={onClick}>
        <Avatar sx={{ backgroundColor: color ?? "secondary.main" }}>
          <Replay />
        </Avatar>
      </IconButton>
    </Box>
  );
};

export default RepeatAction;
