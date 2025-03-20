import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>Contact <span className='text-gray-700 font-semibold'>Us</span></p>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="contact" />
      </div>
      <div className='flex flex-col justify-center items-center gap-6 text-gray-600 mb-20'>
        <p className='text-lg font-semibold text-gray-600'>Our Office</p>
        <p className='text-gray-500'>
          54709 Willms Station <br/>
          Suite 350, Washington, USA
        </p>
        <p className='text-gray-500'>
          Tel: (415) 555-0132 <br/>
          Email: greatstackdev@gmail.com
        </p>
        <p className='text-lg font-semibold text-gray-600 mt-6'>Careers at PRESCRIPTO</p>
        <p className='text-gray-500'>Learn more about our teams and job openings.</p>
        <button className='bg-blue-500 text-white px-12 py-3 rounded-full hover:bg-blue-600 transition-colors'>
          Explore Jobs
        </button>
      </div>
    </div>
  )
}

export default Contact