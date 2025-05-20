const express = require('express');
const router = express.Router();


const {getAllEmployees, createEmployee, deleteEmployee,} = require("../controllers/employeeController"); 

router.get("/employees", getAllEmployees);
router.post("/employees", createEmployee);
router.delete("/employees/:id", deleteEmployee);



const {markAttendance, getTodayAttendance,} = require("../controllers/attendanceController");

router.post("/attendance/mark", markAttendance);
router.get("/attendance/today", getTodayAttendance);

module.exports = router