"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight, FiSearch, FiMail, FiEdit, FiTrash2 } from 'react-icons/fi';
import { UserInfo } from '@/types/schema';

interface UsersTableProps {
  fetchUsers: (page: number, limit: number, search?: string) => Promise<{
    users: UserInfo[];
    total: number;
  }>;
  onEdit?: (user: UserInfo) => void;
  onDelete?: (userId: string) => void;
}

const UserManagement: React.FC<UsersTableProps> = ({ fetchUsers, onEdit, onDelete }) => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const usersPerPage = 10;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchUsers(currentPage, usersPerPage, searchQuery);
      setUsers(response.users);
      setTotalUsers(response.total);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, usersPerPage, searchQuery, fetchUsers]);

  useEffect(() => {
    loadUsers();
  }, [currentPage, loadUsers]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setCurrentPage(1);
      loadUsers();
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchQuery, searchTimeout, loadUsers]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">User Management</h2>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {users.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">User</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-center">Referral Code</th>
                    <th className="py-3 px-6 text-center">Categories</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {users.map((user) => (
                    <tr key={user.user_id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6 text-left">
                        <div className="flex items-center">
                          <div className="mr-2">
                            <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-bold">
                              {`${user.firstname?.[0] || ''}${user.lastname?.[0] || ''}`}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">{`${user.firstname || ''} ${user.lastname || ''}`}</span>
                            <p className="text-xs text-gray-500">{user.user_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-left">
                        <div className="flex items-center">
                          <FiMail className="mr-2 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs">
                          {user.referral_code}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex flex-wrap justify-center gap-1">
                          {user?.categories}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex item-center justify-center gap-2">
                          <button 
                            onClick={() => onEdit && onEdit(user)} 
                            className="transform hover:scale-110 transition duration-300 text-blue-500"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button 
                            onClick={() => onDelete && onDelete(user.user_id)} 
                            className="transform hover:scale-110 transition duration-300 text-red-500"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between mt-6">
            <div className="text-sm text-gray-500 mb-4 sm:mb-0">
              Showing {users.length > 0 ? (currentPage - 1) * usersPerPage + 1 : 0} to {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
            </div>
            <div className="flex items-center">
              <button 
                onClick={handlePreviousPage} 
                disabled={currentPage === 1} 
                className={`mx-1 px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                <FiChevronLeft />
              </button>
              
              {getPageNumbers().map(pageNum => (
                <button 
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)} 
                  className={`mx-1 px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  {pageNum}
                </button>
              ))}
              
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages} 
                className={`mx-1 px-3 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;