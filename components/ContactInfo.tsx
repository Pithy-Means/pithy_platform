import { CiLocationOn, CiPhone } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";

interface ContactInfoProps {
  title: string;
  location: string;
  email: string;
  phone: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ title, location, email, phone }) => {
  return (
    <div className='flex flex-col space-y-4 w-1/5'>
      <h1 className='text-xl font-bold text-white uppercase'>{title}</h1>
      <div className='flex space-x-2'>
        <CiLocationOn className="text-white text-lg" />
        <p className='text-white text-[12px]'>{location}</p>
      </div>
      <div className='flex space-x-2'>
        <MdOutlineEmail className="text-white text-lg" />
        <a href={`mailto:${email}`} className='text-white text-[12px] hover:underline'>
          {email}
        </a>
      </div>
      <div className='flex space-x-2'>
        <CiPhone className="text-white text-lg" />
        <a href={`tel:${phone.replace(/\s/g, '')}`} className='text-white text-[12px] hover:underline'>
          {phone}
        </a>
      </div>
    </div>
  );
}

export default ContactInfo;
