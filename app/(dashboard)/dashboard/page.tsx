import Communty from '@/components/communty';
import OverView from '@/components/OverView';
import PersonSidebar from '@/components/PersonSidebar';

import ShareSomething from '@/components/ShareSomething';
import React from 'react'

function Dashboard() {
  return (
    <div className=''>
      <div className='bg-white/90'>
        <div className='flex space-x-4'>
          <OverView  className='sticky top-0 h-screen'>
            <div className='flex-1 overflow-y-auto h-screen'>
            <div className='w-full '>
              <ShareSomething  className=''/>
            </div>

            </div>
            <div className='flex flex-col mr-4  overflow-y-auto overflow-x-hidden'>
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