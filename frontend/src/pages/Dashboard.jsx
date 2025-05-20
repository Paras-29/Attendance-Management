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
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/attendance/today");
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
    <div className="ml-56 p-3 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Attendance Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAttendance}
              className="p-2 rounded-full bg-white hover:bg-blue-100 transition"
              title="Refresh Attendance"
            >
              <RefreshCcw size={18} className="text-blue-600" />
            </button>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center">
              <Clock size={18} className="mr-2" />
              <span className="font-medium">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* QR Code Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <QrCode className="text-blue-600 mr-2" size={24} />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Mark Attendance
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Scan this QR code to instantly mark your attendance for today
                </p>
                <div className="flex justify-center">
                  <Link to="/mark-attendance" className="group">
                    <div className="p-2 border-2 border-blue-500 rounded-lg relative overflow-hidden bg-white cursor-pointer hover:scale-105 transition-transform">
                      <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      <QRCodeCanvas
                        value="http://localhost:3000/mark-attendance"
                        size={192}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        includeMargin={true}
                      />
                    </div>
                    <div className="mt-4 bg-blue-600 text-white py-2 rounded-lg text-center font-medium hover:bg-blue-700 transition-colors">
                      Scan Now
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Employee List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <UserCheck className="text-green-600 mr-2" size={24} />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Present Employees
                    </h2>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {filtered.length} Present
                  </div>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    aria-label="Search employees by name or location"
                    type="text"
                    placeholder="Search by name or location"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="animate-spin text-blue-500" size={36} />
                  </div>
                ) : error ? (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                    {error}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="bg-gray-50 text-gray-500 p-8 rounded-lg text-center">
                    No employees found matching your search.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Employee
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filtered.map((emp, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">
                                {emp.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-gray-600">
                                <MapPin size={16} className="mr-1 text-gray-400" />
                                {emp.location.placeName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                              {new Date(emp.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
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
