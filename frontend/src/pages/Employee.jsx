import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  FileText,
  AlertCircle,
  X,
  UserPlus,
  Mail,
  Phone,
  CheckCircle,
  BarChart2
} from "lucide-react";

const ReportModal = ({ isOpen, onClose, reportData, reportType, employeeName }) => {
  if (!isOpen) return null;

  // Defensive defaults
  const summary = reportData?.summary || {};

  // UI helpers
  const presentClass = 'bg-green-50 text-green-700 border-green-200';
  const absentClass = 'bg-red-50 text-red-700 border-red-200';

  // Renderers for each report type
  const renderDaily = () => (
    <div className="space-y-2">
      {reportData.days?.map(({ day, records, present }) => (
        <div key={day} className={`p-4 rounded-lg border flex flex-col md:flex-row md:items-center justify-between ${present ? presentClass : absentClass}`}> 
          <div className="font-semibold text-lg w-32 flex items-center gap-2">
            <BarChart2 size={18} /> {day}
          </div>
          {present ? (
            <div className="flex-1">
              <ul className="flex flex-wrap gap-4">
                {records.map((rec, idx) => (
                  <li key={idx} className="text-sm">
                    <span className="font-medium">{new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="ml-2 text-xs text-gray-500">{rec.location?.placeName}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="italic text-gray-400">Absent</div>
          )}
        </div>
      ))}
    </div>
  );

  const renderWeekly = () => (
    <div className="space-y-2">
      {reportData.weeks?.map(({ week, records, daysPresent }) => (
        <div key={week} className="p-4 rounded-lg border bg-blue-50 border-blue-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="font-semibold text-lg w-32 flex items-center gap-2"><BarChart2 size={18} />{week}</div>
            <div className="text-sm font-medium text-blue-700">Days Present: {daysPresent}</div>
          </div>
          {records.length > 0 ? (
            <ul className="flex flex-wrap gap-4 mt-2">
              {records.map((rec, idx) => (
                <li key={idx} className="text-sm bg-white rounded px-2 py-1 border border-blue-100">
                  {new Date(rec.timestamp).toLocaleDateString()} <span className="ml-2 text-xs text-gray-500">{rec.location?.placeName}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="italic text-gray-400 mt-2">No attendance this week</div>
          )}
        </div>
      ))}
    </div>
  );

  const renderMonthly = () => (
    <div className="space-y-2">
      {reportData.months?.map(({ month, records, daysPresent }) => (
        <div key={month} className="p-4 rounded-lg border bg-yellow-50 border-yellow-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="font-semibold text-lg w-32 flex items-center gap-2"><BarChart2 size={18} />{month}</div>
            <div className="text-sm font-medium text-yellow-700">Days Present: {daysPresent}</div>
          </div>
          {records.length > 0 ? (
            <ul className="flex flex-wrap gap-4 mt-2">
              {records.map((rec, idx) => (
                <li key={idx} className="text-sm bg-white rounded px-2 py-1 border border-yellow-100">
                  {new Date(rec.timestamp).toLocaleDateString()} <span className="ml-2 text-xs text-gray-500">{rec.location?.placeName}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="italic text-gray-400 mt-2">No attendance this month</div>
          )}
        </div>
      ))}
    </div>
  );

  // Summary UI
  const renderSummary = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      {reportType === 'daily' && (
        <>
          <div>
            <div className="text-sm font-medium text-gray-500">Days Present</div>
            <div className="text-lg font-semibold">{summary.totalDaysPresent}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Total Days</div>
            <div className="text-lg font-semibold">{summary.totalDays}</div>
          </div>
        </>
      )}
      {reportType === 'weekly' && (
        <>
          <div>
            <div className="text-sm font-medium text-gray-500">Total Weeks</div>
            <div className="text-lg font-semibold">{summary.totalWeeks}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Total Days Present</div>
            <div className="text-lg font-semibold">{summary.totalDaysPresent}</div>
          </div>
        </>
      )}
      {reportType === 'monthly' && (
        <>
          <div>
            <div className="text-sm font-medium text-gray-500">Total Months</div>
            <div className="text-lg font-semibold">{summary.totalMonths}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Total Days Present</div>
            <div className="text-lg font-semibold">{summary.totalDaysPresent}</div>
          </div>
        </>
      )}
    </div>
  );

  // Main render
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl border-2 border-blue-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-blue-800">
            {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
          </h3>
          <p className="text-gray-600">for {employeeName}</p>
        </div>
        {renderSummary()}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 text-lg">Attendance Records</h4>
          {reportType === 'daily' && renderDaily()}
          {reportType === 'weekly' && renderWeekly()}
          {reportType === 'monthly' && renderMonthly()}
        </div>
      </div>
    </div>
  );
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", contact: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({ records: [], summary: {} });
  const [reportType, setReportType] = useState(""); // 'daily', 'weekly', 'monthly'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/employees`)
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load employees");
        setLoading(false);
      });
  }, []);

  const handleAddEmployee = async () => {
    try {
      const res = await fetch(`${API_URL}/api/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Something went wrong");
        return;
      }

      const newEmployee = await res.json();
      setEmployees([...employees, newEmployee]);
      setForm({ name: "", email: "", contact: "" });
      setShowForm(false);
      setError(""); // Clear error on success
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const handleDeleteEmployee = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/api/employees/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Failed to delete employee");
        return;
      }

      setEmployees(employees.filter((emp) => emp._id !== id));
    } catch (err) {
      setError("Network error while deleting.");
    }
  };

  const fetchReport = async (id, type, name) => {
    try {
      const res = await fetch(
        `${API_URL}/api/${type}/${id}`
      );
      if (!res.ok) throw new Error("Failed to fetch report");
      const data = await res.json();
      setReportData(data);
      setReportType(type);
      setSelectedEmployee(name);
      setShowReport(true);
    } catch (err) {
      setError("Could not load report data.");
    }
  };

  return (
    <div className="ml-64 p-10 bg-gradient-to-br from-blue-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-800 mb-2 tracking-tight drop-shadow-sm">
              Employee Management
            </h1>
            <p className="text-gray-500 mt-1 text-lg">
              Manage your team members and their reports
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setError("");
            }}
            className={`px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg text-lg font-semibold ${showForm ? "bg-red-600 hover:bg-red-700" : ""}`}
          >
            {showForm ? <X size={22} /> : <UserPlus size={22} />}
            {showForm ? "Cancel" : "Add Employee"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center text-lg shadow">
            <AlertCircle size={22} className="mr-3 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Add Employee Form */}
        {showForm && (
          <div className="mb-10 bg-white p-8 rounded-2xl shadow-xl border border-blue-100 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center gap-2">
              <UserPlus size={22} /> Add New Employee
            </h2>

            <form
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleAddEmployee();
              }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserPlus size={18} className="text-gray-400" />
                </div>
                <input
                  className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
                  placeholder="Full Name"
                  value={form.name}
                  required
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
                  placeholder="Email Address"
                  type="email"
                  value={form.email}
                  required
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
                  placeholder="Contact Number"
                  type="tel"
                  value={form.contact}
                  required
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                />
              </div>

              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg text-lg font-semibold"
                >
                  <Plus size={20} /> Save Employee
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Employee Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="p-8 border-b border-blue-100">
            <h2 className="text-2xl font-bold text-blue-800">Employee Directory</h2>
            <p className="text-gray-500 text-lg mt-1">
              Total: {employees.length} employees
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : employees.length === 0 ? (
            <div className="py-16 text-center text-gray-500 text-lg">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full inline-block">
                  <UserPlus size={36} className="text-gray-400" />
                </div>
              </div>
              <p>No employees found. Add your first employee to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="py-4 px-6 text-left text-xs font-bold text-blue-700 uppercase tracking-wider rounded-tl-2xl">
                      Name
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th
                      className="py-4 px-6 text-center text-xs font-bold text-blue-700 uppercase tracking-wider"
                      colSpan="3"
                    >
                      Reports
                    </th>
                    <th className="py-4 px-6 text-center text-xs font-bold text-blue-700 uppercase tracking-wider rounded-tr-2xl">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {employees.map((emp) => (
                    <tr
                      key={emp._id}
                      className="hover:bg-blue-50/60 transition"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shadow">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-semibold text-gray-900 text-lg">
                          {emp.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-base">{emp.email}</td>
                      <td className="px-6 py-4 text-gray-600 text-base">{emp.contact}</td>
                      <td className="px-3 py-4 text-center">
                        <button
                          onClick={() => fetchReport(emp._id, "daily", emp.name)}
                          className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 transition-colors rounded-lg text-base flex items-center justify-center mx-auto font-semibold shadow"
                        >
                          <FileText size={16} className="mr-1" /> Daily
                        </button>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <button
                          onClick={() => fetchReport(emp._id, "weekly", emp.name)}
                          className="px-4 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors rounded-lg text-base flex items-center justify-center mx-auto font-semibold shadow"
                        >
                          <FileText size={16} className="mr-1" /> Weekly
                        </button>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <button
                          onClick={() => fetchReport(emp._id, "monthly", emp.name)}
                          className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors rounded-lg text-base flex items-center justify-center mx-auto font-semibold shadow"
                        >
                          <FileText size={16} className="mr-1" /> Monthly
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteEmployee(emp._id)}
                          className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 transition-colors rounded-lg text-base flex items-center justify-center mx-auto font-semibold shadow"
                        >
                          <Trash2 size={16} className="mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showReport && (
                <ReportModal
                  isOpen={showReport}
                  onClose={() => setShowReport(false)}
                  reportData={reportData}
                  reportType={reportType}
                  employeeName={selectedEmployee}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;

// import React, { useEffect, useState } from "react";
// import {
//   Plus,
//   Trash2,
//   FileText,
//   AlertCircle,
//   X,
//   UserPlus,
//   Mail,
//   Phone,
//   CheckCircle,
//   BarChart2,
//   Calendar,
//   Clock,
//   MapPin,
//   TrendingUp,
//   Users,
//   Activity
// } from "lucide-react";

// const ReportModal = ({ isOpen, onClose, reportData, reportType, employeeName }) => {
//   if (!isOpen) return null;

//   const summary = reportData?.summary || {};

//   const presentClass = 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 border border-emerald-200 shadow-sm';
//   const absentClass = 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border border-red-200 shadow-sm';

//   const renderDaily = () => (
//     <div className="space-y-3">
//       {reportData.days?.map(({ day, records, present }) => (
//         <div key={day} className={`p-5 rounded-2xl ${present ? presentClass : absentClass} backdrop-blur-sm`}> 
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div className="font-bold text-lg flex items-center gap-3">
//               <div className={`p-2 rounded-xl ${present ? 'bg-emerald-100' : 'bg-red-100'}`}>
//                 <Calendar size={20} />
//               </div>
//               {day}
//             </div>
//             {present ? (
//               <div className="flex-1">
//                 <div className="flex flex-wrap gap-3">
//                   {records.map((rec, idx) => (
//                     <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/50 shadow-sm">
//                       <div className="flex items-center gap-2 text-sm font-medium">
//                         <Clock size={14} />
//                         {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </div>
//                       {rec.location?.placeName && (
//                         <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
//                           <MapPin size={12} />
//                           {rec.location.placeName}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center gap-2 text-gray-500 font-medium">
//                 <Activity size={16} />
//                 No attendance recorded
//               </div>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   const renderWeekly = () => (
//     <div className="space-y-3">
//       {reportData.weeks?.map(({ week, records, daysPresent }) => (
//         <div key={week} className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div className="font-bold text-lg flex items-center gap-3">
//               <div className="p-2 rounded-xl bg-blue-100">
//                 <BarChart2 size={20} />
//               </div>
//               {week}
//             </div>
//             <div className="flex items-center gap-2 text-blue-700 font-semibold bg-blue-100 px-4 py-2 rounded-xl">
//               <TrendingUp size={16} />
//               {daysPresent} days present
//             </div>
//           </div>
//           {records.length > 0 ? (
//             <div className="flex flex-wrap gap-3 mt-4">
//               {records.map((rec, idx) => (
//                 <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/50 shadow-sm">
//                   <div className="text-sm font-medium">{new Date(rec.timestamp).toLocaleDateString()}</div>
//                   {rec.location?.placeName && (
//                     <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
//                       <MapPin size={12} />
//                       {rec.location.placeName}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="flex items-center gap-2 text-gray-500 font-medium mt-4">
//               <Activity size={16} />
//               No attendance this week
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );

//   const renderMonthly = () => (
//     <div className="space-y-3">
//       {reportData.months?.map(({ month, records, daysPresent }) => (
//         <div key={month} className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 shadow-sm">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div className="font-bold text-lg flex items-center gap-3">
//               <div className="p-2 rounded-xl bg-amber-100">
//                 <Calendar size={20} />
//               </div>
//               {month}
//             </div>
//             <div className="flex items-center gap-2 text-amber-700 font-semibold bg-amber-100 px-4 py-2 rounded-xl">
//               <TrendingUp size={16} />
//               {daysPresent} days present
//             </div>
//           </div>
//           {records.length > 0 ? (
//             <div className="flex flex-wrap gap-3 mt-4">
//               {records.map((rec, idx) => (
//                 <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/50 shadow-sm">
//                   <div className="text-sm font-medium">{new Date(rec.timestamp).toLocaleDateString()}</div>
//                   {rec.location?.placeName && (
//                     <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
//                       <MapPin size={12} />
//                       {rec.location.placeName}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="flex items-center gap-2 text-gray-500 font-medium mt-4">
//               <Activity size={16} />
//               No attendance this month
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );

//   const renderSummary = () => (
//     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//       {reportType === 'daily' && (
//         <>
//           <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-5 rounded-2xl border border-emerald-200 shadow-sm">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 bg-emerald-500 rounded-xl">
//                 <CheckCircle size={18} className="text-white" />
//               </div>
//               <div className="text-sm font-medium text-emerald-700">Days Present</div>
//             </div>
//             <div className="text-2xl font-bold text-emerald-800">{summary.totalDaysPresent || 0}</div>
//           </div>
//           <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-5 rounded-2xl border border-gray-200 shadow-sm">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 bg-gray-500 rounded-xl">
//                 <Calendar size={18} className="text-white" />
//               </div>
//               <div className="text-sm font-medium text-gray-700">Total Days</div>
//             </div>
//             <div className="text-2xl font-bold text-gray-800">{summary.totalDays || 0}</div>
//           </div>
//         </>
//       )}
//       {reportType === 'weekly' && (
//         <>
//           <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-5 rounded-2xl border border-blue-200 shadow-sm">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 bg-blue-500 rounded-xl">
//                 <BarChart2 size={18} className="text-white" />
//               </div>
//               <div className="text-sm font-medium text-blue-700">Total Weeks</div>
//             </div>
//             <div className="text-2xl font-bold text-blue-800">{summary.totalWeeks || 0}</div>
//           </div>
//           <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-5 rounded-2xl border border-emerald-200 shadow-sm">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 bg-emerald-500 rounded-xl">
//                 <TrendingUp size={18} className="text-white" />
//               </div>
//               <div className="text-sm font-medium text-emerald-700">Days Present</div>
//             </div>
//             <div className="text-2xl font-bold text-emerald-800">{summary.totalDaysPresent || 0}</div>
//           </div>
//         </>
//       )}
//       {reportType === 'monthly' && (
//         <>
//           <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-5 rounded-2xl border border-amber-200 shadow-sm">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 bg-amber-500 rounded-xl">
//                 <Calendar size={18} className="text-white" />
//               </div>
//               <div className="text-sm font-medium text-amber-700">Total Months</div>
//             </div>
//             <div className="text-2xl font-bold text-amber-800">{summary.totalMonths || 0}</div>
//           </div>
//           <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-5 rounded-2xl border border-emerald-200 shadow-sm">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 bg-emerald-500 rounded-xl">
//                 <TrendingUp size={18} className="text-white" />
//               </div>
//               <div className="text-sm font-medium text-emerald-700">Days Present</div>
//             </div>
//             <div className="text-2xl font-bold text-emerald-800">{summary.totalDaysPresent || 0}</div>
//           </div>
//         </>
//       )}
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-2xl border border-white/20">
//         <button
//           onClick={onClose}
//           className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-200"
//         >
//           <X size={24} />
//         </button>
        
//         <div className="mb-8">
//           <div className="flex items-center gap-4 mb-2">
//             <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
//               <FileText size={24} className="text-white" />
//             </div>
//             <div>
//               <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
//               </h3>
//               <p className="text-gray-600 text-lg">for {employeeName}</p>
//             </div>
//           </div>
//         </div>
        
//         {renderSummary()}
        
//         <div className="space-y-6">
//           <h4 className="font-bold text-gray-800 text-xl flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
//               <Activity size={20} className="text-white" />
//             </div>
//             Attendance Records
//           </h4>
//           {reportType === 'daily' && renderDaily()}
//           {reportType === 'weekly' && renderWeekly()}
//           {reportType === 'monthly' && renderMonthly()}
//         </div>
//       </div>
//     </div>
//   );
// };

// const Employees = () => {
//   const [employees, setEmployees] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({ name: "", email: "", contact: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [reportData, setReportData] = useState({ records: [], summary: {} });
//   const [reportType, setReportType] = useState("");
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [showReport, setShowReport] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     fetch(`http://localhost:5000/api/employees`)
//       .then((res) => res.json())
//       .then((data) => {
//         setEmployees(data);
//         setLoading(false);
//       })
//       .catch(() => {
//         setError("Failed to load employees");
//         setLoading(false);
//       });
//   }, []);

//   const handleAddEmployee = async () => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/employees`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         setError(err.message || "Something went wrong");
//         return;
//       }

//       const newEmployee = await res.json();
//       setEmployees([...employees, newEmployee]);
//       setForm({ name: "", email: "", contact: "" });
//       setShowForm(false);
//       setError("");
//     } catch (err) {
//       setError("Network error. Please try again.");
//     }
//   };

//   const handleDeleteEmployee = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this employee?"
//     );
//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(`http://localhost:5000/api/employees/${id}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         setError(err.message || "Failed to delete employee");
//         return;
//       }

//       setEmployees(employees.filter((emp) => emp._id !== id));
//     } catch (err) {
//       setError("Network error while deleting.");
//     }
//   };

//   const fetchReport = async (id, type, name) => {
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/${type}/${id}`
//       );
//       if (!res.ok) throw new Error("Failed to fetch report");
//       const data = await res.json();
//       setReportData(data);
//       setReportType(type);
//       setSelectedEmployee(name);
//       setShowReport(true);
//     } catch (err) {
//       setError("Could not load report data.");
//     }
//   };

//   return (
//     <div className="ml-64 p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
//           <div>
//             <h1 className="text-5xl font-black bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent mb-3 tracking-tight">
//               Employee Hub
//             </h1>
//             <p className="text-gray-600 text-xl font-medium flex items-center gap-2">
//               <Users size={20} />
//               Manage your team and track performance
//             </p>
//           </div>

//           <button
//             onClick={() => {
//               setShowForm(!showForm);
//               setError("");
//             }}
//             className={`group px-8 py-4 rounded-2xl flex items-center gap-3 font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
//               showForm 
//                 ? "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700" 
//                 : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
//             }`}
//           >
//             <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all">
//               {showForm ? <X size={20} /> : <UserPlus size={20} />}
//             </div>
//             {showForm ? "Cancel" : "Add Employee"}
//           </button>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-8 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl flex items-center text-lg shadow-sm">
//             <div className="p-2 bg-red-100 rounded-xl mr-4">
//               <AlertCircle size={20} />
//             </div>
//             <span className="font-medium">{error}</span>
//           </div>
//         )}

//         {/* Add Employee Form */}
//         {showForm && (
//           <div className="mb-12 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 animate-fade-in">
//             <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
//               <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
//                 <UserPlus size={24} className="text-white" />
//               </div>
//               Add New Team Member
//             </h2>

//             <form action=""
//                   onSubmit={(e) => {
//                 e.preventDefault();
//                 handleAddEmployee();
//               }}
//             >


//               <div className="group">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <UserPlus size={20} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                   </div>
//                   <input
//                     className="pl-12 w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-lg bg-white/50 backdrop-blur-sm"
//                     placeholder="Enter full name"
//                     value={form.name}
//                     required
//                     onChange={(e) => setForm({ ...form, name: e.target.value })}
//                   />
//                 </div>
//               </div>

//               <div className="group">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <Mail size={20} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                   </div>
//                   <input
//                     className="pl-12 w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-lg bg-white/50 backdrop-blur-sm"
//                     placeholder="Enter email address"
//                     type="email"
//                     value={form.email}
//                     required
//                     onChange={(e) => setForm({ ...form, email: e.target.value })}
//                   />
//                 </div>
//               </div>

//               <div className="group">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <Phone size={20} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                   </div>
//                   <input
//                     className="pl-12 w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-lg bg-white/50 backdrop-blur-sm"
//                     placeholder="Enter contact number"
//                     type="tel"
//                     value={form.contact}
//                     required
//                     onChange={(e) => setForm({ ...form, contact: e.target.value })}
//                   />
//                 </div>
//               </div>

//               <div className="lg:col-span-3 flex justify-end">
//                 <button
//                   type="submit"
//                   className="group px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-bold text-lg"
//                 >
//                   <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all">
//                     <Plus size={20} />
//                   </div>
//                   Save Employee
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Employee Cards */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
//           <div className="p-8 border-b border-gray-200/50">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent">
//                   Team Directory
//                 </h2>
//                 <p className="text-gray-600 text-lg mt-2 flex items-center gap-2">
//                   <Users size={18} />
//                   {employees.length} team members
//                 </p>
//               </div>
//               <div className="hidden lg:flex items-center gap-4">
//                 <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl font-semibold">
//                   Active: {employees.length}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center py-20">
//               <div className="relative">
//                 <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
//                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0"></div>
//               </div>
//             </div>
//           ) : employees.length === 0 ? (
//             <div className="py-20 text-center">
//               <div className="flex justify-center mb-6">
//                 <div className="p-6 bg-gradient-to-br from-gray-100 to-slate-200 rounded-3xl">
//                   <Users size={48} className="text-gray-400" />
//                 </div>
//               </div>
//               <h3 className="text-2xl font-bold text-gray-700 mb-2">No team members yet</h3>
//               <p className="text-gray-500 text-lg">Add your first employee to get started with team management</p>
//             </div>
//           ) : (
//             <div className="p-8">
//               <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {employees.map((emp) => (
//                   <div
//                     key={emp._id}
//                     className="group bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
//                   >
//                     {/* Employee Header */}
//                     <div className="flex items-center gap-4 mb-6">
//                       <div className="relative">
//                         <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
//                           {emp.name.charAt(0).toUpperCase()}
//                         </div>
//                         <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white"></div>
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="font-bold text-xl text-gray-900 mb-1">{emp.name}</h3>
//                         <div className="flex items-center gap-1 text-gray-600 text-sm">
//                           <Mail size={14} />
//                           {emp.email}
//                         </div>
//                         <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
//                           <Phone size={14} />
//                           {emp.contact}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Report Buttons */}
//                     <div className="grid grid-cols-3 gap-2 mb-4">
//                       <button
//                         onClick={() => fetchReport(emp._id, "daily", emp.name)}
//                         className="p-3 bg-gradient-to-br from-emerald-50 to-green-100 text-emerald-700 hover:from-emerald-100 hover:to-green-200 transition-all duration-200 rounded-xl text-sm font-semibold flex flex-col items-center gap-1 shadow-sm hover:shadow-md"
//                       >
//                         <Calendar size={16} />
//                         Daily
//                       </button>
//                       <button
//                         onClick={() => fetchReport(emp._id, "weekly", emp.name)}
//                         className="p-3 bg-gradient-to-br from-amber-50 to-yellow-100 text-amber-700 hover:from-amber-100 hover:to-yellow-200 transition-all duration-200 rounded-xl text-sm font-semibold flex flex-col items-center gap-1 shadow-sm hover:shadow-md"
//                       >
//                         <BarChart2 size={16} />
//                         Weekly
//                       </button>
//                       <button
//                         onClick={() => fetchReport(emp._id, "monthly", emp.name)}
//                         className="p-3 bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 hover:from-blue-100 hover:to-indigo-200 transition-all duration-200 rounded-xl text-sm font-semibold flex flex-col items-center gap-1 shadow-sm hover:shadow-md"
//                       >
//                         <TrendingUp size={16} />
//                         Monthly
//                       </button>
//                     </div>

//                     {/* Delete Button */}
//                     <button
//                       onClick={() => handleDeleteEmployee(emp._id)}
//                       className="w-full p-3 bg-gradient-to-br from-red-50 to-rose-100 text-red-700 hover:from-red-100 hover:to-rose-200 transition-all duration-200 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
//                     >
//                       <Trash2 size={16} />
//                       Remove Employee
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {showReport && (
//           <ReportModal
//             isOpen={showReport}
//             onClose={() => setShowReport(false)}
//             reportData={reportData}
//             reportType={reportType}
//             employeeName={selectedEmployee}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Employees;