import { StudentInfo } from "@/types/schema";
import InputContact from "./InputContact";

interface StudentFieldsProps {
  data: Partial<StudentInfo>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
}

// Component for student-specific form fields
export const StudentFields: React.FC<StudentFieldsProps> = ({
  data,
  onChange,
}) => (
  <div className="space-y-4">
    <div className="mb-4">
      <label className="block text-gray-700">Education Level</label>
      <select
        name="education_level"
        value={data.education_level || ""}
        onChange={onChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="">Select Education Level</option>
        <option value="High School">High School</option>
        <option value="Tertiary">Tertiary</option>
        <option value="Diploma">Diploma</option>
        <option value="Bachelors">Bachelors</option>
        <option value="Masters">Masters</option>
        <option value="PhD">PhD</option>
      </select>
    </div>
    <InputContact
      label="Institution Name"
      type="text"
      name="institution_name"
      value={data.institution_name || ""}
      onChange={onChange}
    />
    <InputContact
      label="Major Subject"
      type="text"
      name="major_subject"
      value={data.major_subject || ""}
      onChange={onChange}
    />
    <InputContact
      label="Expected Graduation Year"
      type="number"
      name="expected_graduation_year"
      value={data.expected_graduation_year?.toString() || ""}
      onChange={onChange}
    />
  </div>
);
