import axios from 'axios'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { backendUrl, currency, frontendUrl } from '../config'
import { assets } from '../assets/assets'
import { useState } from 'react'

const List = ({token}) => {
  const [list, setList] = useState([])
  const [queryId, setQueryId] = useState('')
  const [reviewSummary, setReviewSummary] = useState({})
  const [openMenuId, setOpenMenuId] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editImages, setEditImages] = useState([null, null, null, null])
  const [editForm, setEditForm] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)

  const fetchList = async () => {
    try{
      const response = await axios.get(backendUrl+"/api/product/list")
      if(response.data.success) {
        const products = response.data.products || []
        setList(products)

        const reviewsResponse = await axios.get(backendUrl + '/api/review/list')
        if (reviewsResponse.data.success) {
          const summaries = {}
          ;(reviewsResponse.data.reviews || []).forEach((review) => {
            const productId = review.productId?.toString()
            if (!productId) return

            const existing = summaries[productId] || { total: 0, count: 0 }
            existing.total += Number(review.rating) || 0
            existing.count += 1
            summaries[productId] = existing
          })

          Object.entries(summaries).forEach(([productId, summary]) => {
            summaries[productId] = {
              average: Number((summary.total / summary.count).toFixed(1)),
              count: summary.count,
            }
          })

          setReviewSummary(summaries)
        }
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

  const openEdit = (product) => {
    setOpenMenuId(null)
    setEditingProduct(product)
    setEditImages([0, 1, 2, 3].map((index) => product.image?.[index] || null))
    setEditForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      subCategory: product.subCategory || '',
      bestSeller: Boolean(product.bestSeller),
      variants: (product.variants || product.sizes || []).join(', '),
      specifications: product.specifications || [],
      colors: product.colors || [],
      specsInput: '',
      colorsInput: '',
    })
  }

  const updateEditField = (field, value) => {
    setEditForm((current) => ({...current, [field]: value}))
  }

  const updateEditImage = (index, file) => {
    setEditImages((current) => current.map((image, imageIndex) => imageIndex === index ? file : image))
  }

  const addEditSpecs = () => {
    const parsed = editForm.specsInput.split(',').map((part) => {
      const [key, ...rest] = part.trim().split(':')
      return {key: key?.trim() || '', value: rest.join(':').trim()}
    }).filter((specification) => specification.key)
    updateEditField('specifications', [...editForm.specifications, ...parsed])
    updateEditField('specsInput', '')
  }

  const addEditColors = () => {
    const colors = editForm.colorsInput.split(',').map((color) => color.trim()).filter(Boolean)
    updateEditField('colors', [...new Set([...editForm.colors, ...colors])])
    updateEditField('colorsInput', '')
  }

  const saveEdit = async (event) => {
    event.preventDefault()
    const variants = [...new Set(editForm.variants.split(',').map((variant) => variant.trim()).filter(Boolean))]
    if (!editImages[0]) {
      toast.error('Keep or upload a primary product image')
      return
    }
    if (variants.length === 0) {
      toast.error('Add at least one product variant')
      return
    }

    setSavingEdit(true)
    try {
      const formData = new FormData()
      formData.append('id', editingProduct._id)
      formData.append('name', editForm.name)
      formData.append('description', editForm.description)
      formData.append('price', editForm.price)
      formData.append('category', editForm.category)
      formData.append('subCategory', editForm.subCategory)
      formData.append('bestSeller', editForm.bestSeller)
      formData.append('variants', JSON.stringify(variants))
      formData.append('specifications', JSON.stringify(editForm.specifications))
      formData.append('colors', JSON.stringify(editForm.colors))
      formData.append('existingImages', JSON.stringify(editImages.map((image) => typeof image === 'string' ? image : null)))
      editImages.forEach((image, index) => {
        if (image instanceof File) formData.append(`image${index + 1}`, image)
      })

      const response = await axios.put(backendUrl + '/api/product/update', formData, {headers: {token}})
      if (response.data.success) {
        toast.success(response.data.message)
        setEditingProduct(null)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    } finally {
      setSavingEdit(false)
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
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center mb-4'>
        <input value={queryId} onChange={(e) => setQueryId(e.target.value)} placeholder='Search by product ID' className='flex-1 min-w-0 px-3 py-2 border rounded-md' />
        <div className='flex flex-wrap gap-2 sm:flex-nowrap'>
          <button type='button' onClick={() => {
            if (!queryId) { fetchList(); return }
            const found = list.filter(p => p.productCode && p.productCode.toLowerCase() === queryId.toLowerCase())
            setList(found)
          }} className='px-3 py-2 bg-slate-700 text-white rounded-md w-full sm:w-auto'>Search</button>
          <button type='button' onClick={() => { setQueryId(''); fetchList() }} className='px-3 py-2 border rounded-md w-full sm:w-auto'>Reset</button>
        </div>
      </div>
      <div className='flex flex-col gap-2'>

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-3 px-3 bg-slate-100 text-sm rounded-lg'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Rating</b>
          <b className='text-center'>Action</b>
        </div>

        {
          list.map((item) => {
            const summary = reviewSummary[item._id?.toString()] || null
            const ratingText = summary?.count
              ? `${summary.average.toFixed(1)}(${summary.count})`
              : 'No reviews'
            const productLink = `${frontendUrl}/product/${item._id}`

            return (
              <div className='grid grid-cols-[auto_minmax(0,1fr)] gap-3 py-3 px-3 border text-sm border-slate-200 bg-white rounded-lg sm:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] sm:items-center' key={item._id}>
                <a href={productLink} target='_blank' rel='noreferrer' className='flex items-center justify-start'>
                  <img src={item.image[0]} alt={item.name} className='w-12 h-12 rounded-lg object-cover cursor-pointer hover:opacity-80 transition' />
                </a>
                <div className='min-w-0'>
                  <p className='font-medium text-black wrap-break-word'>{item.name}</p>
                  <p className='text-sm text-slate-500 break-all'>{item.productCode}</p>
                  <div className='mt-2 space-y-1 text-sm text-slate-600 sm:hidden'>
                    <p><span className='font-semibold text-slate-700'>Category:</span> {item.category}</p>
                    <p><span className='font-semibold text-slate-700'>Price:</span> {currency}{item.price}</p>
                    <p><span className='font-semibold text-slate-700'>Rating:</span> {ratingText}</p>
                  </div>
                </div>
                <p className='hidden sm:block'>{item.category}</p>
                <p className='hidden sm:block'>{currency}{item.price}</p>
                <div className='hidden sm:flex items-center'>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${summary?.count ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {ratingText}
                  </span>
                </div>
                <div className='relative justify-self-end sm:justify-self-center'>
                  <button type='button' onClick={() => setOpenMenuId(openMenuId === item._id ? null : item._id)} aria-label={`Actions for ${item.name}`} className='px-2 text-xl leading-none text-slate-600 hover:text-slate-950'>...</button>
                  {openMenuId === item._id && (
                    <div className='absolute right-0 z-10 mt-1 w-28 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg'>
                      <button type='button' onClick={() => openEdit(item)} className='block w-full px-3 py-2 text-left text-sm hover:bg-slate-50'>Edit</button>
                      <button type='button' onClick={() => { setOpenMenuId(null); removeProduct(item._id) }} className='block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50'>Delete</button>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        }

      </div>

      {editingProduct && editForm && (
        <div className='fixed inset-0 z-20 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 sm:p-8'>
          <form onSubmit={saveEdit} className='my-4 w-full max-w-3xl rounded-xl bg-white p-5 shadow-xl sm:p-7'>
            <div className='mb-5 flex items-start justify-between gap-4'>
              <div>
                <h2 className='text-xl font-semibold text-slate-900'>Edit product</h2>
                <p className='mt-1 text-sm text-slate-500'>Update the catalog details and replace any product image.</p>
              </div>
              <button type='button' onClick={() => setEditingProduct(null)} aria-label='Close edit product dialog' className='text-2xl leading-none text-slate-500 hover:text-slate-900'>×</button>
            </div>

            <div className='mb-5'>
              <p className='mb-2 font-medium'>Product images</p>
              <div className='flex flex-wrap gap-3'>
                {editImages.map((image, index) => (
                  <label key={index} htmlFor={`edit-image-${index}`} className='cursor-pointer'>
                    <img src={image ? (typeof image === 'string' ? image : URL.createObjectURL(image)) : assets.upload_area} alt={`Product image ${index + 1}`} className='h-20 w-20 rounded-lg border border-slate-200 object-cover' />
                    <input id={`edit-image-${index}`} type='file' accept='image/*' hidden onChange={(event) => updateEditImage(index, event.target.files[0] || null)} />
                  </label>
                ))}
              </div>
              <p className='mt-1 text-xs text-slate-500'>Click an image to replace it. Click the fourth slot only when you want to add one.</p>
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <label>Product code<input readOnly value={editingProduct.productCode || ''} className='mt-1 w-full bg-slate-50 px-3 py-2.5 text-slate-500' /></label>
              <label>Product name<input required value={editForm.name} onChange={(event) => updateEditField('name', event.target.value)} className='mt-1 w-full px-3 py-2.5' /></label>
              <label className='sm:col-span-2'>Description<textarea required rows={5} value={editForm.description} onChange={(event) => updateEditField('description', event.target.value)} className='mt-1 w-full px-3 py-2.5' /></label>
              <label>Category<select value={editForm.category} onChange={(event) => updateEditField('category', event.target.value)} className='mt-1 w-full px-3 py-2.5'>{['Computers', 'Phones & Tablets', 'Audio', 'Gaming', 'Smart Home', 'Accessories'].map((value) => <option key={value}>{value}</option>)}</select></label>
              <label>Product type<select value={editForm.subCategory} onChange={(event) => updateEditField('subCategory', event.target.value)} className='mt-1 w-full px-3 py-2.5'>{['Laptops', 'Desktops', 'Smartphones', 'Tablets', 'Headphones', 'Speakers', 'Wearables', 'Consoles', 'Components', 'Smart Devices', 'Chargers & Cables'].map((value) => <option key={value}>{value}</option>)}</select></label>
              <label>Price (USD)<input required type='number' min='0.01' step='0.01' value={editForm.price} onChange={(event) => updateEditField('price', event.target.value)} className='mt-1 w-full px-3 py-2.5' /></label>
              <label>Variants<input required value={editForm.variants} onChange={(event) => updateEditField('variants', event.target.value)} className='mt-1 w-full px-3 py-2.5' /></label>
              <label className='flex items-center gap-2 sm:col-span-2'><input type='checkbox' checked={editForm.bestSeller} onChange={(event) => updateEditField('bestSeller', event.target.checked)} /> Feature this product in Top Picks</label>
              <label>Specifications (key: value)<span className='mt-1 flex gap-2'><input value={editForm.specsInput} onChange={(event) => updateEditField('specsInput', event.target.value)} placeholder='color: red, weight: 1.5kg' className='min-w-0 flex-1 px-3 py-2.5' /><button type='button' onClick={addEditSpecs} className='rounded-md bg-slate-700 px-3 text-white'>Add</button></span></label>
              <label>Colors<span className='mt-1 flex gap-2'><input value={editForm.colorsInput} onChange={(event) => updateEditField('colorsInput', event.target.value)} placeholder='Red, Black, Silver' className='min-w-0 flex-1 px-3 py-2.5' /><button type='button' onClick={addEditColors} className='rounded-md bg-slate-700 px-3 text-white'>Add</button></span></label>
            </div>
            <div className='mt-3 flex flex-wrap gap-2 text-xs text-slate-600'>
              {editForm.specifications.map((specification, index) => <span key={`${specification.key}-${index}`} className='flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1'>{specification.key}: {specification.value}<button type='button' onClick={() => updateEditField('specifications', editForm.specifications.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove ${specification.key} specification`}>×</button></span>)}
              {editForm.colors.map((color, index) => <span key={`${color}-${index}`} className='flex items-center gap-2 rounded-full border px-3 py-1'>{color}<button type='button' onClick={() => updateEditField('colors', editForm.colors.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove ${color} color`}>×</button></span>)}
            </div>
            <div className='mt-6 flex justify-end gap-3'>
              <button type='button' onClick={() => setEditingProduct(null)} className='rounded-md border px-4 py-2'>Cancel</button>
              <button disabled={savingEdit} type='submit' className='rounded-md bg-blue-600 px-4 py-2 text-white disabled:bg-slate-400'>{savingEdit ? 'SAVING...' : 'SAVE CHANGES'}</button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default List


// @wasifali2004 please add update product feature. 
