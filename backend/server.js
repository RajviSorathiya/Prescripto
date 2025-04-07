const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const connectDB = require('./config/mongodb')
const connectCloudinary = require('./config/cloudinary.js')
const adminRouter = require('./routes/adminRoute.js')
const doctorRouter = require('./routes/doctorRoute.js')
const userRoutes = require('./routes/userRoute')
const userRouter = require('./routes/userRoute')
const cloudinary = require('cloudinary').v2
//import express from 'express'
//import cors from 'cors'
//import 'dotenv/config'
//import connectDB from './config/mongodb.js'

//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middlewares
app.use(express.json())
app.use(cors())

//api endpoints
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/users', userRouter)

app.get('/', (req, res) => {
    res.send('API WORKING ')
})

// MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI)
// //then(() => console.log('MongoDB Connected'))
// .catch(err => console.log('MongoDB Error:', err))CCCC

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ success: false, message: 'Something went wrong!' })
})

// Start server
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`)
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy. Trying ${port + 1}...`)
        server.close()
        app.listen(port + 1)
    } else {
        console.error('Server error:', err)
    }
})

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// })