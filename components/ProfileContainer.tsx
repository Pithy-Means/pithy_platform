"use client";

import { useState } from "react";
import ProfilePage from "./ProfilePage";
import EditProfilePage from "./EditProfilePage";

export default function ProfileContainer() {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          {isEditing ? "View Profile" : "Edit Profile"}
        </button>
      </div>
      
      {isEditing ? <EditProfilePage /> : <ProfilePage />}
    </div>
  );
}