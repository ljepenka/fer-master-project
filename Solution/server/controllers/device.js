import express from "express";
import validator from "validator";
import Yup from "yup";
import Device from "../models/device.js";

const router = express.Router();

const createEditDeviceValidationSchema = Yup.object({
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

export const getDevices = async (req, res) => {
  try {
    const userId = req.userId;
    const dashboardId = req.params.id;

    const data = await Device.find(
      { owner: userId, dashboard: dashboardId },
      { _id: 1, name: 1, address: 1, socket: 1, dashboard: 1, params: 1 }
    );

    return res.status(200).json({ result: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const createDevice = async (req, res) => {
  try {
    const { name, address, socket, params } = req.body;
    const userId = req.userId;
    const dashboardId = req.params.id;

    createEditDeviceValidationSchema
      .validate({ name, address, socket, params })
      .then(async (validationData) => {
        if (
          await Device.countDocuments({
            owner: userId,
            dashboard: dashboardId,
            name: validationData.name,
          })
        )
          return res.status(404).send({
            error: `Device with name "${validationData.name}" already exists`,
          });

        const data = await Device.create({
          name: validationData.name,
          address: validationData.address,
          socket: validationData.socket,
          dashboard: dashboardId,
          params: validationData.params,
          owner: userId,
        });

        return res.status(201).json({
          result: {
            _id: data._id,
            name: data.name,
            address: data.address,
            socket: data.socket,
            dashboard: dashboardId,
            params: data.params,
          },
          message: "Device created successfully",
        });
      })
      .catch((errors) => res.status(400).json({ error: errors.message }));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const editDevice = async (req, res) => {
  try {
    const { _id, name, address, socket, params } = req.body;
    const userId = req.userId;
    const dashboardId = req.params.id;

    createEditDeviceValidationSchema
      .validate({ name, address, socket, params })
      .then(async (validationData) => {
        const existingDevice = await Device.findOne({
          _id,
          dashboard: dashboardId,
          owner: userId,
        });

        if (!existingDevice)
          return res.status(404).send({ error: `Device not found` });

        const sameDevice = await Device.findOne({
          owner: userId,
          dashboard: dashboardId,
          name: validationData.name,
        });

        if (sameDevice && !sameDevice._id.equals(existingDevice._id))
          return res.status(404).send({
            error: `Device with name "${validationData.name}" already exists`,
          });

        existingDevice.name = validationData.name;
        existingDevice.address = validationData.address;
        existingDevice.socket = validationData.socket;
        existingDevice.params = validationData.params;

        await Device.findByIdAndUpdate(_id, {
          name: existingDevice.name,
          address: existingDevice.address,
          socket: existingDevice.socket,
          params: existingDevice.params,
        });

        return res.status(201).json({
          result: {
            _id: existingDevice._id,
            name: existingDevice.name,
            address: existingDevice.address,
            socket: existingDevice.socket,
            params: existingDevice.params,
          },
          message: "Device updated successfully",
        });
      })
      .catch((errors) => res.status(400).json({ error: errors.message }));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Device.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: `Device ${data.name} deleted successfully` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default router;
