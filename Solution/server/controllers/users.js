import bcrypt from "bcryptjs";
import express from "express";
import Yup from "yup";
import User from "../models/user.js";
import Dashboard from "../models/dashboard.js";

const router = express.Router();

const editProfileValidationSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
      "Must contain at least one letter, one number and one special character"
    )
    .required("Password is required"),
  repeatPassword: Yup.string()
    .required("Repeated password required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export const getProfile = async (req, res) => {
  try {
    // method not needed -> email is sent with JWT
    return res.status(200).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { password, repeatPassword } = req.body;
    const userId = req.userId;

    editProfileValidationSchema
      .validate({ password, repeatPassword })
      .then(async (validationData) => {
        const hashedPassword = await bcrypt.hash(validationData.password, 12);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });
        return res
          .status(201)
          .json({ message: "Profile updated successfully" });
      })
      .catch((errors) => res.status(400).json({ error: errors.message }));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.userId;
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default router;
