import React from 'react'

const SectionTitle = ({text}) => {
  return (
    <div className='mx-10 sm:mx-[5%]'>
      <p className='text-xl md:text-2xl font-semibold lg:text-3xl text-primary sm:mt-5'>{text}</p>
    </div>
  )
}

export default SectionTitle
