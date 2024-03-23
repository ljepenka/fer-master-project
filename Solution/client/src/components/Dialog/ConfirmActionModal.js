import { LoadingButton } from "@mui/lab";
import { DialogActions, DialogContent, Typography } from "@mui/material";
import { useState } from "react";

const ConfirmActionModal = ({ dialogClose, text, action, useLoading, closeOnError }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (action) => {
    try {
      if (useLoading) {
        setLoading(() => true);
      }
      await action();
      dialogClose();
    } catch (error) {
      if (closeOnError) {
        setLoading(() => false);
        dialogClose();
      }

      if (useLoading) {
        setLoading(() => false);
        return;
      }
    }

    if (useLoading) {
      setLoading(() => false);
    }
    dialogClose();
  };

  return (
    <>
      <DialogContent dividers>{text ?? <Typography>Are you sure?</Typography>}</DialogContent>
      <DialogActions>
        <LoadingButton loading={useLoading ? loading : false} variant="contained" onClick={dialogClose}>
          NO
        </LoadingButton>
        <LoadingButton
          loading={useLoading ? loading : false}
          variant="contained"
          color="error"
          onClick={() => handleConfirm(action)}
        >
          YES
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default ConfirmActionModal;
