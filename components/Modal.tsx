// components/Modal.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-gradient-to-br from-black/60 via-gray-900/20 to-black/80 bg-opacity-40 h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Modal Content */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0, rotateX: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0, rotateX: 90, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              duration: 0.8,
            }}
          >
            <div
              className="relative bg-white/10 backdrop-blur-xl border border-gray-200/30 rounded-xl p-8 shadow-2xl w-11/12 max-w-xl transform perspective-1000"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Neon Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-pink-500 to-green-800 blur-lg opacity-30 -z-10 rounded-xl"></div>

              {/* Close Button */}
              <Button
                onClick={onClose}
                className="absolute top-1 right-1 bg-black/40 text-white p-2 rounded-full hover:bg-black/55 transition transform hover:scale-110"
              >
                &times;
              </Button>

              {/* Modal Content */}
              <div className="text-center">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
