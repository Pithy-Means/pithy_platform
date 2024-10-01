import SocialMediaLinks from './SocialMediaLinks';
import ContactInfo from './ContactInfo';
import QuickLinks from './QuickLinks';

const Footer = () => {
  return (
    <div className='bg-black'>
      <div className="flex h-96">
        <div
          className="flex-1 bg-contain bg-no-repeat bg-left-bottom flex items-center justify-center text-white"
          style={{
            backgroundImage: "url('/assets/leftfooter.png')",
          }}
        />

        <div className='flex py-10 w-4/5 space-x-4'>
          <div className='flex flex-col w-1/5'>
            <div className='flex justify-between'>
              <div className='flex flex-col space-y-4'>
                <div className='flex space-x-4 items-center'>
                  <div className='p-1 bg-[#5AC35A] h-4 w-4 rounded-full'></div>
                  <p className='text-[#5AC35A] text-lg capitailze'>Pithy means</p>
                </div>
                <p className='text-white text-base'>Lorem psum aoka psuma lroe taray aoksa mdak djskas aso</p>
                <SocialMediaLinks className='text-white' />
              </div>
            </div>
          </div>
          <ContactInfo 
            title={'office usa'} 
            location={'1309 Coffeen Avenue STE 10269, Sheridan, WY 82801, USA'}
            email={'contact@pithymeans.com'}
            phone={'+1 (307) 374-0993 | +1 (307) 205-5983'}
            className='text-white'
          />
          <ContactInfo 
            title={'office uganda'} 
            location={'Plot No 546, ROFRA house, 4th Floor, Room No 2, Ggaba Road, Kansanga, Kampala.'}
            email={'pithymeansafrica@gmail.com'}
            phone={'+256 750 175 892 | +256 760 389 466 | 783184543'}
            className='text-white'
          />
          <QuickLinks />
        </div>
        <div
          className="flex-1 bg-contain bg-no-repeat bg-right-top flex items-center justify-center text-white"
          style={{
            backgroundImage: "url('/assets/rightfooter.png')",
          }}
        />
      </div>
    </div>
  )
}

export default Footer