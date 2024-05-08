import { LoadingButton } from "@mui/lab";
import { Button, DialogActions, DialogContent, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import * as Yup from "yup";

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
  params: Yup.string()
    .required("Required")
    .test("is-json", "Can't convert to JSON object", (value) => {
      try {
        const parsedValue = JSON.parse(value);
        if (parsedValue) return true;
      } catch (error) {
        return false;
      }
    }),
});

const initialDeviceData = {
  name: "",
  address: "",
  socket: "",
  params: "",
};

const AddEditDeviceModal = ({ dialogClose, data }) => {
  const navigate = useNavigate();
  // device store
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: data ?? initialDeviceData,
    validationSchema: validationSchema,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setLoading(() => true);
      if (data) {
        // edit device
      } else {
        // create device
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
            label="Device Name"
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            multiline
            minRows={3}
            maxRows={8}
            fullWidth
            id="params"
            name="params"
            label="Device params"
            value={formik.values.params}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.params && Boolean(formik.errors.params)}
            helperText={formik.touched.params && formik.errors.params}
          />
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={() => {
              try {
                formik.setFieldValue(
                  "params",
                  JSON.stringify(JSON.parse(formik.values.params), null, 4)
                );
              } catch (error) {}
            }}
          >
            Format
          </Button>
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

export default AddEditDeviceModal;
