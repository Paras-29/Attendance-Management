// App.jsx or MainLayout.jsx
import { useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar"; // adjust path accordingly

const Layout = ({ children }) => {
  const location = useLocation();

  const isAttendancePage = location.pathname === "/mark-attendance" || location.pathname === "/thank-you";

  return (
    <div className="flex">
      {!isAttendancePage && <Sidebar />}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
