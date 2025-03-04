"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { UserInfo } from '@/types/schema';

// Define the Props interface for UserSearchDisplay
interface UserSearchDisplayProps {
  searchFunction: (params: {
    searchTerm?: string;
    filters?: {
      categories?: string[];
      referral_by?: string;
      user_id?: string;
      email?: string;
    };
    limit?: number;
    offset?: number;
    sortField?: keyof UserInfo;
    sortOrder?: "asc" | "desc";
  }) => Promise<{ users: UserInfo[]; total: number }>;
}

const UserSearchDisplay: React.FC<UserSearchDisplayProps> = ({ searchFunction }) => {
  // State for search parameters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [referralFilter, setReferralFilter] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof UserInfo>("firstname");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // State for results
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState("");

  // Available categories for the filter dropdown
  const availableCategories = ["Employer", "Job Seeker", "Student"];

  // Function to handle search
  const handleSearch = useCallback(async () => {
    setIsSearching(true);
    setError("");
    
    try {
      const offset = (currentPage - 1) * pageSize;
      
      const filters: {
        categories?: string[];
        referral_by?: string;
      } = {};
      if (categoryFilter.length > 0) filters.categories = categoryFilter;
      if (referralFilter) filters.referral_by = referralFilter;
      
      const result = await searchFunction({
        searchTerm: searchTerm.trim() === "" ? undefined : searchTerm,
        filters,
        limit: pageSize,
        offset,
        sortField,
        sortOrder
      });
      
      setUsers(result.users);
      setTotalUsers(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during search");
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, categoryFilter, referralFilter, currentPage, pageSize, sortField, sortOrder, searchFunction]);

  // Perform search when page changes
  useEffect(() => {
    if (searchTerm || categoryFilter.length > 0 || referralFilter) {
      handleSearch();
    }
  }, [currentPage, sortField, sortOrder, pageSize, searchTerm, categoryFilter.length, referralFilter, handleSearch]);

  // Handle category selection
  const toggleCategory = (category: string) => {
    setCategoryFilter(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalUsers / pageSize);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">User Search</h2>
      
      {/* Search Form */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              type="text"
              placeholder="Name, Email, or User ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Categories</label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-2 py-1 text-sm rounded ${
                    categoryFilter.includes(category)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Referral Code</label>
            <input
              type="text"
              placeholder="Referral Code"
              value={referralFilter}
              onChange={(e) => setReferralFilter(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Sort By</label>
              <select 
                value={sortField as string}
                onChange={(e) => setSortField(e.target.value as keyof UserInfo)}
                className="p-2 border rounded"
              >
                <option value="firstname">First Name</option>
                <option value="lastname">Last Name</option>
                <option value="email">Email</option>
                <option value="referral_points">Referral Points</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="p-2 border rounded"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Per Page</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="p-2 border rounded"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Results table */}
      {users.length > 0 ? (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">User ID</th>
                  <th className="py-2 px-4 border-b text-left">Categories</th>
                  <th className="py-2 px-4 border-b text-left">Referral Code</th>
                  <th className="py-2 px-4 border-b text-left">Referral Points</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {user.firstname} {user.lastname}
                    </td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{user.user_id}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex flex-wrap gap-1">
                        {user.categories}
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">{user.referral_code}</td>
                    <td className="py-2 px-4 border-b">{user.referral_points}</td>
                    <td className="py-2 px-4 border-b">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div>
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded">
          {isSearching ? (
            <p>Searching for users...</p>
          ) : (
            <p>{searchTerm || categoryFilter.length > 0 || referralFilter ? "No users found matching your criteria." : "Enter search criteria and click 'Search' to find users."}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearchDisplay;