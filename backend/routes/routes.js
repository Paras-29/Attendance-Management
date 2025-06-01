// routes/routes.js
const express = require('express');
const router = express.Router();

// Import controllers
const { getAllEmployees, createEmployee, deleteEmployee } = require("../controllers/employeeController"); 
const { markAttendance, getTodayAttendance } = require("../controllers/attendanceController");
const { getAttendanceReport, dailyReport, weeklyReport, monthlyReport } = require("../controllers/reportController");
const { geocode } = require("../controllers/geocodeController");

// Employee routes
router.get("/employees", getAllEmployees);
router.post("/employees", createEmployee);
router.delete("/employees/:id", deleteEmployee);

// Attendance routes
router.post("/attendance/mark", markAttendance);
router.get("/attendance/today", getTodayAttendance);

// Report routes
router.get("/overall/:type", getAttendanceReport);
router.get("/daily/:id", dailyReport);
router.get("/weekly/:id", weeklyReport);
router.get("/monthly/:id", monthlyReport);

// Geocoding route
router.get("/geocode", geocode);

module.exports = router;