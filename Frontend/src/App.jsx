import React from 'react'
import {Routes} from 'react-router-dom'
import  {Route}  from 'react-router-dom'
import Home from './Pages/Home'
import Collection from './Pages/Collections'
import About from './Pages/About'
import Cart from './Pages/Cart'
import Contact from './Pages/Contact'
import Orders from './Pages/Orders'
import Product from './Pages/Product'
import PlaceOrder from './Pages/PlaceOrder'
import Login from './Pages/Login'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import SearchBar from './Components/SearchBar'
import { ToastContainer, toast } from 'react-toastify'; 
import Verify from './Pages/Verify'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar/>
      <SearchBar/>
     <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/collection' element={<Collection/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/contact'  element={<Contact/>}/>
        <Route path='/orders' element={<Orders/>} />
        <Route path='/product/:productId' element={<Product/>} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/verify' element={<Verify/>} />
     </Routes>
     <Footer/>
    </div>
  )
}

export default App