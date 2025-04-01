import React from 'react'
import Header from '../Components/Header'
import SpecialityMenu from '../Components/SpecialityMenu'
import TopDoctors from '../Components/TopDoctors'
import Banner from '../Components/Banner'


const Home = () => {
  return (
    <div className='mt-24'>
      <Header/>
      <SpecialityMenu/>
      <TopDoctors/>
      <Banner/>
      
       
    </div>
  )
}

export default Home