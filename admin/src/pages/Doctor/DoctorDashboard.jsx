import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorDashboard = () => {
  const { dToken, appointments, getAppointments } = useContext(DoctorContext);
  const { calculateAge, slotDataFormat, currency } = useContext(AppContext);
  const [dashStats, setDashStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    totalEarnings: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  useEffect(() => {
    if (appointments && appointments.length > 0) {
      // Calculate dashboard statistics
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '_');
      const totalAppointments = appointments.length;
      const todayAppointments = appointments.filter(app => app.slotDate === today).length;
      const completedAppointments = appointments.filter(app => app.isCompleted).length;
      const pendingAppointments = appointments.filter(app => !app.isCompleted && !app.cancelled).length;
      const totalEarnings = appointments.reduce((sum, app) => sum + (app.isCompleted ? Number(app.amount) : 0), 0);
      
      setDashStats({
        totalAppointments,
        todayAppointments,
        completedAppointments,
        pendingAppointments,
        totalEarnings
      });

      // Get 5 most recent appointments
      setRecentAppointments(appointments.slice(0, 5));
    }
  }, [appointments]);

  return (
    <div className="m-5 w-full max-w-6xl">
      <h2 className="text-xl font-semibold mb-5">Dashboard</h2>
      
      {/* Stat Cards */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.appointments_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashStats.totalAppointments}
            </p>
            <p className="text-gray-400">Total Appointments</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.patients_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashStats.todayAppointments}
            </p>
            <p className="text-gray-400">Today's Appointments</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.tick_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashStats.completedAppointments}
            </p>
            <p className="text-gray-400">Completed</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.earning_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {currency}{dashStats.totalEarnings}
            </p>
            <p className="text-gray-400">Total Earnings</p>
          </div>
        </div>
      </div>
      
      {/* Upcoming Appointments */}
      <div className="bg-white rounded border">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold">Recent Appointments</p>
        </div>
        
        <div className="divide-y">
          {recentAppointments.length > 0 ? (
            recentAppointments.map((item, index) => (
              <div className="flex items-center px-6 py-4 gap-3 hover:bg-gray-50" key={index}>
                <img className="rounded-full w-10 h-10 object-cover" src={item.userData?.image || "https://via.placeholder.com/40"} alt="" />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{item.userData?.name}</p>
                  <div className="flex text-sm text-gray-500 gap-2">
                    <p>{slotDataFormat(item.slotDate)}</p>
                    <p>{item.slotTime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{currency}{item.amount}</p>
                  <p className={`text-xs ${item.isCompleted ? 'text-green-500' : item.cancelled ? 'text-red-500' : 'text-blue-500'}`}>
                    {item.isCompleted ? 'Completed' : item.cancelled ? 'Cancelled' : 'Upcoming'}
                  </p>
                </div>
                {!item.isCompleted && !item.cancelled && (
                  <img className="w-8 cursor-pointer" src={assets.tick_icon} alt="Complete" title="Mark as Complete" />
                )}
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-gray-500">No recent appointments</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;