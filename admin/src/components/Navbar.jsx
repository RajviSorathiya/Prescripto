import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const { aToken, adminLogout } = useContext(AdminContext)
    const { dToken, doctorLogout } = useContext(DoctorContext)
    const navigate = useNavigate()

    const logout = () => {
      navigate('/')
      
      // Admin logout
      if (aToken) {
        adminLogout()
      }
      
      // Doctor logout
      if (dToken) {
        doctorLogout()
      }
    }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
        <div className='flex item-center gap-2 text-xs'> 
            <img className='w-36 sm:w-40 cursor-pointer' src ={assets.admin_logo} alt=""/>
            <p className='border px-2.5 py-0.5 rounded-md border-gray-500 text-gray-600'>{aToken ? 'Admin' : 'Doctor'}</p>
        </div>
        <button onClick={logout} className='bg-blue-500 text-white text-sm px-10 py-2 rounded-full hover:bg-blue-600 transition-colors'>Logout</button>
    </div>
  )
}

export default Navbar