'use client';

import React, { useState } from 'react';
import TitleDot from "@/components/TitleDot";
import SocialMediaLinks from '@/components/SocialMediaLinks';
import ContactInfo from '@/components/ContactInfo';
import { Card } from '@/components/ui/card';
import InputContact from "@/components/InputContact";

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = { name, email, phone, message };

    try {
      const res = await fetch('/api/emails/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setResponseMessage('Email sent successfully!');
      } else {
        setResponseMessage('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending form:', error);
      setResponseMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }
  };

  return (
    <div>
      <div className=''>
        <div className='flex justify-center bg-black items-center h-96'>
          <h3 className='text-lg text-[#5AC35A]'>Contact</h3>
        </div>
        <div className='bg-white overflow-hidden'>
          <div className='flex justify-between p-10'>
            <div className='flex flex-col space-y-8 w-full'>
              <div>
                <TitleDot title='get in touch' />
                <p className='text-base text-black capitalize'>
                  contact us for questions, feedback or support
                </p>
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
              <SocialMediaLinks className='text-black' />
            </div>
              {!responseMessage ? (
            <Card className='bg-white py-20 px-6 w-full'>
                <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
                <InputContact label='Name' type='text' className='w-full' value={name} onChange={(e) => setName(e.target.value)} />
                <InputContact label="Email" type="email" className='w-full' value={email} onChange={(e) => setEmail(e.target.value)} />
                <InputContact label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <InputContact label="Message" isTextarea={true} className="w-full" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button type='submit' className='bg-[#5AC35A] text-white py-2 rounded-lg' disabled={loading}>
                  {loading ? 'Sending...' : 'Submit'}
                </button>
              </form>
            </Card>
            ) : (
              <Card className='bg-[#5AC35A] py-10 px-6 w-full flex justify-center items-center'>
                <div className='flex flex-col space-y-8'>
                  <h3 className='text-black text-5xl font-extrabold capitalize'>Thank you</h3>
                  <div className='flex flex-col space-y-2 items-center'>
                    <div className='bg-[#1111116c] h-1 w-full rounded' />
                    <p className='text-black capitalize'>We’ll be in touch soon</p>
                  </div>
                </div>
              </Card>
            )}
            </div>
            <div className='h-24'>
              <div
                className="bg-contain bg-no-repeat bg-left-bottom"
                style={{
                  backgroundImage: "url('/assets/leftfooter.png')",
                  height: '300px',
                  width: '300px'
                }}
              />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
