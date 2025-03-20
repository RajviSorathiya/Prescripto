import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../Components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {
  const { docId } = useParams()
  const navigate = useNavigate()
  //const { doctors, currencySymbol,backendUrl,token,getDoctorsData,userData } = useContext(AppContext)
  const { doctors, currencySymbol,backendUrl,token,getDoctorsData,userData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  console.log(userData);

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    if (!docInfo) {
      navigate('/doctors')
      return
    }
    setDocInfo(docInfo)
  }

  const getAvailableSlots = () => {
    setDocSlots([])

    let today = new Date()
    let slots = []

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)
      
      let endTime = new Date(currentDate)
      endTime.setHours(21, 0, 0, 0)

      // Set start time
      if (i === 0) { // If today
        const currentHour = today.getHours()
        currentDate.setHours(currentHour >= 10 ? currentHour : 10)
        currentDate.setMinutes(today.getMinutes() >= 30 ? 30 : 0)
      } else {
        currentDate.setHours(10, 0, 0, 0)
      }

      let timeSlots = []
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })

        // Check if slot is available
        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = `${day}_${month}_${year}`
        
        // Only add slot if it's not in the booked slots
        if (!docInfo.slots_booked[slotDate] || !docInfo.slots_booked[slotDate].includes(formattedTime)) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })
        }
        
        // Increment time by 30 minutes
        currentDate = new Date(currentDate.getTime() + 30 * 60000)
      }

      // Only add day if it has available slots
      if (timeSlots.length > 0) {
        slots.push(timeSlots)
      }
    }

    setDocSlots(slots)
  }

  const bookAppointment = async() => {
    if(!token) {
      toast.warn('Please login to book appointment')
      return navigate('/login')
    }

    if(!slotTime) {
      toast.warn('Please select a time slot')
      return
    }

    try {
      const date = docSlots[slotIndex][0].datetime
      const day = date.getDate()
      const month = date.getMonth() + 1 
      const year = date.getFullYear()
      const slotDate = `${day}_${month}_${year}`

      const {data} = await axios.post(backendUrl + '/api/users/book-appointment',
        {
          docId,
          slotDate,
          slotTime,
          docData: docInfo,
          amount: docInfo.fees,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if(data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }

    } catch(error) {
      console.log(error)
      toast.error(error.message)

    }

  }

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo()
    }
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots()
    }
  }, [docInfo])

  if (!docInfo) {
    return null
  }

  return (
    <div>
      {/*----------------Doctors details----------------------*/}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-blue-50 w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt={docInfo.name} />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/*----------------Doc info: name, degree, experience ----------------------*/}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="verified" /></p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree}-{docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          {/*------------------doctor about----------------------------*/}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="info" /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span></p>
        </div>
      </div>
      {/*------------BOOKING SLOTS------------------*/}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlots.map((daySlots, index) => (
            daySlots.length > 0 && (
              <div 
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-blue-500 text-white' : 'border border-gray-500'}`} 
                key={index}
                onClick={() => setSlotIndex(index)}
              >
                <p>{daysOfWeek[daySlots[0].datetime.getDay()]}</p>
                <p>{daySlots[0].datetime.getDate()}</p>
              </div>
            )
          ))}
        </div>
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots[slotIndex]?.map((item, index) => (
            <p 
              onClick={() => setSlotTime(item.time)} 
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-blue-500 text-white' : 'text-gray-400 border border-gray-300'}`}
              key={index}
            >
              {item.time.toLowerCase()}

            </p>

          ))}
        </div>
        <button 
          className={`text-white text-sm font-light px-14 py-3 rounded-full my-6 ${slotTime ? 'bg-blue-500 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
          disabled={!slotTime || !docSlots[slotIndex]?.length}
          onClick={bookAppointment}
        >
          Book an appointment
        </button>
      </div>
      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </div>
  )
}

export default Appointment