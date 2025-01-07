import { EmployerInfo } from "@/types/schema";
import InputContact from "./InputContact";

interface EmployerFieldsProps {
  data: Partial<EmployerInfo>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

// Component for employer-specific form fields
export const EmployerFields: React.FC<EmployerFieldsProps> = ({ data, onChange }) => (
  <div className="space-y-4">
    <InputContact
      label="Company Name"
      type="text"
      name="company_name"
      value={data.company_name || ""}
      onChange={onChange}
    />
    <div className="mb-4">
      <label className="block text-gray-700">Company Size</label>
      <select
        name="company_size"
        value={data.company_size || ""}
        onChange={onChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="">Select Company Size</option>
        <option value="1-10 employees">1-10 employees</option>
        <option value="11-50 employees">11-50 employees</option>
        <option value="51-200 employees">51-200 employees</option>
        <option value="201-500 employees">201-500 employees</option>
        <option value="501+ employees">501+ employees</option>
      </select>
    </div>
    <InputContact
      label="Industry Type"
      type="text"
      name="industry_type"
      value={data.industry_type || ""}
      onChange={onChange}
    />
    <InputContact
      label="Position in Company"
      type="text"
      name="position_in_company"
      value={data.position_in_company || ""}
      onChange={onChange}
    />
    <InputContact
      label="Job Posting Count"
      type="number"
      name="job_posting_count"
      value={data.job_posting_count?.toString() || ""}
      onChange={onChange}
    />
  </div>
);