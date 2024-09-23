import React from 'react'
import Header_description from './Header_description'
import CardImage from './CardImage'

const BodySection = () => {
  return (
    <div className='flex justify-between items-center px-10 py-28 bg-black'>
    <Header_description />
    <div>
      <CardImage />
    </div>
  </div>
  )
}

export default BodySection;