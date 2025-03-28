import { createContext, useState } from "react";
import axios from "axios";
import{toast} from "react-toastify"
//import axios from "axios";


export const AdminContext = createContext()


const AdminContextProvider =(props)=>{
    const[aToken ,setAToken] =useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const[doctors,setDoctors] =useState([])
    const [appointments, setAppointments] =useState([])
    const backendUrl= import.meta.env.VITE_BACKEND_URL 
    const getAllDoctors =async () =>{
        try{
            const {data} =await axios.post(`${backendUrl}/api/admin/all-doctors`,{},{headers:{aToken:aToken}})
            if(data.success){
                setDoctors(data.doctors)
            }else{
                toast.error(data.message)
            }

        } catch(error){
            toast.error(error.message)

        }

    }
    const changeAvailability =async(docId)=>{
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/change-availability', {docId}, {headers: {aToken}})
            if(data.sucsse){
                toast.success(data.message)
                getAllDoctors()
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)

        }


    }

    const getAllAppointments = async() =>{
        try {
            const {data} = await axios.get(backendUrl +'/api/admin/appointments',{headers:{aToken}})
            if(data.success){
                console.log(data.appoinments)
                setAppointments(data.appoinments)

            }else{
                toast.error(data.message)
                
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const value ={
        aToken,setAToken,
        backendUrl,doctors,
        getAllDoctors,changeAvailability,
        appointments,setAppointments,
        getAllAppointments

    }

    return(
        <AdminContext.Provider value ={value}>
            {props.children}

        </AdminContext.Provider>
    )


}

export default AdminContextProvider