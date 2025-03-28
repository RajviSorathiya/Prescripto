import { createContext } from "react";

export const AppContext = createContext()


const AppContextProvider =(props)=>{
    const currency='$'
    const calculateAge =(dob) =>{
        const today =new Date()
        const birthDate =new Date(dob)
        let age =today.getFullYear() -birthDate.getFullYear()
        return age
    }

    const months=['','jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
    const slotDataFormat =(slotDate)=>{
        const dataArray=slotDate.split('_')
        return dataArray[0] +""+months[Number(dataArray[1])]+""+dataArray[2]

    }



    const value ={
        calculateAge,
        slotDataFormat,
        currency

    }

    return(
        <AppContext.Provider value ={value}>
            {props.children}

        </AppContext.Provider>
    )


}

export default AppContextProvider