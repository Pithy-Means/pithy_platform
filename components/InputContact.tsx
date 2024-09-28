interface InputContactProps {
  label: string;
  type?: 'text' | 'email' | 'number' | 'tel';
  className?: string;
  isTextarea?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

const InputContact: React.FC<InputContactProps> = ({
  label,
  type = 'text',
  className = '',
  isTextarea = false,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="relative flex items-center">
        {isTextarea ? (
          <textarea
            value={value}
            onChange={onChange}
            className={`px-6 h-24 ${className} text-lg bg-white border rounded-lg border-black border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            className={`px-6 h-10 ${className} text-lg bg-white border rounded-lg border-black border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200`}
          />
        )}
        <span className="text-lg text-black text-opacity-80 absolute top-0 left-0 mx-4 py-1 px-2 transition duration-200 input-text">
          {label}
        </span>
      </label>
    </div>
  );
};

export default InputContact;
