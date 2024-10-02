import React from 'react'
import TitleDot from './TitleDot'
import Image from 'next/image'

const DiscoverFit = () => {
  return (
    <div className='flex flex-col bg-white p-10  w-full'>
      <div className='text-black'>
        <div>
          <TitleDot title={'Discover Your Perfect Fit'} />
          <p>Our 3-step process to guide you to your ideal career or business path</p>
        </div>
        <div className='w-4/5 my-10'>
          <div className='flex space-x-6'>
            <div className='relative flex flex-col items-center'>
              <div className='relative z-10'>
                <Image src='/assets/one.png' alt='step 1' width={50} height={50} />
              </div>
              <div className='relative h-28 -mt-2 mr-2'>
                <Image src='/assets/lineone.png' alt='line 1' width={42} height={70} />
              </div>
              <div className='relative z-10 mt-20'>
                <Image src='/assets/two.png' alt='step 2' width={50} height={50} />
              </div>
              <div className='relative h-48 -mt-1 '>
                <Image src='/assets/linetwo.png' alt='line 2 ' width={30} height={70} />
              </div>
              <div className='relative z-10 mt-6'>
                <Image src='/assets/three.png' alt='step 3' width={50} height={50} />
              </div>
            </div>

            <div className='flex flex-col space-y-10'>
              <div className='flex flex-row items-center space-x-4'>
                <div className='flex flex-col space-y-4'>
                  <h2 className='font-bold text-2xl'>Take Our Assessment</h2>
                  <p className=''>Answer our comprehensive questionnaire, designed to identify your <br />strengths, interests, and values.</p>
                  <div className='flex flex-row items-center justify-between'>
                    <ul className='flex flex-col space-y-3'>
                      <li className='flex space-x-3 items-center'>
                        <div className='border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5'></div>
                        <p>15 -minute assessment</p>
                      </li>
                      <li className='flex space-x-3 items-center'>
                        <div className='border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5'></div>
                        <p>~100 questions</p>
                      </li>
                      <li className='flex space-x-3 items-center'>
                        <div className='border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5'></div>
                        <p>our Proprietary algorithm analyzes your responses.</p>
                      </li>
                    </ul>

                  </div>
                </div>
                <Image
                  src='/assets/Frame 87.png'
                  width={100}
                  height={100}
                  alt='DiscoverFit'
                  className='' />
              </div>
              <div className='flex flex-row items-center space-x-4'>
                <div className='flex flex-col space-y-4'>
                  <h2 className='font-bold text-2xl'>Get Personalized Results</h2>
                  <p className=''>Receive a detailed report highlighting your most suitable career or <br /> business paths.</p>
                  <div className='flex flex-row items-center  justify-between'>
                    <div className='flex flex-row items-center justify-between'>
                      <ul className='flex flex-col space-y-3'>
                        <li className='flex space-x-3 items-center'>
                        <div className='border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5'></div>
                          <p>Customized report</p>
                          </li>
                        <li className='flex space-x-3 items-center'>
                        <div className='border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5'></div>
                          <p>Career and business recommendations</p>
                          </li>
                        <li className='flex space-x-3 items-center'>
                        <div className='border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5'></div>
                          <p>Actionable insights</p>
                          </li>
                      </ul>
                    </div>
                    <Image
                      src='/assets/Frame 88.png'
                      width={100}
                      height={100}
                      alt='DiscoverFit'
                      className='' />

                  </div>
                </div>
              </div>
              <div className='flex flex-row items-center space-x-4'>
                <div className='flex flex-col space-y-4'>
                  <h2 className='font-bold text-2xl'>Actionable insights</h2>
                  <p className=''>Review your results, explore recommended paths, and start making informed decisions.</p>
                  <div className='flex flex-row items-center justify-between'>
                    <div className='flex flex-row items-center justify-between'>
                    <ul className='flex flex-col space-y-3'>
                      <li className='flex space-x-3 items-center'>
                      <div className='border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5'></div>
                        <p>Career and business resources (courses & Community)</p>
                        </li>
                      <li className='flex space-x-3 items-center'>
                      <div className='border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5'></div>
                        <p>Guidance and support</p>
                        </li>
                      <li className='flex space-x-3 items-center'>
                      <div className='border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5'></div>
                        <p>Ongoing assessment and refinement</p>
                        </li>
                    </ul>
                    </div>
                    <Image
                      src='/assets/Frame 89.png'
                      width={100}
                      height={100}
                      alt='DiscoverFit'
                      className='' />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default DiscoverFit