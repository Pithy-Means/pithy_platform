'use client';

import React, { useEffect, useState } from 'react';
import TitleDot from "@/components/TitleDot";
import SocialMediaLinks from '@/components/SocialMediaLinks';
import ContactInfo from '@/components/ContactInfo';
import { Card } from '@/components/ui/card';
import InputContact from "@/components/InputContact";
import ReCaptcha from "@/utils/index";

const Contact = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [token, setToken] = useState('');
  const [submitEnabled, setSubmitEnabled] = useState(false);

  useEffect(() => {
    if (token.length) {
      setSubmitEnabled(true);
    }
  }, [token])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { name, email, phone, message };
    console.log('Message Sent:', formData);
    // Here, you could send the data to an API or a backend service
    // Reset the form after submission if needed
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const handleToken = (token: string) => {
    setToken(token);
  }

  return (
    <div className=''>
      <div className=''>
        <div className='flex justify-center bg-black items-center h-96'>
          <h3 className='text-lg text-[#5AC35A]'>Contact</h3>
        </div>
        <div className='bg-white p-10 flex justify-between'>
          <div className='flex flex-col space-y-8 w-full'>
            <div>
              <TitleDot title='get in touch' />
              <p className='text-base text-black capitalize'>contact us for questions, feedback or support</p>
            </div>
            <ContactInfo 
              title={'office usa'} 
              location={'1309 Coffeen Avenue STE 10269, Sheridan, WY 82801, USA'}
              email={'contact@pithymeans.com'}
              phone={'+1 (307) 374-0993 | +1 (307) 205-5983'}
              className='text-black'
            />
            <ContactInfo 
              title={'office uganda'} 
              location={'Plot No 546, ROFRA house, 4th Floor, Room No 2, Ggaba Road, Kansanga, Kampala.'}
              email={'pithymeansafrica@gmail.com'}
              phone={'+256 750 175 892 | +256 760 389 466 | 783184543'}
              className='text-black'
            />
              <SocialMediaLinks
                className='text-black'
               />
          </div>
          <Card className='bg-white py-20 px-6 w-full'>
            <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
              <InputContact label='Name' type='text' className='w-full' value={name} onChange={(e) => setName(e.target.value)} />
              <InputContact label="Email" type="email" className='w-full' value={email} onChange={(e) => setEmail(e.target.value)} />
              <InputContact label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <InputContact label="Message" isTextarea={true} className="w-full" value={message} onChange={(e) => setMessage(e.target.value)} />
              <button disabled={!submitEnabled} className={`${submitEnabled ? 'bg-gradient-to-t from-[#5AC35A] to-[#00AE76]' : 'bg-gray-600 cursor-not-allowed'}text-white py-2 px-4 rounded-md w-fit mx-auto`}>Submit</button>
              <ReCaptcha sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string} callback={handleToken} />
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Contact;