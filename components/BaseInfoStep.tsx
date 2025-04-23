import React, { useEffect, useState } from "react";
import { BaseUserInfo } from "@/types/schema";
import InputContact from "./InputContact"; // Assuming this component handles label and input
import Phonenumber from "./Phonenumber"; // Assuming this is a styled phone input
import { baseUserSchema } from "@/lib/validations/auth-schema";
import { z } from "zod";
import { cn } from "@/lib/utils"; // Utility for combining class names (like Tailwind's classnames)

/**
 * Generates a strong password with a mix of uppercase and lowercase letters.
 *
 * @param length - The desired length of the password. Must be at least 8.
 * @returns The generated strong password.
 * @throws Error if the length is less than 8.
 */
function generateStrongPassword(length: number = 12): string {
  if (typeof length !== "number") {
    throw new TypeError("Length must be a number.");
  }
  if (length < 8) {
    throw new Error("Password length must be at least 8 characters.");
  }

  // Define the character sets
  const lowercaseChars: string = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars: string = "0123456789";
  const specialChars: string = "!@#$%^&*()_-+={}[]|;:<>,.?/~";

  // Combine all character sets
  const allChars: string =
    lowercaseChars + uppercaseChars + numberChars + specialChars;

  // Ensure at least one character from each set
  const passwordChars: string[] = [
    lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length)),
    uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length)),
    numberChars.charAt(Math.floor(Math.random() * numberChars.length)),
    specialChars.charAt(Math.floor(Math.random() * specialChars.length)),
  ];

  // Fill the remaining slots with random characters from all sets
  const remainingLength: number = length - 4;
  for (let i = 0; i < remainingLength; i++) {
    passwordChars.push(
      allChars.charAt(Math.floor(Math.random() * allChars.length))
    );
  }

  // Shuffle the password to randomize the order of characters
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join("");
}

interface BasicInfoStepProps {
  formData: Partial<BaseUserInfo>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  updateFormErrors?: (errors: Record<string, string>) => void;
}

// Component for basic information form step
export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  onChange,
  updateFormErrors,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordLength, setPasswordLength] = useState<number>(12);

  useEffect(() => {
    try {
      baseUserSchema.parse(formData);
      setErrors({});
      if (updateFormErrors) updateFormErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0];
          fieldErrors[field as string] = err.message;
        });
        setErrors(fieldErrors);
        if (updateFormErrors) updateFormErrors(fieldErrors);
      }
    }
  }, [formData, updateFormErrors]);

  const handleGeneratePassword = () => {
    try {
      const newPassword = generateStrongPassword(passwordLength);
      onChange({
        target: { name: "password", value: newPassword },
      } as React.ChangeEvent<HTMLInputElement>);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error generating password:", error.message);
        setErrors((prevErrors) => ({ ...prevErrors, password: error.message }));
      } else {
        console.error("Error generating password:", error);
      }
    }
  };

  return (
    <div className="w-full relative px-6 md:px-8 lg:px-12">
      {/* Form Fields with Google-Inspired Styling */}
      <div className="w-full mx-auto flex flex-col space-y-6 md:space-y-8">
        <InputContact
          label="First name"
          type="text"
          name="firstname"
          value={formData.firstname || ""}
          onChange={onChange}
          className={cn(
            "py-3 md:py-4",
            "focus:ring-2 focus:ring-blue-500", // Google focus style
            "transition-all duration-300",
            "border-0 border-b border-gray-300", // Underline style
            "focus:border-blue-500",
            "placeholder:text-gray-400", // Placeholder color
            "text-gray-700" // Input text color
          )}
          error={errors.firstname}
        />
        <InputContact
          label="Last name"
          type="text"
          name="lastname"
          value={formData.lastname || ""}
          onChange={onChange}
          className={cn(
            "py-3 md:py-4",
            "focus:ring-2 focus:ring-blue-500",
            "transition-all duration-300",
            "border-0 border-b border-gray-300",
            "focus:border-blue-500",
            "placeholder:text-gray-400",
            "text-gray-700"
          )}
          error={errors.lastname}
        />
        <InputContact
          label="Email"
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={onChange}
          className={cn(
            "py-3 md:py-4",
            "focus:ring-2 focus:ring-blue-500",
            "transition-all duration-300",
            "border-0 border-b border-gray-300",
            "focus:border-blue-500",
            "placeholder:text-gray-400",
            "text-gray-700"
          )}
          error={errors.email}
        />
        <div className="relative">
          <Phonenumber
            initialPhone={formData.phone || "+256"}
            value={formData.phone || ""}
            onPhoneChange={(phone: string) =>
              onChange({
                target: { name: "phone", value: phone },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            className="w-full !rounded-xl !shadow-xl !border-green-300 focus:!border-green-500 focus:!ring-green-500 transition-all ease-in-out duration-300 transform hover:scale-105 my-3"
          />

          {errors.phone && (
            <span className="text-red-500 text-xs mt-1 ml-2">
              {errors.phone}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
          <InputContact
            label="Country"
            type="text"
            name="country"
            value={formData.country || ""}
            onChange={onChange}
            className={cn(
              "py-3 md:py-4",
              "focus:ring-2 focus:ring-blue-500",
              "transition-all duration-300",
              "border-0 border-b border-gray-300",
              "focus:border-blue-500",
              "placeholder:text-gray-400",
              "text-gray-700"
            )}
            error={errors.country}
          />
          <InputContact
            label="City"
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={onChange}
            className={cn(
              "py-3 md:py-4",
              "focus:ring-2 focus:ring-blue-500",
              "transition-all duration-300",
              "border-0 border-b border-gray-300",
              "focus:border-blue-500",
              "placeholder:text-gray-400",
              "text-gray-700"
            )}
            error={errors.city}
          />
        </div>
        <InputContact
          label="Password"
          type="password"
          name="password"
          value={formData.password || ""}
          onChange={onChange}
          className={cn(
            "py-3 md:py-4",
            "focus:ring-2 focus:ring-blue-500",
            "transition-all duration-300",
            "border-0 border-b border-gray-300",
            "focus:border-blue-500",
            "placeholder:text-gray-400",
            "text-gray-700"
          )}
          error={errors.password}
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 md:mt-6">
          <button
            type="button"
            className={cn(
              "bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-5 rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75",
              "transition-colors duration-200",
              "shadow-md hover:shadow-lg"
            )}
            onClick={handleGeneratePassword}
            aria-label="Generate Password"
            >
            Generate Password
          </button>
          <input
            type="number"
            value={passwordLength}
            onChange={(e) => setPasswordLength(parseInt(e.target.value, 10))}
            className={cn(
              "w-32 px-3 py-2 border rounded-md text-center",
              "focus:outline-none focus:ring-2 focus:ring-green-400",
              "text-gray-700",
              "border-gray-300 focus:border-green-500"
            )}
            min="8"
            aria-label="Password Length"
            placeholder="Length"
          />
        </div>
      </div>
    </div>
  );
};
