// components/Modal.tsx
import React from "react";
import { Button } from "./ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg shadow-lg">
        <Button
          onClick={onClose}
          className="absolute top-2 right-2 text-white border border-white rounded-full hover:text-gray-900 text-3xl"
        >
          &times;
        </Button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
