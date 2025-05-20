import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employee";
import MarkAttendance from "./pages/MarkAttendance";

const App = () => (
  <Router>
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-grow p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/mark-attendance" element={<MarkAttendance/>} />
        </Routes>
      </div>
    </div>
  </Router>
);

export default App;