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
    <div className="w-full">
      <PhoneInput
        country={country}
        placeholder="Enter your phone number"
        value={value || phone}
        onChange={handlePhoneChange}
        masks={{ UG: "... (..) ... ...." }}
        inputProps={{
          name: "phone",
          required: true,
          "aria-label": "Phone number input",
          className: "w-full"
        }}
        containerClass={`z-50 bg-white border rounded-lg shadow-sm transition focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 max-w-full ${className}`}
        inputStyle={{
          width: "100%",
          height: "60px",
          fontSize: "16px"
        }}
        buttonStyle={{
          borderRadius: "8px 0 0 8px"
        }}
        containerStyle={{
          width: "100%"
        }}
      />
    </div>
  );
};

export default Phonenumber;