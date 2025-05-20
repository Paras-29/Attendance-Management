const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    latitude: Number,
    longitude: Number,
    placeName: String, // Add this line
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
