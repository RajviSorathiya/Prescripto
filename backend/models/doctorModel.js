//import mongoose from "mongoose";
const mongoose = require('mongoose')

const doctorSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String,required:true},
    image:{type:String,required:true},
    speciality:{type:String,required:true},
    degree:{type:String,required:true},
    experience:{type:String,required:true},
    about:{type:String,required:true},
    available:{type:Boolean,default:true},
    fees:{type:Number,required:true},
    address:{type:Object,required:true},
    date:{type:Number,required:true},
    slots_booked:{type:Object,default:{}},//use to show the data slots like which is booked and which is free
},{minimize:false})

const doctorModel= mongoose.models.doctor|| mongoose.model('doctor',doctorSchema)

module.exports= doctorModel;//it is used to store doctor data to the database
