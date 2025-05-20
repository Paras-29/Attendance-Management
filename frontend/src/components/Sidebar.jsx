import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Mail, ChevronRight } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/employees", label: "Employees", icon: <Users size={18} /> }
  ];

  return (
    <div className="w-58 h-screen bg-white shadow-lg fixed flex flex-col justify-between border-r border-gray-100">
      {/* Header/Logo Section */}
      <div>
        <div className="h-20 flex items-center justify-center p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            {/* Company Logo */}
            <div className=" h-10 w-10 rounded-lg flex items-center justify-center shadow-sm">
              <img 
                src="./assets/logo.png" 
                alt="Logo" 
                className="h-8 w-8 object-contain"
              />
            </div>
            {/* Company Name */}
            <div className="font-bold text-xl text-gray-800">MicroCom</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="py-6">
          <div className="px-6 mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Main Menu</h3>
          </div>
          <nav className="flex flex-col gap-1 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center p-3 rounded-lg transition-all duration-200
                  ${isActive ? 
                    'bg-blue-50 text-blue-700 font-medium' : 
                    'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
                <ChevronRight size={16} className="ml-auto opacity-70" />
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100">
        <div className="p-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail size={14} className="text-blue-600" />
                </div>
                <span className="ml-2 font-medium text-gray-700 text-sm">Contact Us</span>
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-3">
              Need help? Reach out to our support team.
            </div>
            <a 
              href="mailto:microcom@gmail.com" 
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
            >
              <Mail size={14} className="mr-1" />
              microcom@gmail.com
            </a>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;