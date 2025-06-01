// controllers/reportController.js
const Attendance = require("../models/Attendance");
const moment = require("moment");

// Helper: Get start & end dates
const getDateRange = (type) => {
  const now = new Date();
  let start, end = new Date();

  switch (type) {
    case "daily":
      start = new Date(now.setHours(0, 0, 0, 0));
      end.setHours(23, 59, 59, 999);
      break;
    case "weekly":
      const firstDay = now.getDate() - now.getDay();
      start = new Date(now.setDate(firstDay));
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case "monthly":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    default:
      throw new Error("Invalid report type");
  }

  return { start, end };
};

// Helper: Format time range for display
const formatTimeRange = (records) => {
  if (!records || records.length === 0) return { firstCheckIn: null, lastCheckOut: null };
  
  const timestamps = records.map(r => new Date(r.timestamp));
  const firstCheckIn = new Date(Math.min(...timestamps));
  const lastCheckOut = new Date(Math.max(...timestamps));
  
  return {
    firstCheckIn: firstCheckIn.toLocaleString(),
    lastCheckOut: lastCheckOut.toLocaleString()
  };
};

// Helper: Calculate attendance statistics
const calculateStats = (records) => {
  if (!records || records.length === 0) return { totalDays: 0, averageCheckIn: null };
  
  const uniqueDays = new Set(records.map(r => new Date(r.timestamp).toDateString())).size;
  const checkInTimes = records.map(r => new Date(r.timestamp).getHours() + new Date(r.timestamp).getMinutes() / 60);
  const avgCheckIn = checkInTimes.reduce((a, b) => a + b, 0) / checkInTimes.length;
  
  return {
    totalDays: uniqueDays,
    averageCheckIn: avgCheckIn.toFixed(2) + ' hours'
  };
};

// General report (grouped by employee name)
const getAttendanceReport = async (req, res) => {
  const { type } = req.params; // daily, weekly, monthly

  if (!["daily", "weekly", "monthly"].includes(type)) {
    return res.status(400).json({ message: "Invalid report type" });
  }

  try {
    const { start, end } = getDateRange(type);

    const records = await Attendance.aggregate([
      {
        $match: {
          timestamp: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$name",
          count: { $sum: 1 },
          timestamps: { $push: "$timestamp" },
          locations: { $push: "$location" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating report" });
  }
};

const getWeekDays = () => {
  // Returns array of day names for the current week (Monday to Sunday)
  const days = [];
  const start = moment().startOf('week');
  for (let i = 0; i < 7; i++) {
    days.push(start.clone().add(i, 'days').format('dddd'));
  }
  return days;
};

const getMonthWeeks = () => {
  // Returns array of week labels for the current month (Week 1, Week 2, ...)
  const start = moment().startOf('month');
  const end = moment().endOf('month');
  const weeks = [];
  let weekNum = 1;
  let current = start.clone().startOf('week');
  while (current.isBefore(end)) {
    weeks.push(`Week ${weekNum}`);
    current.add(1, 'week');
    weekNum++;
  }
  return weeks;
};

const getYearMonths = () => {
  // Returns array of month names for the current year
  return moment.months();
};

// Daily report for an individual employee (show all days of current week)
const dailyReport = async (req, res) => {
  try {
    const { id } = req.params;
    const weekStart = moment().startOf('week');
    const weekEnd = moment().endOf('week');
    const records = await Attendance.find({
      employeeId: id,
      timestamp: { $gte: weekStart.toDate(), $lte: weekEnd.toDate() },
    }).sort({ timestamp: 1 });

    // Group by day name
    const grouped = {};
    records.forEach(record => {
      const day = moment(record.timestamp).format('dddd');
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(record);
    });

    // Fill in all days of the week
    const weekDays = getWeekDays();
    const result = weekDays.map(day => ({
      day,
      records: grouped[day] || [],
      present: (grouped[day] && grouped[day].length > 0)
    }));

    res.json({
      days: result,
      summary: {
        totalDaysPresent: result.filter(d => d.present).length,
        totalDays: 7
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching daily report", error });
  }
};

// Weekly report for an individual employee (show all weeks of current month)
const weeklyReport = async (req, res) => {
  try {
    const { id } = req.params;
    const monthStart = moment().startOf('month');
    const monthEnd = moment().endOf('month');
    const records = await Attendance.find({
      employeeId: id,
      timestamp: { $gte: monthStart.toDate(), $lte: monthEnd.toDate() },
    }).sort({ timestamp: 1 });

    // Group by week number in month
    const grouped = {};
    records.forEach(record => {
      const weekOfMonth = Math.ceil(moment(record.timestamp).date() / 7);
      const weekLabel = `Week ${weekOfMonth}`;
      if (!grouped[weekLabel]) grouped[weekLabel] = [];
      grouped[weekLabel].push(record);
    });

    // Fill in all weeks of the month
    const monthWeeks = getMonthWeeks();
    const result = monthWeeks.map(week => ({
      week,
      records: grouped[week] || [],
      daysPresent: new Set((grouped[week] || []).map(r => moment(r.timestamp).format('YYYY-MM-DD'))).size
    }));

    res.json({
      weeks: result,
      summary: {
        totalWeeks: monthWeeks.length,
        totalDaysPresent: result.reduce((acc, w) => acc + w.daysPresent, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching weekly report", error });
  }
};

// Monthly report for an individual employee (show all months of current year)
const monthlyReport = async (req, res) => {
  try {
    const { id } = req.params;
    const yearStart = moment().startOf('year');
    const yearEnd = moment().endOf('year');
    const records = await Attendance.find({
      employeeId: id,
      timestamp: { $gte: yearStart.toDate(), $lte: yearEnd.toDate() },
    }).sort({ timestamp: 1 });

    // Group by month name
    const grouped = {};
    records.forEach(record => {
      const month = moment(record.timestamp).format('MMMM');
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(record);
    });

    // Fill in all months of the year
    const months = getYearMonths();
    const result = months.map(month => ({
      month,
      records: grouped[month] || [],
      daysPresent: new Set((grouped[month] || []).map(r => moment(r.timestamp).format('YYYY-MM-DD'))).size
    }));

    res.json({
      months: result,
      summary: {
        totalMonths: months.length,
        totalDaysPresent: result.reduce((acc, m) => acc + m.daysPresent, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching monthly report", error });
  }
};

module.exports = {
  getAttendanceReport,
  dailyReport,
  weeklyReport,
  monthlyReport,
};
