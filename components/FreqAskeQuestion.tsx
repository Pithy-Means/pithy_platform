import { Card } from "./ui/card";
import { ArrowLeft, ArrowDownLeft } from 'lucide-react';
import TitleDot from "./TitleDot";

const arraybutton = [
  {name: 'general'}, {name: 'assement & results'}, {name: 'pricing & payment'}, {name: 'technical issues'}, {name: 'partnership & affiliates'}, {name: 'support'}
]

const FreqAskeQuestion = () => {
  return (
    <div className='px-10 py-4 bg-white'>
      <div className='flex flex-col space-y-4'>
        <TitleDot title='Frequently asked questions' />
        <p className='capitalize text-black'>Get answers to your questions about pithy means</p>
        <div className='flex space-x-4 items-center'>
          {arraybutton.map((arr, index) => (
            <button 
              key={index} 
              className='px-4 py-2 text-black border border-black rounded capitalize'>
              {arr.name}
            </button>
          ))}
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <Card className='bg-white p-5'>
            <div className='flex justify-between py-2'>
              <h3 className='text-xl text-black capitalize font-extrabold'>what is pithy means?</h3>
              <div className='bg-[#5AC35A] p-1 rounded-full'>
                <ArrowLeft />
              </div>
            </div>
            <p className='text-black capitalize'>Pithy means is career and business assessment platform helping students, professionals, and business adventurers find their most suitable study, professional, or business areas.</p>
          </Card>
          <Card className='bg-white pt-5 px-5 row-span-1/2'>
            <div className='flex justify-between py-1'>
              <h3 className='text-xl text-black capitalize font-extrabold'>how does pithy means work?</h3>
              <div className='bg-[#5AC35A] p-1 rounded-full'>
                <ArrowLeft />
              </div>
            </div>
            <p className='text-black capitalize'>take our online assessment, receive personalized results, and explore suitable career and business paths.</p>
          </Card>
          <Card className='bg-white p-5'>
            <div className='flex justify-between py-1'>
              <h3 className='text-xl text-black capitalize font-extrabold'>Is pithy means trustworthy?</h3>
              <div className='border p-1 rounded-full'>
                <ArrowDownLeft className='text-[#5AC35A]' />
              </div>
            </div>
          </Card>
          <Card className='bg-white p-5'>
            <div className='flex justify-between py-1'>
              <h3 className='text-xl text-black capitalize font-extrabold'>is pithy means only in the USA and Uganda?</h3>
              <div className='border p-1 rounded-full'>
                <ArrowDownLeft className='text-[#5AC35A]' />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default FreqAskeQuestion