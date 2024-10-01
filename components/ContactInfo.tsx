import { CiLocationOn, CiPhone } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";

interface ContactInfoProps {
  title: string;
  location: string;
  email: string;
  phone: string;
  className?: string; // Optional className for dynamic styling
}

const ContactInfo: React.FC<ContactInfoProps> = ({ title, location, email, phone, className }) => {
  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      <h1 className={`text-lg font-bold uppercase ${className}`}>{title}</h1>
      <div className='flex space-x-2'>
        <CiLocationOn className={`text-lg ${className}`} />
        <p className={`text-[12px] ${className}`}>{location}</p>
      </div>
      <div className='flex space-x-2'>
        <MdOutlineEmail className={`text-lg ${className}`} />
        <a href={`mailto:${email}`} className={`text-[12px] hover:underline ${className}`}>
          {email}
        </a>
      </div>
      <div className='flex space-x-2'>
        <CiPhone className={`text-lg ${className}`} />
        <a href={`tel:${phone.replace(/\s/g, '')}`} className={`text-[12px] hover:underline ${className}`}>
          {phone}
        </a>
      </div>
    </div>
  );
}

export default ContactInfo;
