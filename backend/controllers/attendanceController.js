// controllers/attendanceController.js
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// Mark Attendance
const markAttendance = async (req, res) => {
  const { email, latitude, longitude, timestamp, placeName } = req.body;

  if (!email || !latitude || !longitude || !timestamp || !placeName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: "User not registered" });
    }

    const attendance = new Attendance({
      name: employee.name,
      employeeId: employee._id,
      location: { latitude, longitude, placeName },
      timestamp,
    });

    await attendance.save();
    res.status(200).json({ message: "Attendance marked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving attendance" });
  }
};

// Get Today's Attendance
const getTodayAttendance = async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  try {
    const records = await Attendance.find({
      timestamp: { $gte: start, $lte: end },
    }).sort({ timestamp: 1 });

    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching records" });
  }
};

module.exports = { markAttendance, getTodayAttendance };