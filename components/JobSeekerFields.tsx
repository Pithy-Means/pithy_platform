import { JobSeekerInfo } from "@/types/schema";
import InputContact from "./InputContact";

interface JobSeekerFieldsProps {
  data: Partial<JobSeekerInfo>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

// Component for job seeker-specific form fields
export const JobSeekerFields: React.FC<JobSeekerFieldsProps> = ({ data, onChange }) => (
  <div className="space-y-4">
    <InputContact
      label="Desired Job Title"
      type="text"
      name="desired_job_title"
      value={data.desired_job_title || ""}
      onChange={onChange}
    />
    <InputContact
      label="Skills"
      type="text"
      name="skills"
      value={data.skills || ""}
      onChange={onChange}
    />
    <InputContact
      label="Years of Work Experience"
      type="number"
      name="years_of_work_experience"
      value={data.years_of_work_experience?.toString() || ""}
      onChange={onChange}
    />
    <InputContact
      label="Resume Link"
      type="text"
      name="resume_link"
      value={data.resume_link || ""}
      onChange={onChange}
      isTextarea
    />
    <div className="mb-4">
      <label className="block text-gray-700">Availability Status</label>
      <select
        name="availability_status"
        value={data.availability_status || ""}
        onChange={onChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="">Select Availability</option>
        <option value="immediately available">Immediately Available</option>
        <option value="open to opportunities">Open to Opportunities</option>
      </select>
    </div>
  </div>
);