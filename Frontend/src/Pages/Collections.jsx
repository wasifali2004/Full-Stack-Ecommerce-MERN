import React, { useEffect } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../Components/Title'
import ProductItem from '../Components/ProductItem'

const Collections = () => {
  const {products, search, showSearch} = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProduct, setFilterProduct] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')
  


  const toggleCategory = (e) => {
    if(category.includes(e.target.value)) {
      setCategory(pre => pre.filter(item => item !== e.target.value))
    }
    else {
      setCategory(pre => [...pre, e.target.value])
    }
  } 

  useEffect(() => {
    console.log(category)
  },[category])

  const toggleSubCategory = (e) => {
    if(subCategory.includes(e.target.value)) {
      setSubCategory(pre => pre.filter(item => item !== e.target.value))
    }
    else {
      setSubCategory(pre => [...pre, e.target.value])
    }
  } 

  const applyFilter = () => {
    let productCopy = products.slice();
    if(showSearch && search) {
      productCopy = productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase() ))
    }

    if(category.length > 0) {
      productCopy = productCopy.filter((item) => category.includes(item.category))
    }
    if(subCategory.length > 0) {
      productCopy = productCopy.filter((item) => subCategory.includes(item.subCategory))
    }
    setFilterProduct(productCopy)
  }

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products])

  useEffect(() => {
    console.log(subCategory)
  },[subCategory])

  const sortProduct = () => {
    const fpCopy = filterProduct.slice();
    switch(sortType) {
      case 'low-high':
        setFilterProduct(fpCopy.sort((a,b) => (a.price - b.price)))
        break;
      
      case 'high-low':
        setFilterProduct(fpCopy.sort((a,b) => (b.price - a.price)))
        break;

      default:
        applyFilter();
        break;
    }
  }

  useEffect(() => {
    sortProduct();
  },[sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      
    {/* Filter Options */}
    <div className='min-w-60'>
      <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2 '>FILTERS
        <img src={assets.dropdown_icon} alt="" className={`h-3 sm:hidden ${showFilter? 'rotate-90' : ''}`}  />
      </p>

      <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
        <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
        <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
          <p className='flex gap-2'>
            <input type="checkbox" value={'Men'} className='w-3 cursor-pointer'onChange={toggleCategory} /> Men
          </p>
          <p className='flex gap-2'>
            <input type="checkbox" value={'Women'}  className='w-3 cursor-pointer'onChange={toggleCategory} /> Women
          </p>
          <p className='flex gap-2'>
            <input type="checkbox" value={'Kids'} className='w-3 cursor-pointer'onChange={toggleCategory} /> Kids
          </p>
        </div>
      </div>

      <div className={`border my-5 border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
        <p className='mb-3 text-sm font-medium'>TYPE</p>
        <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
          <p className='flex gap-2'>
            <input type="checkbox" value={'Topwear'} className='w-3 cursor-pointer' onChange={toggleSubCategory} /> Topwear
          </p>
          <p className='flex gap-2'>
            <input type="checkbox" value={'Bottomwear'}  className='w-3 cursor-pointer' onChange={toggleSubCategory} /> Bottomwear
          </p>
          <p className='flex gap-2'>
            <input type="checkbox" value={'Winterwear'} className='w-3 cursor-pointer' onChange={toggleSubCategory} /> Winterwear
          </p>
        </div>
      </div>
    </div>

    {/* Right Side */}
    <div className='flex-1'> 
      <div className='flex justify-between text-base sm:text-2xl mb-4'>
      <Title text1={'ALL'} text2={'COLLECTIONS'} />

      <select onChange={(e) => (setSortType(e.target.value))} className='border-2 border-gray-300 text-sm px-2'>
        <option value="relavent">Sort by: Relavent</option>
        <option value="low-high">Sort by: Low to High</option>
        <option value="high-low">Sort by: High to Low</option>
      </select>
      </div>

      <div className='grid gri md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
      {
        filterProduct.map((item, index) => {
          return <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
        })
      }
      </div>
    </div>
    </div>
  )
}

export default Collections