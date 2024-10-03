import { CiLocationOn, CiPhone } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";

interface ContactInfoProps {
  title: string;
  location: string;
  email: string;
  phone: string | string[];
  className?: string; // Optional className for dynamic styling
}

const ContactInfo: React.FC<ContactInfoProps> = ({ title, location, email, phone, className }) => {
  const phoneNumbers = Array.isArray(phone) ? phone : [phone];
  return (
    <div className={`flex flex-col space-y-4 text-center ${className}`}>
      <h1 className={`text-lg md:text-xl lg:text-2xl font-bold uppercase  md:text-left ${className}`}>{title}</h1>
      <div className='flex flex-col items-center md:flex-row md:items-start space-x-2 md:space-x-4'>
        <CiLocationOn className={`text-lg md:text-xl lg:text-2xl ${className}`} />
        <p className={`text-[12px] md:text-sm lg:text-base text-center md:text-start w-full md:w-auto${className}`}>{location}</p>
      </div>
      <div className='flex flex-col items-center md:flex-row md:items-start  md:space-x-4 space-x-2'>
        <MdOutlineEmail className={`text-lg md:text-xl lg:text-2xl  ${className}`} />
        <a href={`mailto:${email}`} className={`text-[12px] hover:underline md:text-sm lg:text-base  ${className}`}>
          {email}
        </a>
      </div>
      {/* <div className='flex flex-col items-center md:flex-row md:items-start  md:space-x-4 space-x-2'>
        <CiPhone className={`text-lg md:text-xl lg:text-2xl ${className}`} />
        <a href={`tel:${phone.replace(/\s/g, '')}`} className={`text-[12px] hover:underline md:text-sm lg:text-base text-start ${className}`}>
          {phone}
        </a>
      </div> */}
      <div className={`flex flex-col  md:flex-row md:items-start ${className}`}>
        {phoneNumbers.map((phone: string, index: number) => (
          <div key={index} className="flex flex-col items-center space-x-2 md:w-auto">
            <CiPhone className={`text-lg md:text-xl lg:text-2xl ${className}`} />
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className={`text-[12px] hover:underline md:text-sm lg:text-base text-start ${className}`}
            >
              {phone}
            </a>
            {index < phoneNumbers.length - 1 && (
              <span className='hidden md:inline'>|</span>)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContactInfo;
