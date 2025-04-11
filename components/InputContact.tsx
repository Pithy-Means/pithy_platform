"use client";


import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

interface InputContactProps {
  label: string;
  type?: "text" | "email" | "number" | "tel" | "password";
  name?: string;
  className?: string;
  isTextarea?: boolean;
  value: string | number;
  onChange?: (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >,
  ) => void;
  error?: string;
  required?: boolean;
  showValidation?: boolean;
}

const InputContact: React.FC<InputContactProps> = ({
  label,
  type = "text",
  className = "",
  name,
  isTextarea = false,
  value,
  onChange,
  error,
  required = true,
  showValidation = true,
}) => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Handle validation
  useEffect(() => {
    if (!isTouched) return;
    
    const inputValue = String(value);
    
    // Simple validation based on type
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValid(emailRegex.test(inputValue));
    } else if (type === "number") {
      setIsValid(!isNaN(Number(inputValue)) && inputValue !== "");
    } else if (type === "password") {
      // Password strength validation
      const hasMinLength = inputValue.length >= 8;
      const hasUpperCase = /[A-Z]/.test(inputValue);
      const hasLowerCase = /[a-z]/.test(inputValue);
      const hasNumber = /[0-9]/.test(inputValue);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(inputValue);
      
      setIsValid(hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar);
    } else {
      // For text, tel, check if the field is not empty
      setIsValid(inputValue !== "");
    }
  }, [value, type, isTouched]);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    if (!isTouched) setIsTouched(true);
    
    // Call the external onChange handler if provided
    if (onChange) {
      onChange(e);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Label className="relative flex flex-col">
        <div className="relative w-full">
          {isTextarea ? (
            <Textarea
              value={value}
              onChange={handleChange}
              required={required}
              onBlur={() => setIsTouched(true)}
              className={`px-6 h-24 py-4 ${className} text-lg
                ${error && isTouched ? "border-red-500 focus:border-red-500" : ""}
                ${isValid && isTouched && !error ? "border-green-500 focus:border-green-500" : ""}
                border rounded border-black border-opacity-50 outline-none 
                text-black focus:text-black transition duration-200`}
            />
          ) : (
            <div className="relative">
              <Input
                type={type === "password" && showPassword ? "text" : type}
                value={value}
                name={name}
                onChange={handleChange}
                required={required}
                onBlur={() => setIsTouched(true)}
                className={`px-6 h-12 ${className} text-lg
                  ${error && isTouched ? "border-red-500 focus:border-red-500 pr-12" : ""}
                  ${isValid && isTouched && !error ? "border-green-500 focus:border-green-500 pr-12" : ""}
                  ${type === "password" ? "pr-12" : ""}
                  border rounded border-black border-opacity-50 outline-none 
                  text-black focus:text-black transition duration-200`}
              />
              
              {/* Password toggle icon */}
              {type === "password" && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-500" />
                  ) : (
                    <Eye size={20} className="text-gray-500" />
                  )}
                </button>
              )}
              
              {/* Validation icons */}
              {showValidation && isTouched && type !== "password" && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isValid && !error ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : isTouched && (value !== "" || error) ? (
                    <XCircle size={20} className="text-red-500" />
                  ) : null}
                </div>
              )}
            </div>
          )}
          
          <span 
            className={`text-black text-opacity-80 absolute top-0 left-0 mx-4 px-2 
              transform -translate-y-1/2 bg-white text-sm transition duration-200
              ${(value !== "" || isTouched) ? "scale-75" : "translate-y-1/2 scale-100"}`}
          >
            {label}{required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </div>
        
        {/* Error message */}
        {error && isTouched && (
          <span className="text-red-500 text-xs mt-1 ml-2">{error}</span>
        )}
        
        {/* Password strength hints when focused */}
        {type === "password" && isTouched && !isValid && value !== "" && (
          <div className="mt-2 text-xs text-gray-600 space-y-1 bg-gray-50 p-2 rounded">
            <p className={String(value).length >= 8 ? "text-green-600" : "text-gray-500"}>
              • At least 8 characters
            </p>
            <p className={/[A-Z]/.test(String(value)) ? "text-green-600" : "text-gray-500"}>
              • At least one uppercase letter
            </p>
            <p className={/[a-z]/.test(String(value)) ? "text-green-600" : "text-gray-500"}>
              • At least one lowercase letter
            </p>
            <p className={/[0-9]/.test(String(value)) ? "text-green-600" : "text-gray-500"}>
              • At least one number
            </p>
            <p className={/[^A-Za-z0-9]/.test(String(value)) ? "text-green-600" : "text-gray-500"}>
              • At least one special character
            </p>
          </div>
        )}
      </Label>
    </div>
  );
};

export default InputContact;