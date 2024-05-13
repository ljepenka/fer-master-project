import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import Yup from "yup";
import User from "../models/user.js";

const router = express.Router();
dotenv.config();

const registerValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
      "Must contain at least one letter, one number and one special character"
    )
    .required("Password required"),
  repeatPassword: Yup.string()
    .required("Repeated password required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).send({ error: `No user with email: ${email}` });

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION || 86400000,
      }
    );

    return res
      .status(200)
      .json({
        result: { email: user.email, token },
        message: "You successfully logged in",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, repeatPassword } = req.body;

    registerValidationSchema
      .validate({ email, password, repeatPassword })
      .then(async (validationData) => {
        if (await User.countDocuments({ email: validationData.email }))
          return res
            .status(400)
            .json({ error: `Email ${validationData.email} is already taken` });

        const hashedPassword = await bcrypt.hash(validationData.password, 12);
        const data = await User.create({
          email: validationData.email,
          password: hashedPassword,
        });
        const token = jwt.sign(
          { email: data.email, id: data._id },
          process.env.JWT_SECRET || "",
          {
            expiresIn: process.env.JWT_EXPIRATION || 86400000,
          }
        );

        return res
          .status(201)
          .json({
            result: { _id: data._id, username: data.username },
            token,
            message: "You successfully signed up",
          });
      })
      .catch((errors) => res.status(400).json({ error: errors.message }));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default router;
