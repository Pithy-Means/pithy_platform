"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", path: "/admin" },
  { name: "Add Course", path: "/admin/addcourse" },
  { name: "Add Questions", path: "/admin/add_question" },
];

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-lg font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="mt-4 flex-1">
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
