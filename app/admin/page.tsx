"use client";

import { useState, useEffect, useCallback } from "react";
import type { NextPage } from "next";
import {
  deleteUser,
  getAllUsers,
  searchUsers,
} from "@/lib/actions/user.actions"; // Update with correct import path
import { UserInfo } from "@/types/schema";
import { DeleteIcon } from "lucide-react";

const Home: NextPage = () => {
  const [userData, setUserData] = useState<{
    users: UserInfo[];
    total: number;
  }>({
    users: [],
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: "",
    userName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch users data
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers(limit, offset);
      setUserData(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [limit, offset]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, limit, offset]);

  // Handle search
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const result = await searchUsers({
        searchTerm,
        limit,
        offset,
      });
      setUserData(result);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pagination
  const handleNextPage = () => {
    setOffset((prev) => prev + limit);
  };

  const handlePrevPage = () => {
    setOffset((prev) => Math.max(0, prev - limit));
  };


  // Open delete confirmation modal
  const openDeleteModal = (userId: string, userName: string) => {
    setDeleteModal({
      isOpen: true,
      userId,
      userName,
    });
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      userId: "",
      userName: "",
    });
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!deleteModal.userId) return;

    setIsDeleting(true);
    try {
      await deleteUser(deleteModal.userId);
      closeDeleteModal();
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold text-black mb-4">
              Confirm Deletion
            </h3>
            <p className="text-black mb-6">
              Are you sure you want to delete user{" "}
              <span className="font-semibold">{deleteModal.userName}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <header className="bg-white shadow-sm p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-black">Admin Dashboard</h2>
          <p className="text-black mt-2">
            Manage users and monitor system activity
          </p>
        </header>

        {/* Content */}
        <div className="mt-6">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-black">Total Users</h3>
              <p className="text-3xl font-bold text-black mt-2">
                {isLoading ? "Loading..." : userData.total.toLocaleString()}
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-black">Revenue</h3>
              <p className="text-3xl font-bold text-black mt-2"> - </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-black">
                Active Projects
              </h3>
              <p className="text-3xl font-bold text-black mt-2"> - </p>
            </div>
          </div>

          {/* User Search Section */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-black mb-4">
              User Management
            </h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Search by name, email or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md text-black"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Search
              </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full mt-4">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-3 text-black">Name</th>
                    <th className="py-3 text-black">Email</th>
                    <th className="py-3 text-black">Country</th>
                    <th className="py-3 text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-black">
                        Loading users...
                      </td>
                    </tr>
                  ) : userData.users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-black">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    userData.users.map((user: UserInfo) => (
                      <tr
                        key={user.user_id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 text-black">
                          {user.firstname} {user.lastname}
                        </td>
                        <td className="py-3 text-black">{user.email}</td>
                        <td className="py-3 text-black">{user.country}</td>
                        <td className="py-3">
                          <button
                            onClick={() =>
                              openDeleteModal(
                                user.user_id ?? "",
                                user.firstname ?? "Unknown"
                              )
                            }
                            className="text-red-600 hover:text-red-800"
                          >
                            <DeleteIcon className="w-5 h-5" />
                            <span className="sr-only">Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-black">
                Showing {offset + 1} to{" "}
                {Math.min(offset + limit, userData.total)} of {userData.total}{" "}
                users
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={offset === 0}
                  className={`px-3 py-1 rounded-md ${
                    offset === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={offset + limit >= userData.total}
                  className={`px-3 py-1 rounded-md ${
                    offset + limit >= userData.total
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
