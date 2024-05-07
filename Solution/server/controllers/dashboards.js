import express from "express";
import validator from "validator";
import Yup from "yup";
import Dashboard from "../models/dashboard.js";
import mongoose from "mongoose";

const router = express.Router();

const createEditDashboardValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must contain at least 3 characters")
    .required("Name required"),
  address: Yup.string()
    .test("is-url", "Not a valid URL", (value) =>
      validator.isURL(value, { require_tld: false })
    )
    .required("Address URL required"),
  socket: Yup.string()
    .test("is-socket", "Not a valid URL", (value) =>
      /^(wss?:\/\/)([0-9]{1,3}(?:\.[0-9]{1,3}){3}|[a-zA-Z]+):([0-9]{1,5})$/.test(
        value
      )
    )
    .required("Socket address required"),
});

export const getDashboards = async (req, res) => {
  try {
    const userId = req.userId;
    const data = await Dashboard.find(
      { owner: userId },
      { _id: 1, name: 1, address: 1, socket: 1 }
    );

    return res.status(200).json({ result: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    const dashboardId = new mongoose.Types.ObjectId(req.params.id);

    const data = await Dashboard.findOne(
      { owner: userId, _id: dashboardId },
      { _id: 1, name: 1, address: 1, socket: 1 }
    );

    return res.status(200).json({ result: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const createDashboard = async (req, res) => {
  try {
    const { name, address, socket } = req.body;
    const userId = req.userId;

    createEditDashboardValidationSchema
      .validate({ name, address, socket })
      .then(async (validationData) => {
        if (
          await Dashboard.countDocuments({
            owner: userId,
            name: validationData.name,
          })
        )
          return res.status(404).send({
            error: `Dashboard with name "${validationData.name}" already exists`,
          });

        const data = await Dashboard.create({
          name: validationData.name,
          address: validationData.address,
          socket: validationData.socket,
          owner: userId,
        });

        return res.status(201).json({
          result: {
            _id: data._id,
            name: data.name,
            address: data.address,
            socket: data.socket,
          },
          message: "Dashboard created successfully",
        });
      })
      .catch((errors) => res.status(400).json({ error: errors.message }));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const editDashboard = async (req, res) => {
  try {
    const { _id, name, address, socket } = req.body;
    const userId = req.userId;

    createEditDashboardValidationSchema
      .validate({ name, address, socket })
      .then(async (validationData) => {
        const existingDashboard = await Dashboard.findOne({
          _id,
          owner: userId,
        });

        if (!existingDashboard)
          return res.status(404).send({ error: `Dashboard not found` });

        const sameDashboard = await Dashboard.findOne({
          owner: userId,
          name: validationData.name,
        });

        if (sameDashboard && !sameDashboard._id.equals(existingDashboard._id))
          return res.status(404).send({
            error: `Dashboard with name "${validationData.name}" already exists`,
          });

        existingDashboard.name = validationData.name;
        existingDashboard.address = validationData.address;
        existingDashboard.socket = validationData.socket;

        await Dashboard.findByIdAndUpdate(_id, {
          name: existingDashboard.name,
          address: existingDashboard.address,
          socket: existingDashboard.socket,
        });

        return res.status(201).json({
          result: {
            _id: existingDashboard._id,
            name: existingDashboard.name,
            address: existingDashboard.address,
            socket: existingDashboard.socket,
          },
          message: "Dashboard updated successfully",
        });
      })
      .catch((errors) => res.status(400).json({ error: errors.message }));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteDashboard = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Dashboard.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: `Dashboard ${data.name} deleted successfully` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default router;
