const express = require('express')
const router = express.Router()
const { doctorList } = require('../controllers/doctorControllres')

router.get('/list', doctorList)

module.exports = router