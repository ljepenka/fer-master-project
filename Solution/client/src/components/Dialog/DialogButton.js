import { Close } from "@mui/icons-material";
import { Box, Button, Dialog, DialogTitle, IconButton, Typography, useMediaQuery } from "@mui/material";
import { cloneElement, useState } from "react";
import { appTheme } from "../../App";

const DialogButton = ({ title, buttonSx, titleSx, fullWidth, children, iconButton }) => {
  const [open, setOpen] = useState(false);
  const fullScreen = useMediaQuery(appTheme.breakpoints.down("sm"));

  const dialogOpen = () => {
    setOpen(true);
  };

  const dialogClose = () => {
    setOpen(false);
  };

  return (
    <>
      {iconButton ? <IconButton {...buttonSx} onClick={dialogOpen} /> : <Button {...buttonSx} onClick={dialogOpen} />}
      <Dialog fullWidth={fullWidth} open={open} fullScreen={fullScreen}>
        <DialogTitle>
          <Box sx={{ display: "flex", flexWrap: "nowrap", justifyContent: "space-between", gap: appTheme.spacing(1) }}>
            <Typography variant="h5" fontWeight="normal" {...titleSx}>
              {title ?? "Confirm action"}
            </Typography>
            <IconButton
              onClick={dialogClose}
              sx={{
                width: appTheme.spacing(4),
                height: appTheme.spacing(4),
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        {cloneElement(children, { dialogClose })}
      </Dialog>
    </>
  );
};

export default DialogButton;
