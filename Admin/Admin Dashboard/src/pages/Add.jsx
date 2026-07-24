import { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import {backendUrl} from '../config'
import { toast } from 'react-toastify'

const categories = ['Computers', 'Phones & Tablets', 'Audio', 'Gaming', 'Smart Home', 'Accessories']
const subCategories = ['Laptops', 'Desktops', 'Smartphones', 'Tablets', 'Headphones', 'Speakers', 'Wearables', 'Consoles', 'Components', 'Smart Devices', 'Chargers & Cables']

const Add = ({token}) => {
  const [images, setImages] = useState([false, false, false, false])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [subCategory, setSubCategory] = useState(subCategories[0])
  const [bestSeller, setBestSeller] = useState(false)
  const [variantInput, setVariantInput] = useState('Standard')
  const [submitting, setSubmitting] = useState(false)

  const updateImage = (index, file) => {
    setImages((current) => current.map((image, imageIndex) => imageIndex === index ? file : image))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    const variants = [...new Set(
      variantInput.split(',').map((variant) => variant.trim()).filter(Boolean),
    )]

    if (!images[0]) {
      toast.error('Upload at least one product image')
      return
    }
    if (variants.length === 0) {
      toast.error('Add at least one product variant')
      return
    }

    setSubmitting(true)
    try{
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestSeller', bestSeller)
      formData.append('variants', JSON.stringify(variants))
      images.forEach((image, index) => {
        if (image) formData.append(`image${index + 1}`, image)
      })

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {headers:{token}},
      )

      if(response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImages([false, false, false, false])
        setPrice('')
        setVariantInput('Standard')
        setBestSeller(false)
      } else {
        toast.error(response.data.message)
      }
    } catch(error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full gap-5 items-start'>
      <div>
        <p className='text-xl font-semibold text-slate-800'>Add a new gadget</p>
        <p className='text-sm text-slate-500 mt-1'>Upload clear product photos and list every available configuration.</p>
      </div>

      <div>
        <p className='mb-2 font-medium'>Product images</p>
        <div className='flex flex-wrap gap-3'>
          {images.map((image, index) => (
            <label key={index} htmlFor={`image${index + 1}`} className='cursor-pointer'>
              <img
                className='w-24 h-24 object-cover rounded-xl border border-slate-200 bg-white'
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt={`Upload ${index + 1}`}
              />
              <input
                onChange={(event) => updateImage(index, event.target.files[0])}
                type='file'
                accept='image/*'
                id={`image${index + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      <div className='w-full'>
        <label className='mb-2 block font-medium' htmlFor='product-name'>Product name</label>
        <input id='product-name' onChange={(event) => setName(event.target.value)} value={name} type='text' placeholder='e.g. NovaBook Pro 14' required className='w-full max-w-[620px] px-3 py-2.5'/>
      </div>

      <div className='w-full'>
        <label className='mb-2 block font-medium' htmlFor='product-description'>Description and specifications</label>
        <textarea id='product-description' onChange={(event) => setDescription(event.target.value)} value={description} required rows={5} className='w-full max-w-[620px] px-3 py-2.5' placeholder='Key features, compatibility, battery life, warranty, and what is included.'></textarea>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-[760px]'>
        <div>
          <label className='mb-2 block font-medium' htmlFor='product-category'>Category</label>
          <select id='product-category' value={category} onChange={(event) => setCategory(event.target.value)} className='w-full px-3 py-2.5'>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div>
          <label className='mb-2 block font-medium' htmlFor='product-type'>Product type</label>
          <select id='product-type' value={subCategory} onChange={(event) => setSubCategory(event.target.value)} className='w-full px-3 py-2.5'>
            {subCategories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div>
          <label className='mb-2 block font-medium' htmlFor='product-price'>Price (USD)</label>
          <input id='product-price' onChange={(event) => setPrice(event.target.value)} value={price} type='number' min='0.01' step='0.01' required placeholder='299' className='w-full px-3 py-2.5' />
        </div>
      </div>

      <div className='w-full'>
        <label className='mb-2 block font-medium' htmlFor='product-variants'>Variants</label>
        <input
          id='product-variants'
          value={variantInput}
          onChange={(event) => setVariantInput(event.target.value)}
          required
          className='w-full max-w-[620px] px-3 py-2.5'
          placeholder='Standard, 128GB / Black, 256GB / Silver'
        />
        <p className='text-xs text-slate-500 mt-1'>Separate configurations with commas. Use “Standard” when the product has one option.</p>
      </div>

      <label className='flex items-center gap-2 mt-1 cursor-pointer'>
        <input onChange={() => setBestSeller((current) => !current)} checked={bestSeller} type='checkbox' />
        <span>Feature this product in Top Picks</span>
      </label>

      <button disabled={submitting} type='submit' className='min-w-36 py-3 mt-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white cursor-pointer'>
        {submitting ? 'ADDING...' : 'ADD PRODUCT'}
      </button>
    </form>
  )
}

export default Add
