import axios from 'axios'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { backendUrl, currency } from '../config'
import { useState } from 'react'

const List = ({token}) => {
  const [list, setList] = useState([])
  const [queryId, setQueryId] = useState('')

  const fetchList = async () => {
    try{
      const response = await axios.get(backendUrl+"/api/product/list")
      if(response.data.success) {
        setList(response.data.products)
      }
      else {
        toast.error(response.data.message)
      }
    }
    catch(err) {
      toast.error(err.response?.data?.message || err.message)
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
      toast.error(err.response?.data?.message || err.message)
    }
  }   

  useEffect(() => {
    fetchList()
  },[])

  return (
    <>
      <div className='mb-5'>
        <p className='text-xl font-semibold text-slate-800'>Product catalog</p>
        <p className='text-sm text-slate-500'>Manage your electronics and gadget inventory.</p>
      </div>
      <div className='flex gap-2 items-center mb-4'>
        <input value={queryId} onChange={(e) => setQueryId(e.target.value)} placeholder='Search by product ID' className='px-3 py-2 border rounded-md' />
        <button type='button' onClick={() => {
          if (!queryId) { fetchList(); return }
          const found = list.filter(p => p.productCode && p.productCode.toLowerCase() === queryId.toLowerCase())
          setList(found)
        }} className='px-3 py-2 bg-slate-700 text-white rounded-md'>Search</button>
        <button type='button' onClick={() => { setQueryId(''); fetchList() }} className='px-3 py-2 border rounded-md'>Reset</button>
      </div>
      <div className='flex flex-col gap-2'>

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-3 bg-slate-100 text-sm rounded-lg'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {
          list.map((item) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-2 px-3 border text-sm border-slate-200 bg-white rounded-lg' key={item._id}>
              <img src={item.image[0]} alt="" className='w-12 h-12 rounded-lg object-cover' />
              <p>[{item.productCode}] {item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <button type='button' onClick={() => removeProduct(item._id)} aria-label={`Remove ${item.name}`} className='text-right md:text-center cursor-pointer text-lg text-red-500'>×</button>
            </div>
          ))
        }

      </div>
    </>
  )
}

export default List
