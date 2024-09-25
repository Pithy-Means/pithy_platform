import { FaYoutube, FaInstagram, FaTwitter } from 'react-icons/fa';

const SocialMediaLinks: React.FC = () => {
  return (
    <div className='flex flex-col'>
      <h3 className='text-xl font-bold text-white capitalize'>Follow us on</h3>
      <div className='flex space-x-4 items-center'>
        <a href="https://www.youtube.com/yourchannel" target="_blank" rel="noopener noreferrer">
          <FaYoutube color="#56cb44" size={24} />
        </a>
        <div className='bg-[#5AC35A] h-3 w-px' />
        <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
          <FaInstagram color="#56cb44" size={24} />
        </a>
        <div className='bg-[#5AC35A] h-3 w-px' />
        <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer">
          <FaTwitter color="#56cb44" size={24} />
        </a>
      </div>
    </div>
  );
};

export default SocialMediaLinks;
