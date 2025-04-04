const express = require('express')
const doctorRouter = express.Router()
const { 
  doctorList, 
  loginDoctor, 
  appointmentsDoctor, 
  appointmentComplete, 
  changeAvailablity, 
  doctorProfile, 
  updateDoctorProfile
} = require('../controllers/doctorControllres')
const authDoctor = require('../middlewares/authDoctor')

// Doctor routes
doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete)
doctorRouter.post('/change-availability', authDoctor, changeAvailablity)
doctorRouter.get('/profile', authDoctor, doctorProfile)
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile)

module.exports = doctorRouter