"use client";

import React, { useState, useEffect } from "react";
import {
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaSun, FaMoon } from "react-icons/fa";
import UserManagement from "@/components/UserManagement";
import { UserInfo } from "@/types/schema";
import { getAllUsers } from "@/lib/actions/user.actions";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { Tooltip as ReactTooltip } from "react-tooltip";

const colorScale = scaleLinear<string>()
  .domain([0, 500])
  .range(["#e0f3f8", "#003366"]);

const countryNameMapping: { [key: string]: string } = {
  "USA": "United States of America",
  "UK": "United Kingdom",
  // Add more mappings as needed
};

const AdminHomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userData, setUserData] = useState<{ name: string; users: number }[]>([]);
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeCourses: 42,
    totalRevenue: "$12,345",
    pendingTasks: 8,
  });

  const fetchUsers = async (page: number, limit: number, search?: string) => {
    try {
      const offset = (page - 1) * limit;
      const filters = search
        ? [
            { field: "firstname", operator: "contains", value: search },
            { field: "lastname", operator: "contains", value: search },
            { field: "email", operator: "contains", value: search },
            { operator: "or" },
          ]
        : [];
      const response = await getAllUsers(limit, offset, filters);
      return response;
    } catch (error) {
      console.error("Error fetching users:", error);
      return { users: [], total: 0 };
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetchUsers(1, 100);
        if (response && response.users) {
          setMetrics((prev) => ({ ...prev, totalUsers: response.total }));

          const locationMap = new Map();
          response.users.forEach((user: UserInfo) => {
            const location = user.country || "Unknown";
            locationMap.set(location, (locationMap.get(location) || 0) + 1);
          });

          const formattedLocationData = Array.from(locationMap).map(([name, users]) => ({
            name,
            users,
          }));

          setUserData(formattedLocationData.sort((a, b) => b.users - a.users).slice(0, 5));

          const activeUsers = response.users.filter((user: UserInfo) => user.active).length;
          const inactiveUsers = response.users.length - activeUsers;
          setPieData([
            { name: "Active Users", value: activeUsers },
            { name: "Inactive Users", value: inactiveUsers },
          ]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const standardizedUserData = userData.map((item) => ({
    name: countryNameMapping[item.name] || item.name,
    users: item.users,
  }));

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Admin Dashboard</h1>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-white"} shadow-md hover:shadow-lg transition-shadow`}>
          {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Users", value: metrics.totalUsers.toLocaleString(), change: "+5.2%", color: "green" },
          { title: "Active Courses", value: metrics.activeCourses.toString(), change: "+3", color: "green" },
          { title: "Total Revenue", value: metrics.totalRevenue, change: "+12.4%", color: "green" },
          { title: "Pending Tasks", value: metrics.pendingTasks.toString(), change: "2 overdue", color: "green" },
        ].map((metric, index) => (
          <div key={index} className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className="text-lg font-semibold">{metric.title}</h3>
            <p className="text-3xl font-bold text-green-600">{metric.value}</p>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{metric.change} from last month</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <h3 className="text-xl font-semibold mb-4">Users by Location</h3>
          <ComposableMap data-tip="" projection="geoMercator">
            <Geographies geography="/countries.geo.json">
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const user = standardizedUserData.find((u) => u.name === countryName);
                  const userCount = user ? user.users : 0;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={colorScale(userCount)}
                      stroke="#000"
                      className="transition duration-200 hover:scale-105"
                      data-tooltip-id="country-tooltip"
                      data-tooltip-content={`${countryName}: ${userCount} users`}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
          <ReactTooltip id="country-tooltip" />
        </div>

        <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <h3 className="text-xl font-semibold mb-4">User Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={["#10B981", "#EF4444"][index % 2]} />
                ))}
              </Pie>
              <ChartTooltip contentStyle={{ backgroundColor: isDarkMode ? "#2D3748" : "#FFFFFF", borderColor: isDarkMode ? "#4A5568" : "#E2E8F0", borderRadius: "8px" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <h3 className="text-xl font-semibold mb-4">User Management</h3>
        <UserManagement fetchUsers={fetchUsers} onEdit={(user) => console.log("Edit user:", user)} onDelete={(userId) => console.log("Delete user:", userId)} />
      </div>
    </div>
  );
};

export default AdminHomePage;