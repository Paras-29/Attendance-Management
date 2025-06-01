import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Mail, ChevronRight, Calendar, FileText } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/employees", label: "Employees", icon: <Users size={20} /> },
    { path: "/attendance", label: "Attendance", icon: <Calendar size={20} /> },
    { path: "/reports", label: "Reports", icon: <FileText size={20} /> }
  ];

  return (
    <div className="w-72 h-screen bg-white shadow-lg fixed flex flex-col justify-between border-r border-gray-100">
      {/* Header/Logo Section */}
      <div>
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
              <img 
                src="/assets/logo.png" 
                alt="Logo" 
                className="h-7 w-7 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">AttendancePro</h1>
              <p className="text-xs text-gray-500">Enterprise Solution</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="py-6">
          <div className="px-6 mb-3">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Navigation</h3>
          </div>
          <nav className="flex flex-col gap-1 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  group flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <span className={`
                      transition-colors duration-200
                      ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                    `}>
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.label}</span>
                    <ChevronRight 
                      size={16} 
                      className={`
                        ml-auto transition-transform duration-200
                        ${isActive ? 'text-blue-600 rotate-90' : 'text-gray-300 group-hover:text-gray-400'}
                      `} 
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100">
        <div className="p-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Mail size={16} className="text-blue-600" />
              </div>
              <span className="ml-3 font-medium text-gray-700 text-sm">Support</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Need assistance? Our team is here to help.
            </p>
            <a 
              href="mailto:support@attendancepro.com" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center transition-colors"
            >
              <Mail size={14} className="mr-1.5" />
              support@attendancepro.com
            </a>
          </div>
        </div>
        <div className="p-4">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors group">
            <LogOut size={18} className="text-gray-500 group-hover:text-gray-600" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;