const validator = require("validator")
const bcrypt = require('bcrypt')
const { v2: cloudinary } = require('cloudinary')
const doctorModel = require("../models/doctorModel")
const jwt = require("jsonwebtoken")


//API FOR ADDING DOCTOR
const addDoctor = async(req, res) => {
    try {
        const {name, email, password, speciality, degree, experience, about, fees, address} = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({success: false, message: "Missing Details"})
        }

        //validating email format
        if(!validator.isEmail(email)) {
            return res.json({success: false, message: "Please enter a valid email"})
        }

        //validating strong password
        if(password.length < 8) {
            return res.json({success: false, message: "Please enter a strong password"})
        }

        //check if email already exists
        const existingDoctor = await doctorModel.findOne({email})
        if(existingDoctor) {
            return res.json({success: false, message: "Email already registered"})
        }

        //hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
        const imageUrl = imageUpload.secure_url

        //create new doctor document
        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success: true, message: "Doctor Added"})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// Api for admin login
const loginAdmin = async(req,res)=>{
    try{
        const{email,password}=req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token =jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        } else{
            res.json({success:false,message:"Invalid credentials"})
        }
    } catch(error){
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

//API to get all doctors list for admin panel
const allDoctors =async(req ,res) =>{
    try{
        const doctors =await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})


    } catch(error){
        console.log(error)
        res.status(500).json({ success: false, message: error.message })

    }

}

module.exports = { addDoctor,loginAdmin,allDoctors }