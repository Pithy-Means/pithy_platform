// import DashboardLayout from '../layout';
import Communty from '@/components/communty';
import OverView from '@/components/OverView';
import PersonSidebar from '@/components/PersonSidebar';

import ShareSomething from '@/components/ShareSomething';
import React from 'react'

function Dashboard() {
  return (
    <>
      <div className='bg-white/90'>
        <div className='flex h-screen'>
          <OverView />
          <div className='w-full'>
            <ShareSomething />

          </div>
         <div className='flex flex-col mr-4'>
            <PersonSidebar />
            <Communty />

         </div>

         

        </div>


      </div>

    </>
  )
}

export default Dashboard;