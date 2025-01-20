import { FiCircle, FiCheckCircle } from "react-icons/fi";

type PersonInfoProps = {
  question: string;
  options: string[];
  description: string;
  selectedValue: string | null;
  onselect: (value: string | number) => void;
};

const PersonInfo: React.FC<PersonInfoProps> = ({
  question,
  options,
  description,
  selectedValue,
  onselect,
}) => {
  const handleOptionChange = (option: string | number) => {
    onselect(option);
  };

  return (
    <div className="flex flex-col p-4 z-50">
      <div className="p-6">
        {/* Question */}
        <h2 className="text-xl font-semibold text-center mb-2">{question}</h2>
        <p className="text-center text-gray-500 mb-6">{description}</p>

        {/* Options */}
        <div className="space-y-4">
          {options.map((label, index) => (
            <div
              key={index}
              className={`flex items-center p-4 border ${
                selectedValue === label
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-white"
              } rounded-lg cursor-pointer`}
              onClick={() => handleOptionChange(label)}
            >
              {selectedValue === label ? (
                <FiCheckCircle className="text-green-500 w-6 h-6" />
              ) : (
                <FiCircle className="text-gray-400 w-6 h-6" />
              )}
              <span className="ml-4 text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonInfo;
