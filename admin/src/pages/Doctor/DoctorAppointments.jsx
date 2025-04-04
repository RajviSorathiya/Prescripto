import React, { useContext, useEffect, useState, useCallback } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorAppointments = () => {
  const { dToken, appointments, setAppointments, backendUrl } = useContext(DoctorContext);
  const { calculateAge, slotDataFormat, currency } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filter, setFilter] = useState("all"); // all, today, upcoming, completed

  // Use useCallback to memoize the function so it doesn't cause infinite renders
  const fetchAppointments = useCallback(async () => {
    if (!dToken) return;
    
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/appointments', {
        headers: { dToken: `Bearer ${dToken}` }
      });
      
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error(error.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [dToken, backendUrl, setAppointments]);

  // This effect will only run once when the component mounts and when dToken changes
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleComplete = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/doctor/complete-appointment',
        { appointmentId: id },
        { headers: { dToken: `Bearer ${dToken}` } }
      );
      
      if (data.success) {
        toast.success(data.message || "Appointment marked as completed");
        // Refresh appointments after completion
        fetchAppointments();
        setSelectedAppointment(null);
      } else {
        toast.error(data.message || "Failed to complete appointment");
      }
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error(error.message || "An error occurred");
    }
  };

  const handleCancel = async (id) => {
    try {
      // Replace with your actual API endpoint for cancelling appointments
      const { data } = await axios.post(
        backendUrl + '/api/doctor/cancel-appointment',
        { appointmentId: id },
        { headers: { dToken: `Bearer ${dToken}` } }
      );
      
      if (data.success) {
        toast.success(data.message || "Appointment cancelled");
        // Refresh appointments after cancellation
        fetchAppointments();
        setSelectedAppointment(null);
      } else {
        toast.error(data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error(error.message || "An error occurred");
    }
  };

  const filteredAppointments = () => {
    if (filter === "all") return appointments;
    
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '_');
    
    if (filter === "today") {
      return appointments.filter(app => app.slotDate === today);
    } else if (filter === "completed") {
      return appointments.filter(app => app.isCompleted);
    } else if (filter === "upcoming") {
      return appointments.filter(app => !app.isCompleted && !app.cancelled);
    }
    
    return appointments;
  };

  return (
    <div className="w-full max-w-6xl m-5 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Appointments</h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchAppointments}
            className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            Refresh
          </button>
          <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
            <button 
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md text-sm transition-all duration-300 ${filter === "all" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("today")}
              className={`px-4 py-2 rounded-md text-sm transition-all duration-300 ${filter === "today" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
            >
              Today
            </button>
            <button 
              onClick={() => setFilter("upcoming")}
              className={`px-4 py-2 rounded-md text-sm transition-all duration-300 ${filter === "upcoming" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-md text-sm transition-all duration-300 ${filter === "completed" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border rounded-lg shadow-sm p-8 flex justify-center items-center min-h-[50vh]">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white border rounded-lg shadow-sm p-8 text-center min-h-[50vh] flex flex-col justify-center">
          <img src={assets.appointment_icon} alt="No appointments" className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-gray-700">No appointments found</h3>
          <p className="text-gray-500 mt-2">You don't have any appointments yet.</p>
        </div>
      ) : filteredAppointments().length === 0 ? (
        <div className="bg-white border rounded-lg shadow-sm p-8 text-center min-h-[50vh] flex flex-col justify-center">
          <img src={assets.appointment_icon} alt="No appointments" className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-gray-700">No matching appointments</h3>
          <p className="text-gray-500 mt-2">There are no appointments matching your filter criteria.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] gap-1 py-4 px-6 bg-gray-50 border-b font-medium text-gray-600">
            <p>#</p>
            <p>Patient</p>
            <p>Payment</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Fees</p>
            <p>Action</p>
          </div>

          {/* Table body */}
          <div className="divide-y max-h-[70vh] overflow-y-auto">
            {filteredAppointments().map((item, index) => (
              <div
                key={index}
                className={`flex flex-wrap items-center justify-between max-sm:gap-3 sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] text-gray-600 py-4 px-6 hover:bg-blue-50 transition-colors duration-200 ${
                  item.isCompleted ? "bg-green-50" : item.cancelled ? "bg-red-50" : ""
                }`}
                onClick={() => setSelectedAppointment(item)}
              >
                <p className="max-sm:hidden">{index + 1}</p>
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    src={item.userData?.image || "https://via.placeholder.com/40"}
                    alt={item.userData?.name}
                  />
                  <div>
                    <p className="font-medium">{item.userData?.name}</p>
                    <p className="text-xs text-gray-500">{item.userData?.email}</p>
                  </div>
                </div>
                <div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    item.payment ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {item.payment ? "online" : "cash"}
                  </span>
                </div>
                <p className="max-sm:hidden">{item.userData?.dob ? calculateAge(item.userData.dob) : 'N/A'}</p>
                <div>
                  <p className="font-medium">{slotDataFormat(item.slotDate)}</p>
                  <p className="text-sm text-gray-500">{item.slotTime}</p>
                </div>
                <p className="font-medium">{currency}{item.amount}</p>
                <div className="flex gap-2">
                  {!item.isCompleted && !item.cancelled ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel(item._id);
                        }}
                        className="p-2 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                        title="Cancel appointment"
                      >
                        <img className="w-5 h-5" src={assets.cancel_icon} alt="Cancel" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComplete(item._id);
                        }}
                        className="p-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
                        title="Complete appointment"
                      >
                        <img className="w-5 h-5" src={assets.tick_icon} alt="Complete" />
                      </button>
                    </>
                  ) : (
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      item.isCompleted ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {item.isCompleted ? "Completed" : "Cancelled"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden animate-scaleIn">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Appointment Details</h3>
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={selectedAppointment.userData?.image || "https://via.placeholder.com/60"} 
                  alt={selectedAppointment.userData?.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <h4 className="text-xl font-semibold">{selectedAppointment.userData?.name}</h4>
                  <p className="text-gray-500">{selectedAppointment.userData?.dob ? `${calculateAge(selectedAppointment.userData.dob)} years old` : 'Age not available'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{slotDataFormat(selectedAppointment.slotDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{selectedAppointment.slotTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment</p>
                  <p className="font-medium">{selectedAppointment.payment ? "Online" : "Cash"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fee</p>
                  <p className="font-medium">{currency}{selectedAppointment.amount}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Status</p>
                <div className="flex gap-2">
                  {selectedAppointment.isCompleted ? (
                    <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                      Completed
                    </span>
                  ) : selectedAppointment.cancelled ? (
                    <span className="text-sm px-3 py-1 rounded-full bg-red-100 text-red-800 font-medium">
                      Cancelled
                    </span>
                  ) : (
                    <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                      Upcoming
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {!selectedAppointment.isCompleted && !selectedAppointment.cancelled && (
              <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">
                <button 
                  onClick={() => handleCancel(selectedAppointment._id)}
                  className="px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleComplete(selectedAppointment._id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Mark as Completed
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
