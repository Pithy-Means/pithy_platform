import { BaseUserInfo } from "@/types/schema";
import InputContact from "./InputContact";
import Phonenumber from "./Phonenumber";

interface BasicInfoStepProps {
  formData: Partial<BaseUserInfo>;
  onChange: (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >
  ) => void;
}

// Component for basic information form step
export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  onChange,
}) => (
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
      />
      <InputContact
        label="Last name"
        type="text"
        name="lastname"
        value={formData.lastname || ""}
        onChange={onChange}
        className="py-6"
      />
      <InputContact
        label="Email"
        type="email"
        name="email"
        value={formData.email || ""}
        onChange={onChange}
        className="py-6"
      />
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
      <div className="flex flex-col md:flex-row items-center gap-3">
        <InputContact
          label="Country"
          type="text"
          name="country"
          value={formData.country || ""}
          onChange={onChange}
          className="py-6"
        />
        <InputContact
          label="City"
          type="text"
          name="city"
          value={formData.city || ""}
          onChange={onChange}
          className="py-6"
        />
        <InputContact
          label="Area"
          type="text"
          name="earlier"
          value={formData.earlier || ""}
          onChange={onChange}
          className="py-6"
        />
      </div>
      <InputContact
        label="Password"
        type="password"
        name="password"
        value={formData.password || ""}
        onChange={onChange}
        className="py-6"
      />
    </div>
  </div>
);
