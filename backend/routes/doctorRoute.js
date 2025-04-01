const express = require('express')
const doctorRouter = express.Router()
const { doctorList,loginDoctor } = require('../controllers/doctorControllres')

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login',loginDoctor)


module.exports = doctorRouter