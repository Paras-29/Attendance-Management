import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  QrCode,
  Clock,
  MapPin,
  Search,
  UserCheck,
  Loader2,
  RefreshCcw,
  CheckCircle,
  XCircle
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendance = async () => {

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; 

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/attendance/today`);
      const data = await res.json();
      setEmployees(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      setError("Failed to load attendance data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const filtered = employees.filter((emp) => {
    const locationStr = `${emp.location.latitude}, ${emp.location.longitude}`;
    return (
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      locationStr.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="ml-64 p-10 bg-gradient-to-br from-blue-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-800 mb-2 tracking-tight drop-shadow-sm">
            Attendance Dashboard
          </h1>
            <p className="text-gray-500 mt-1 text-lg">
              Overview of today's attendance and quick actions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAttendance}
              className="p-2 rounded-full bg-white hover:bg-blue-100 transition shadow border border-blue-100"
              title="Refresh Attendance"
            >
              <RefreshCcw size={20} className="text-blue-600" />
            </button>
            <div className="bg-blue-100 text-blue-800 px-5 py-2 rounded-full flex items-center font-semibold shadow-sm">
              <Clock size={20} className="mr-2" />
              <span>
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* QR Code Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="p-8 flex flex-col items-center">
                <div className="flex items-center mb-4">
                  <QrCode className="text-blue-600 mr-2" size={28} />
                  <h2 className="text-2xl font-bold text-gray-800">Mark Attendance</h2>
                </div>
                <p className="text-gray-600 mb-6 text-center">
                  Scan this QR code to instantly mark your attendance for today
                </p>
                <div className="flex justify-center">
                  <Link to="/mark-attendance" className="group">
                    <div className="p-2 border-2 border-blue-500 rounded-xl relative overflow-hidden bg-white cursor-pointer hover:scale-105 transition-transform shadow-md">
                      <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      <QRCodeCanvas
                        value="https://attendance-management-kappa.vercel.app/mark-attendance"
                        size={192}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        includeMargin={true}
                      />
                    </div>
                    <div className="mt-4 bg-blue-600 text-white py-2 rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors shadow">
                      Scan Now
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Employee List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center">
                    <UserCheck className="text-green-600 mr-2" size={24} />
                    <h2 className="text-2xl font-bold text-gray-800">
                      Present Employees
                    </h2>
                  </div>
                  <div className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-lg font-semibold shadow-sm">
                    {filtered.length} Present
                  </div>
                </div>

                <div className="relative mb-8">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={20} className="text-gray-400" />
                  </div>
                  <input
                    aria-label="Search employees by name or location"
                    type="text"
                    placeholder="Search by name or location"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-16">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                  </div>
                ) : error ? (
                  <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center text-lg font-semibold shadow">
                    {error}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="bg-gray-50 text-gray-500 p-12 rounded-xl text-center text-lg font-semibold shadow">
                    No employees found matching your search.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider rounded-tl-xl">
                            Employee
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                            Time
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-blue-700 uppercase tracking-wider rounded-tr-xl">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filtered.map((emp, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/60 transition">
                            <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shadow">
                                {emp.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="font-semibold text-gray-900 text-lg">
                                {emp.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-gray-600">
                                <MapPin size={18} className="mr-1 text-gray-400" />
                                <span className="text-base">{emp.location.placeName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-base">
                              {new Date(emp.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm shadow">
                                <CheckCircle size={16} className="mr-1" /> Present
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
