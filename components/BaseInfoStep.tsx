// components/BaseInfoStep.tsx
import { BaseUserInfo } from "@/types/schema";
import InputContact from "./InputContact";
import Phonenumber from "./Phonenumber";
import { useEffect, useState } from "react";
import { baseUserSchema } from "@/lib/validations/auth-schema";
import { z } from "zod";

interface BasicInfoStepProps {
  formData: Partial<BaseUserInfo>;
  onChange: (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >,
  ) => void;
  updateFormErrors?: (errors: Record<string, string>) => void;
}

// Component for basic information form step
export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  onChange,
  updateFormErrors
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate form fields when data changes
  useEffect(() => {
    try {
      baseUserSchema.parse(formData);
      // Clear errors if validation passes
      setErrors({});
      // Update parent errors state if provided
      if (updateFormErrors) updateFormErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0];
          fieldErrors[field as string] = err.message;
        });
        setErrors(fieldErrors);
        // Update parent errors state if provided
        if (updateFormErrors) updateFormErrors(fieldErrors);
      }
    }
  }, [formData, updateFormErrors]);

  return (
    <div className="w-full relative px-8">
      {/* Form Fields with Enhanced Layout */}
      <div className="w-full mx-auto flex flex-col space-y-5">
        {/* Left Column */}
        <InputContact
          label="First name"
          type="text"
          name="firstname"
          value={formData.firstname || ""}
          onChange={onChange}
          className="py-6"
          error={errors.firstname}
        />
        <InputContact
          label="Last name"
          type="text"
          name="lastname"
          value={formData.lastname || ""}
          onChange={onChange}
          className="py-6"
          error={errors.lastname}
        />
        <InputContact
          label="Email"
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={onChange}
          className="py-6"
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
            <span className="text-red-500 text-xs mt-1 ml-2">{errors.phone}</span>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
            <InputContact
              label="Country"
              type="text"
              name="country"
              value={formData.country || ""}
              onChange={onChange}
              className="py-6 col-span-1"
              error={errors.country}
            />
            <InputContact
              label="City"
              type="text"
              name="city"
              value={formData.city || ""}
              onChange={onChange}
              className="py-6 col-span-1"
              error={errors.city}
            />
        </div>
        <InputContact
          label="Password"
          type="password"
          name="password"
          value={formData.password || ""}
          onChange={onChange}
          className="py-6"
          error={errors.password}
        />
      </div>
    </div>
  );
};