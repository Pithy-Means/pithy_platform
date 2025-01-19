import { BaseUserInfo } from "@/types/schema";
import InputContact from "./InputContact";

interface BasicInfoStepProps {
  formData: Partial<BaseUserInfo>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

// Component for basic information form step
export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  onChange,
}) => (
  <div className="w-full relative px-8">
    {/* Background Decorative Elements */}


    {/* Header */}
    <h2 className="text-3xl font-extrabold text-green-700 mb-12 text-center tracking-wide">
      Let&apos;s Build Your Profile Together
    </h2>
    <p className="text-center text-green-600 mb-10 text-lg font-medium">
      Fill out your basic details below, and we’ll tailor your experience.
    </p>

    {/* Form Fields with Enhanced Layout */}
    <div className="grid grid-cols-12 gap-x-8 gap-y-10">
      {/* Left Column */}
      <div className="col-span-12 lg:col-span-6 space-y-8">
        <InputContact
          label="First Name"
          type="text"
          name="firstname"
          value={formData.firstname || ""}
          onChange={onChange}
          className="!rounded-2xl !shadow-xl !border-green-300 focus:!border-green-500 focus:!ring-green-500 transition-all ease-in-out duration-300 transform hover:scale-105"
        />
        <InputContact
          label="Last Name"
          type="text"
          name="lastname"
          value={formData.lastname || ""}
          onChange={onChange}
          className="!rounded-2xl !shadow-xl !border-green-300 focus:!border-green-500 focus:!ring-green-500 transition-all ease-in-out duration-300 transform hover:scale-105"
        />
        <InputContact
          label="Email"
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={onChange}
          className="!rounded-2xl !shadow-xl !border-green-300 focus:!border-green-500 focus:!ring-green-500 transition-all ease-in-out duration-300 transform hover:scale-105"
        />
      </div>

      {/* Right Column */}
      <div className="col-span-12 lg:col-span-6 space-y-8">
        <InputContact
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone || ""}
          onChange={onChange}
          className="!rounded-2xl !shadow-xl !border-green-300 focus:!border-green-500 focus:!ring-green-500 transition-all ease-in-out duration-300 transform hover:scale-105"
        />
        <InputContact
          label="Address"
          type="text"
          name="address"
          value={formData.address || ""}
          onChange={onChange}
          className="!rounded-2xl !shadow-xl !border-green-300 focus:!border-green-500 focus:!ring-green-500 transition-all ease-in-out duration-300 transform hover:scale-105"
        />
        <InputContact
          label="Password"
          type="password"
          name="password"
          value={formData.password || ""}
          onChange={onChange}
          className="!rounded-2xl !shadow-xl !border-green-300 focus:!border-green-500 focus:!ring-green-500 transition-all ease-in-out duration-300 transform hover:scale-105"
        />
      </div>
    </div>

    {/* Bottom Note */}
    <div className="mt-12 text-center">
      <p className="text-sm text-gray-600">
        We value your privacy. By continuing, you agree to our{" "}
        <a href="#" className="text-green-600 font-medium underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  </div>
);
