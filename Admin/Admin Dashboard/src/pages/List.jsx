import axios from 'axios'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { backendUrl, currency } from '../App'
import { useState } from 'react'

const List = ({token}) => {
  const [list, setList] = useState([])

  const fetchList = async () => {
    try{
      const response = await axios.get(backendUrl+"/api/product/list")
      console.log(response.data)
      if(response.data.success) {
        setList(response.data.products)
      }
      else {
        toast.error(response.data.message)
      }
    }
    catch(err) {
      console.log(err)
      toast.error(err.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', {id}, {headers: {token}})
      if(response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      }
      else {
        toast.error(response.data.message)
      }
    }
    catch(err) {
      console.log(err)
      toast.error(err.message)
    }
  }   

  useEffect(() => {
    fetchList()
  },[])

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm border-none'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm border-red-100' key={index}>
              <img src={item.image[0]} alt="" className='w-12' />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p onClick={() => removeProduct(item._id)}  className='text-right md:text-center cursor-pointer text-lg'>X</p>
            </div>
          ))
        }

      </div>
    </>
  )
}

export default List