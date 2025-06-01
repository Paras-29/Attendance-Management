import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout"; // Your Layout component that handles Sidebar visibility
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employee";
import MarkAttendance from "./pages/MarkAttendance";
import ThankYou from "./pages/ThankYou";


const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/mark-attendance" element={<MarkAttendance />} />
        <Route path="/thank-you" element={<ThankYou/>} />
      </Routes>
    </Layout>
  </Router>
);

export default App;
