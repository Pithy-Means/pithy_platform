"use client";

import { useState } from "react";
import ProfilePage from "./ProfilePage";
import EditProfilePage from "./EditProfilePage";

export default function ProfileContainer() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          {isEditing ? "View Profile" : "Edit Profile"}
        </button>
      </div>

      <div className="modal-content-container">
        {isEditing ? <EditProfilePage /> : <ProfilePage />}
      </div>
    </div>
  );
}
