const express = require('express')
const router = express.Router()
const { addDoctor, loginAdmin, allDoctors , appoinmentsAdmin} = require('../controllers/adminControllers.js')
const authAdmin = require('../middlewares/authAdmin')
const upload = require('../middlewares/multer')
const { changeAvailablity } = require('../controllers/doctorControllres.js')

// Admin routes
const adminRouter = express.Router()
adminRouter.post('/add-doctor',upload.single('image'),addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors', authAdmin, allDoctors)
// adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/change-availability', authAdmin, changeAvailablity)
adminRouter.get('/appointments',authAdmin,appoinmentsAdmin)
module.exports = adminRouter