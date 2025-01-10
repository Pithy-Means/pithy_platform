import { BaseUserInfo } from "@/types/schema";
import InputContact from "./InputContact";

interface BasicInfoStepProps {
  formData: Partial<BaseUserInfo>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

// Component for basic information form step
export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ formData, onChange }) => (
  <div className="w-full max-w-md space-y-4">
    <InputContact
      label="First Name"
      type="text"
      name="firstname"
      value={formData.firstname || ""}
      onChange={onChange}
    />
    <InputContact
      label="Last Name"
      type="text"
      name="lastname"
      value={formData.lastname || ""}
      onChange={onChange}
    />
    <InputContact
      label="Email"
      type="email"
      name="email"
      value={formData.email || ""}
      onChange={onChange}
    />
    <InputContact
      label="Phone"
      type="tel"
      name="phone"
      value={formData.phone || ""}
      onChange={onChange}
    />
    <InputContact
      label="Address"
      type="text"
      name="address"
      value={formData.address || ""}
      onChange={onChange}
    />
    <InputContact
      label="Password"
      type="password"
      name="password"
      value={formData.password || ""}
      onChange={onChange}
    />
  </div>
);