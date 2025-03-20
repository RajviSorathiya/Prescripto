const express = require('express')
const { registerUser,loginUser, getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment } = require('../controllers/userController')
const authUser = require('../middlewares/authUser')
const upload = require('../middlewares/multer')


// Define routes
const userRouter = express.Router()
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'),authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointment)
// userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)  // Make sure this matches


module.exports = userRouter  // Export the router, not an object containing the router
