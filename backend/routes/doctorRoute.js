const express = require('express')
const router = express.Router()
const { doctorList,loginDoctor } = require('../controllers/doctorControllres')

router.get('/list', doctorList)
router.post('/login',loginDoctor)


module.exports = router