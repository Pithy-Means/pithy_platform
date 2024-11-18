import React from 'react'
import Communty from '@/components/communty';
import OverView from '@/components/OverView';
import PersonSidebar from '@/components/PersonSidebar';
import ShareSomething from '@/components/ShareSomething';

function Dashboard() {
  return (
    <div className=''>
      <div className='bg-white/60'>
        <div className='flex space-x-4'>
          <OverView className='sticky top-0 h-screen'>

            <div className=' '>
              <div className=' h-screen'>

                <ShareSomething />
              </div>
            </div>
            <div className='flex flex-col mr-4  overflow-y-auto overflow-x-hidden w-1/4 sticky'>
              <PersonSidebar />
              <Communty />
            </div>
          </OverView>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;