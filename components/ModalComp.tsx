"use client";

import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean; // Determines whether the modal is open
  onClose: () => void; // Function to close the modal
  children: ReactNode; // Content to display inside the modal
}

const ModalComp: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[100%] max-w-md">
        <div className="p-4">
          {children}
        </div>
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalComp;
