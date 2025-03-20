import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const MyAppointments = () => {
  const  {docData} = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const { backendUrl, token ,getDoctorsData} = useContext(AppContext);
  
  const months =["jan","feb", "mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]
  
  // const[appoinments,setAppointments] =useState([])
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl+"/api/users/appointments", {
        headers: { 
          Authorization:`Bearer ${token}`
         },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  // useEffect(() => {
  //   // TODO: Fetch user's appointments from backend API
  //   // For now using dummy data
  //   setAppointments(doctors.slice(0, 3))
  // }, [doctors])

  const cancelAppointment = async(appointmentId) => {
    try {
      console.log('Attempting to cancel appointment:', appointmentId);
      
      const { data } = await axios.post(
        backendUrl + '/api/users/cancel-appointment',
        { appointmentId },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if(data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message || 'Error cancelling appointment');
      }

    } catch (error) {
      console.error('Cancel appointment error:', error);
      if (error.response) {
        toast.error(error.response.data.message || 'Failed to cancel appointment');
      } else {
        toast.error('Network error while cancelling appointment');
      }
    }
  }


  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 pt-24 pb-16">
      <h1 className="text-2xl font-medium mb-6">My Appointments</h1>
      <div className="space-y-4">
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
            key={index}
          >
            <div>
              <img
                className="w-32 h-32 object-cover bg-indigo-50 rounded-lg"
                src={item.docData.image}
                alt=''
              />
            </div>

            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-2">Address:</p>
              <p className="text-xs">{item.docData.address?.line1}</p>
              <p className="text-xs">{item.docData.address?.line2}</p>
              <p className="text-xs mt-2">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:{" "}
                </span>
                {item.slotDate.split('_').join('/')} | {item.slotTime}
              </p>
            </div>

            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled &&<button
                className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-500 hover:text-white transition-all duration-300"
                onClick={() => {
                  /* TODO: Implement payment handling */
                }}>
                Pay Online
              </button>}
              
              {!item.cancelled && <button
                className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300"
                onClick={() => cancelAppointment(item._id)}>
                Cancel Appointment
              </button>}
              {/* <button
                className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300"
                onClick={() => cancelAppointment(item._id)}>
                Cancel Appointment
              </button> */}
              {item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500 '>Appointment cancelled</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
