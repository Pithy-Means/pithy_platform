"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", path: "/admin" },
  { name: "Add Course", path: "/admin/addcourse" },
  { name: "Add Questions", path: "/admin/add_question" },
  { name: "Add Job", path: "/admin/add_job" },
  { name: "Add Funding", path: "/admin/add_funding" },
  { name: "Add Scholarship", path: "/admin/add_scholarship" },
];

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="h-full w-64 bg-gray-800 text-white flex flex-col py-8">
      <div className="p-4 text-lg font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex-1">
        {links.map((link) => (
          <Link key={link.path} href={link.path}>
            <a
              className={`block px-4 py-2 hover:bg-gray-700 ${
                pathname === link.path ? "bg-gray-700" : ""
              }`}
            >
              {link.name}
            </a>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
