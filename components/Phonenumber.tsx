import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/material.css'

interface PhonenumberProps {
  initialPhone?: string;
  value?: string;
  country?: string;
  className?: string;
  onPhoneChange?: (phone: string) => void;
}

const Phonenumber: React.FC<PhonenumberProps> = ({
  initialPhone = "",
  country = "UG",
  value = "",
  className = "",
  onPhoneChange,
}) => {
  const [phone, setPhone] = useState<string>(initialPhone);

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (onPhoneChange) {
      onPhoneChange(value);
    }
  };

  return (
    <PhoneInput
      country={country}
      placeholder="Enter your phone number"
      value={value || phone}
      onChange={handlePhoneChange}
      masks={{ UG: "+... (..) ... ...." }}
      inputProps={{
        name: "phone",
        required: true,
        "aria-label": "Phone number input",
      }}
      containerClass={`z-50 bg-white border border-r-0 rounded-lg shadow-sm transition focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 ${className}`}
      inputClass="w-full px-4 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 py-4"
    />
  );
};

export default Phonenumber;
