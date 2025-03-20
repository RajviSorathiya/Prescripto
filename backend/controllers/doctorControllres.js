const doctorModel = require("../models/doctorModel.js")

const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available  })
        res.json({ success: true, message: "Availability Changed" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const doctorList =async (req,res) =>{
    try {
        const doctors =await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
        
    }

}

module.exports = { changeAvailablity,doctorList }