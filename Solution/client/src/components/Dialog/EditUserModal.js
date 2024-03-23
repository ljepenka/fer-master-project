import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { DialogActions, DialogContent, IconButton, InputAdornment, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import useUserStore from "../../zustand/userStore";

const initialUserData = {
  password: "",
  repeatPassword: "",
};

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
      "Must contain at least one letter, one number and one special character"
    )
    .required("Required"),
  repeatPassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const EditUserModal = ({ dialogClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const userStore = useUserStore();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: initialUserData,
    validationSchema: validationSchema,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setLoading(() => true);
      await userStore
        .editAccount(values)
        .then(() => {
          userStore.logoutUser();
          dialogClose();
          navigate("/login");
        })
        .catch(() => {});
      setLoading(() => false);
    },
  });

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            autoFocus
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="repeatPassword"
            label="Repeat password"
            type={showPassword ? "text" : "password"}
            id="repeatPassword"
            value={formik.values.repeatPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.repeatPassword && Boolean(formik.errors.repeatPassword)}
            helperText={formik.touched.repeatPassword && formik.errors.repeatPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <LoadingButton loading={loading} onClick={dialogClose} fullWidth variant="outlined" color="primary">
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

export default EditUserModal;
