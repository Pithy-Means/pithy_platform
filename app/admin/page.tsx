"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaSun, FaMoon } from "react-icons/fa";

const AdminHomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sample data for charts
  const userData = [
    { name: "New York", users: 1200 },
    { name: "Los Angeles", users: 900 },
    { name: "Chicago", users: 700 },
    { name: "Houston", users: 600 },
    { name: "Phoenix", users: 500 },
  ];

  const pieData = [
    { name: "Active Users", value: 400 },
    { name: "Inactive Users", value: 100 },
  ];

  const COLORS = ["#10B981", "#EF4444"]; // Green and red for pie chart

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Header with Dark Mode Toggle */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${
            isDarkMode ? "bg-gray-700" : "bg-white"
          } shadow-md hover:shadow-lg transition-shadow`}
        >
          {isDarkMode ? (
            <FaSun className="text-yellow-400" />
          ) : (
            <FaMoon className="text-gray-700" />
          )}
        </button>
      </div>

      {/* Key Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Users", value: "2,345", change: "+5.2%", color: "green" },
          { title: "Active Courses", value: "42", change: "+3", color: "green" },
          { title: "Total Revenue", value: "$12,345", change: "+12.4%", color: "green" },
          { title: "Pending Tasks", value: "8", change: "2 overdue", color: "green" },
        ].map((metric, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold">{metric.title}</h3>
            <p className="text-3xl font-bold text-green-600">{metric.value}</p>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {metric.change} from last month
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart: Users by Location */}
        <div
          className={`p-6 rounded-lg shadow-md ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">Users by Location</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#4A5568" : "#E2E8F0"} />
              <XAxis dataKey="name" stroke={isDarkMode ? "#CBD5E0" : "#4A5568"} />
              <YAxis stroke={isDarkMode ? "#CBD5E0" : "#4A5568"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#2D3748" : "#FFFFFF",
                  borderColor: isDarkMode ? "#4A5568" : "#E2E8F0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="users" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Active vs Inactive Users */}
        <div
          className={`p-6 rounded-lg shadow-md ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">User Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#2D3748" : "#FFFFFF",
                  borderColor: isDarkMode ? "#4A5568" : "#E2E8F0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div
        className={`p-6 rounded-lg shadow-md ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <ul className="space-y-3">
          {[
            { activity: "New user registered", time: "2 hours ago", color: "green" },
            { activity: 'Course "React Basics" updated', time: "5 hours ago", color: "green" },
            { activity: "New order received", time: "1 day ago", color: "green" },
          ].map((item, index) => (
            <li
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg hover:bg-opacity-50 ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <p>{item.activity}</p>
              </div>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {item.time}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminHomePage;