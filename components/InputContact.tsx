import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface InputContactProps {
  label: string;
  type?: "text" | "email" | "number" | "tel" | "password";
  className?: string;
  isTextarea?: boolean;
  value: string;
  onChange?: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
}

const InputContact: React.FC<InputContactProps> = ({
  label,
  type = "text",
  className = "",
  isTextarea = false,
  value,
  onChange,
}) => {
  return (
    <div>
      <Label className="relative flex items-center">
        {isTextarea ? (
          <Textarea
            value={value}
            onChange={onChange}
            required
            className={`px-6 h-24 py-4 ${className} text-lg bg-white border rounded-lg border-black border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200`}
          />
        ) : (
          <Input
            type={type}
            value={value}
            onChange={onChange}
            required
            className={`px-6 h-10 ${className} text-lg bg-white border rounded-lg border-black border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200`}
          />
        )}
        <span className="text-lg text-black text-opacity-80 absolute top-0 left-0 mx-4 py-1 px-2 transition duration-200 input-text">
          {label}
        </span>
      </Label>
    </div>
  );
};

export default InputContact;
