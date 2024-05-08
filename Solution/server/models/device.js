import mongoose from "mongoose";

const deviceSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  socket: { type: String, required: true },
  dashboard: { type: String, required: true },
  params: { type: String, required: true }, // serialized JSON properties
  owner: { type: String, required: true },
});

var Devices = mongoose.model("Devices", deviceSchema);

export default Devices;
