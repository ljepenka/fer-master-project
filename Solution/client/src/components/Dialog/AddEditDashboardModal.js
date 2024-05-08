import { LoadingButton } from "@mui/lab";
import { DialogActions, DialogContent, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import validator from "validator";
import * as Yup from "yup";
import useDashboardStore from "../../zustand/dashboardStore";
import useNavbarStore from "../../zustand/navbarStore";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must contain at least 3 characters")
    .required("Required"),
  address: Yup.string()
    .test("is-url", "Not a valid URL", (value) =>
      validator.isURL(value, { require_tld: false })
    )
    .required("Required"),
  socket: Yup.string()
    .test("is-socket", "Not a valid URL", (value) =>
      /^(wss?:\/\/)([0-9]{1,3}(?:\.[0-9]{1,3}){3}|[a-zA-Z]+):([0-9]{1,5})$/.test(
        value
      )
    )
    .required("Required"),
});

const initialDashboardData = {
  name: "",
  address: "",
  socket: "",
};

const AddEditDashboardModal = ({ dialogClose, data }) => {
  const { createDashboard, editDashboard } = useDashboardStore();
  const { closeNavbar } = useNavbarStore();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: data ?? initialDashboardData,
    validationSchema: validationSchema,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setLoading(() => true);
      if (data) {
        await editDashboard(values)
          .then(() => {
            dialogClose();
            closeNavbar();
            data.refetch();
          })
          .catch(() => {});
      } else {
        await createDashboard(values)
          .then((values) => {
            dialogClose();
            closeNavbar();
            data.refetch(values.data.result._id);
          })
          .catch(() => {});
      }

      setLoading(() => false);
    },
  });

  return (
    <>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Dashboard Name"
            name="name"
            autoFocus
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="address"
            label="Address URL"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="socket"
            label="Socket URL"
            name="socket"
            value={formik.values.socket}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.socket && Boolean(formik.errors.socket)}
            helperText={formik.touched.socket && formik.errors.socket}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={loading}
          onClick={dialogClose}
          fullWidth
          variant="outlined"
          color="primary"
        >
          Cancel
        </LoadingButton>
        <LoadingButton
          loading={loading}
          onClick={() => formik.handleSubmit()}
          fullWidth
          variant="contained"
          color="primary"
        >
          Save
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default AddEditDashboardModal;
