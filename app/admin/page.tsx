import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome, Admin
          </h2>
        </header>

        {/* Content */}
        <div className="mt-6">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">
                Total Users
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">1,234</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">Revenue</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">$12,345</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">
                Active Projects
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">45</p>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Activity
            </h3>
            <table className="w-full mt-4">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">User</th>
                  <th className="py-2">Action</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">John Doe</td>
                  <td className="py-2">Logged In</td>
                  <td className="py-2">2023-10-01</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Jane Smith</td>
                  <td className="py-2">Updated Profile</td>
                  <td className="py-2">2023-10-02</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
