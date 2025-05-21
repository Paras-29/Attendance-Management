import React, { useEffect, useState } from "react";
import { Plus, Trash2, FileText, AlertCircle, X, UserPlus, Mail, Phone } from "lucide-react";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", contact: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/employees`)
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/employees`, {
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
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/employees/${id}`, {
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

  return (
    <div className="ml-56 p-3 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
            <p className="text-gray-500 mt-1">Manage your team members and their reports</p>
          </div>
          
          <button
            onClick={() => {
              setShowForm(!showForm);
              setError("");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
          >
            {showForm ? <X size={18} /> : <UserPlus size={18} />}
            {showForm ? "Cancel" : "Add Employee"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle size={20} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Add Employee Form */}
        {showForm && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <UserPlus size={20} className="mr-2" />
              Add New Employee
            </h2>
            
            <form
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleAddEmployee();
              }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserPlus size={16} className="text-gray-400" />
                </div>
                <input
                  className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Full Name"
                  value={form.name}
                  required
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Email Address"
                  type="email"
                  value={form.email}
                  required
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={16} className="text-gray-400" />
                </div>
                <input
                  className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Contact Number"
                  value={form.contact}
                  required
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                />
              </div>
              
              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Plus size={18} />
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Employee Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Employee Directory</h2>
            <p className="text-gray-500 text-sm mt-1">Total: {employees.length} employees</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : employees.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gray-100 rounded-full inline-block">
                  <UserPlus size={32} className="text-gray-400" />
                </div>
              </div>
              <p>No employees found. Add your first employee to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan="3">Reports</th>
                    <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {emp.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{emp.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{emp.email}</td>
                      <td className="px-4 py-3 text-gray-600">{emp.contact}</td>
                      <td className="px-2 py-3 text-center">
                        <button className="px-3 py-1 bg-green-50 text-green-700 hover:bg-green-100 transition-colors rounded-md text-sm flex items-center justify-center mx-auto">
                          <FileText size={14} className="mr-1" />
                          Daily
                        </button>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <button className="px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors rounded-md text-sm flex items-center justify-center mx-auto">
                          <FileText size={14} className="mr-1" />
                          Weekly
                        </button>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <button className="px-3 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors rounded-md text-sm flex items-center justify-center mx-auto">
                          <FileText size={14} className="mr-1" />
                          Monthly
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDeleteEmployee(emp._id)}
                          className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 transition-colors rounded-md text-sm flex items-center justify-center mx-auto"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </button>
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
  );
};

export default Employees;