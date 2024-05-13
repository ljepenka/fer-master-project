import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { appTheme } from "../../App";
import useUserStore from "../../zustand/userStore";

const initialUserData = {
  email: "",
  password: "",
  repeatPassword: "",
};

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
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

const Register = () => {
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
        .registerAccount(values)
        .then(() => navigate("/login"))
        .catch(() => {});
      setLoading(() => false);
    },
  });

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ height: "100%", padding: appTheme.spacing(4) }}
    >
      <Container sx={{ display: "flex", alignItems: "center", height: "100%" }}>
        <Container maxWidth="xs">
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: appTheme.spacing(1),
              padding: appTheme.spacing(1),
            }}
            elevation={3}
          >
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
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
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
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
                error={
                  formik.touched.repeatPassword &&
                  Boolean(formik.errors.repeatPassword)
                }
                helperText={
                  formik.touched.repeatPassword && formik.errors.repeatPassword
                }
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
              <LoadingButton
                loading={loading}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Register
              </LoadingButton>
            </form>
            <Box>
              <Typography variant="p">
                Already have an account?{" "}
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => navigate("/login")}
                >
                  Login
                </LoadingButton>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Container>
    </Container>
  );
};

export default Register;
