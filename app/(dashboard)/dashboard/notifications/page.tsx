import React from "react";

const Notifications = () => {
  return (
    <div className="p-8 w-full flex-col flex items-center justify-center m-6 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-xl transform transition-all hover:scale-75 hover:shadow-2xl">
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 mb-6">
        Notifications
      </h1>
      <div className="p-6 bg-white/90 backdrop-blur-sm rounded-lg border border-green-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center justify-center space-y-4">
          <svg
            className="w-12 h-12 text-green-300 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <p className="text-lg text-gray-700 font-medium text-center">
            No notifications available for now.
          </p>
          <p className="text-sm text-gray-500 text-center">
            You&apos;re all caught up! Check back later for updates.
          </p>
        </div>
      </div>
      {/* Future implementation for displaying notifications will go here */}
    </div>
  );
};

export default Notifications;
