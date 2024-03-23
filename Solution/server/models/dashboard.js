import mongoose from "mongoose";

const dashboardSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  socket: { type: String, required: true },
  owner: { type: String, required: true },
});

var Dashboard = mongoose.model("Dashboards", dashboardSchema);

export default Dashboard;
