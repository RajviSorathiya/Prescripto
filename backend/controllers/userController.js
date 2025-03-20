const validator = require('validator')
const bcrypt = require('bcrypt')
const userModel =require ('../models/userModel.js')
const jwt = require("jsonwebtoken")
const { v2: cloudinary } = require('cloudinary')
const doctorModel = require('../models/doctorModel.js')
const appoinmentModel = require('../models/appoinmentsModel.js')
//const Razorpay = require('razorpay')
//api to register user
const registerUser =async (req,res)=>{
    try {
        const {name ,email,password} =req.body
        if(!name || !password || !email){
            return res.json({success:false, message:"Missing Details"})
        }
        //vaildating email format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"enter a vaild email"})
        }
        if(password.length < 8){
            return res.json({success:false, message:"Enter strong password"})
        }
        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const userData={
            name,
            email,
            password:hashedPassword
        }
        const newUser =new userModel(userData)
        const user =await newUser.save()
        //_id

        if(isMatch){
        const token =jwt.sign({id:user._id}, process.env.JWT_SECRET)
        res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invaild credentials"})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
        
    }

}


//API for user login
const loginUser =async (req, res)=>{
    try{
        const{email,password} = req.body
        const user =await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:'User does not exist'})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({
                success:true,
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            })
        }else{
            res.json({success:false,message:"Invaild credentials"})
        }
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

//API to get user profile data
const getProfile = async(req,res)=>{
    try {
        const{userId} =req.body
        const userData = await userModel.findById(userId).select('-password')
        res.json({success:true,userData})
        // console.log(userData);
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to update user profile
const updateProfile = async (req,res) =>{
    try {
        const { userId,name ,phone,address,dob,gender} =req.body
        const imageFile =req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({sucsse:false ,message:"Data Missing"})
        } 
        await userModel.findByIdAndUpdate(userId,{name,phone, address:JSON.parse(address),dob,gender})
        
        if(imageFile){
            //upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL =imageUpload.secure_url
            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }
        res.json({success:true,message})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

//API TO BOOK APPOINMENT
const bookAppointment =async (req,res)=>{
     try {
        debugger;
        console.log(req.body);
        const {userId,docId,slotDate,slotTime,...rest}=req.body
        const docData =await doctorModel.findById(docId).select('-password')
        if(!docData.available){
            return res.json({success:false,message:'Doctor not available'})
        }
        
     
        let slots_booked =docData.slots_booked

        //checking for slot availabilty
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:'Slot not available'})
            }else{
                slots_booked[slotDate].push(slotTime)
            }
        }else{
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
        }
        const userData =await userModel.findById(userId).select('-password')
        if(!userData) {
            return res.json({success:false,message:'User not found'})
        }
        delete docData.slots_booked //history not discribe 

        const appionmentData ={
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            data: Date.now()
        }

        const newAppoinment = new appoinmentModel(appionmentData)
        await newAppoinment.save()

        //save new slots data in docData 
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true,message:'Appointment Booked'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
     }
}

//API TO GET USER APPOINMENTS FOR FRONTEND MY APPOINMENT PAGE
const listAppointment = async(req, res) => {
    try {
        // Add debug logs
        //console.log('Auth user:', req.user);
        const{userId} =req.body
        // const userId = req.userId;  // or req.user._id
        console.log('Fetching appointments for userId:', userId);
        
        const appointments = await appoinmentModel.find({ userId });
        console.log('Found appointments:', appointments);
        
        res.json({
            success: true, 
            appointments: appointments || []
        });
    } catch (error) {
        console.error('List appointment error:', error);
        res.json({
            success: false, 
            message: error.message, 
            appointments: []
        });
    }
}

// //api to cancel appointment
// const cancelAppointment = async (req,res)=>{
//     try {
//         const appointmentId = req.body.appointmentId;
//         const userId = req.user._id; // Get userId from auth middleware
//         console.log(appointmentId);
//         console.log(userId);

//         // Fix model name typo
//         const appointmentData = await appoinmentModel.findById(appointmentId);
//         if(appointmentData.userId!==userId) {
//             return res.status(404).json({success: false, message: 'Appointment not found'});
//         }

//         // Verify appointment belongs to user
//         // if(appointmentData.userId.toString() !== userId.toString()){
//         //     return res.status(401).json({success: false, message: 'Unauthorized action'});
//         // }

//         // Update appointment status
//         await appoinmentModel.findByIdAndUpdate(appointmentId, {status: 'cancelled'});

//         // Release doctor's slot
//         const {docId, slotDate, slotTime} = appointmentData;
//         const doctorData = await doctorModel.findById(docId);
        
//         if(!doctorData) {
//             return res.status(404).json({success: false, message: 'Doctor not found'});
//         }

//         let slots_booked = doctorData.slots_booked 
//         slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime)
        
//         // if(slots_booked[slotDate]) {
//         //     slots_booked[slotDate] = slots_booked[slotDate].filter(time => time !== slotTime);
//         //     if(slots_booked[slotDate].length === 0) {
//         //         delete slots_booked[slotDate];
//         //     }
//        /// }

//         await doctorModel.findByIdAndUpdate(docId, {slots_booked});
        
//         res.status(200).json({
//             success: true, 
//             message: "Appointment cancelled successfully"
//         });
        
//     } catch (error) {
//         //console.error('Cancel appointment error:', error);
//      res.status(500).json({
//             success: false, 
//             message: 'Error cancelling appointment'
//         });
//     }
// }


const cancelAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.body;
      console.log(appointmentId);
      if (!appointmentId) {
        return res.status(400).json({
          success: false,
          message: 'Appointment ID is required'
        });
      }
  
      const appointment = await appoinmentModel.findById(appointmentId);
      
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }
  
      // Update appointment status
      appointment.cancelled = true;
      await appointment.save();
  
      res.json({
        success: true,
        message: 'Appointment cancelled successfully'
      });
  
    } catch (error) {
      console.error('Cancel appointment error:', error);
      res.status(500).json({
        success: false,
        message: 'Error cancelling appointment',
        error: error.message  // Include error message for debugging
      });
    }
  };
//   const razorpayInstance =new razorpay({
//     key_id:'',
//     key_secret:''

//   })


  //API to make payment of appoinment using razorpay
 // const paymentRazorpay= async(req,res)=>{


  




  
module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment
};