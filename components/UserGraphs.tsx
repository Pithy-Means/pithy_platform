import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MapChart from './MapChart';

const userLocationData = [
  { location: 'New York', users: 1200 },
  { location: 'Los Angeles', users: 900 },
  { location: 'Chicago', users: 700 },
  { location: 'Houston', users: 600 },
  { location: 'Phoenix', users: 500 },
];

const UserGraphs = () => {
  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">User Analytics</h2>

      {/* Bar Chart: Users by Location */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Users by Location</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={userLocationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Map Chart: User Locations */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">User Locations Map</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <ResponsiveContainer width="100%" height={400}>
            <div className="text-center text-gray-500">
              <MapChart />
            </div>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserGraphs;