"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaBook,
  FaQuestionCircle,
  FaBriefcase,
  FaMoneyCheckAlt,
  FaGraduationCap,
} from "react-icons/fa";
import { Joystick } from "lucide-react";

const links = [
  { name: "Home", path: "/admin", icon: <FaHome /> },
  { name: "Dashboard", path: "/dashboard", icon: <Joystick /> },
  { name: "Add Course", path: "/admin/addcourse", icon: <FaBook /> },
  { name: "Add Questions", path: "/admin/add_question", icon: <FaQuestionCircle /> },
  { name: "Add Job", path: "/admin/add_job", icon: <FaBriefcase /> },
  { name: "Add Funding", path: "/admin/add_funding", icon: <FaMoneyCheckAlt /> },
  { name: "Add Scholarship", path: "/admin/add_scholarship", icon: <FaGraduationCap /> },
];

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`h-screen rounded-tr-md bg-white text-black/60 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 text-lg font-bold border-b border-green-500 grid justify-items-end">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-green-500 rounded-lg"
        >
          {isCollapsed ? "«" : "»" }
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        {links.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`flex items-center px-4 py-3 hover:bg-green-500 hover:text-white/90 transition-colors ${
              pathname === link.path ? "bg-green-500 text-white/90" : ""
            }`}
          >
            <span className="text-xl">{link.icon}</span>
            {!isCollapsed && (
              <span className="ml-3">{link.name}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Sidebar Footer (Optional) */}
      <div className="p-4 border-t border-green-500">
        {!isCollapsed && (
          <p className="text-sm text-green-500">© 2025 Pithy Means</p>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;