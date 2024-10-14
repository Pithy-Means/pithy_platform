'useclient'
import OverView from '@/components/OverView';

import ShareSomething from '@/components/ShareSomething';
import React from 'react'

function Dashboard() {
  return (
    <>
      <div className=''>
        <div className='flex h-screen'>
          <OverView />
          <ShareSomething />
         
        </div>


      </div>

    </>
  )
}

export default Dashboard;