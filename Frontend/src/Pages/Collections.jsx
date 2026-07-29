import { useContext, useMemo, useState } from 'react'
import { ShopContext } from '../Context/ShopContext.js'
import { assets } from '../assets/assets'
import Title from '../Components/Title'
import ProductItem from '../Components/ProductItem'

const Collections = () => {
  const {products, search, showSearch} = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')
  const categories = ['Computers', 'Phones & Tablets', 'Audio', 'Gaming', 'Smart Home', 'Accessories']
  const productTypes = ['Laptops', 'Desktops', 'Smartphones', 'Tablets', 'Headphones', 'Speakers', 'Wearables', 'Consoles', 'Components', 'Smart Devices', 'Chargers & Cables']

  const toggleValue = (setter, value) => {
    setter((current) => current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value],
    )
  }

  const filteredProducts = useMemo(() => {
    let result = products.filter((item) => {
      const matchesSearch = !showSearch || !search
        || item.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category.length === 0 || category.includes(item.category)
      const matchesSubCategory = subCategory.length === 0 || subCategory.includes(item.subCategory)
      return matchesSearch && matchesCategory && matchesSubCategory
    })

    if (sortType === 'low-high') result = [...result].sort((a, b) => a.price - b.price)
    if (sortType === 'high-low') result = [...result].sort((a, b) => b.price - a.price)
    return result
  }, [category, products, search, showSearch, sortType, subCategory])

  return (
    <div className='flex flex-col sm:flex-row gap-6 lg:gap-10 pt-10 border-t border-slate-200'>
      <aside className='sm:w-60 sm:shrink-0'>
        <button type='button' onClick={() => setShowFilter(!showFilter)} className='my-2 text-lg font-semibold flex items-center cursor-pointer gap-2 text-slate-900'>
          FILTER PRODUCTS
          <img src={assets.dropdown_icon} alt="" className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} />
        </button>

        <div className={`rounded-2xl border border-slate-200 bg-white p-5 mt-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-4 text-xs font-bold tracking-[0.16em] text-slate-500'>CATEGORY</p>
          <div className='flex flex-col gap-3 text-sm text-slate-700'>
            {categories.map((value) => (
              <label key={value} className='flex items-center gap-3 cursor-pointer hover:text-blue-600'>
                <input type="checkbox" value={value} className='size-4 accent-blue-600 cursor-pointer' onChange={() => toggleValue(setCategory, value)} />
                {value}
              </label>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl border border-slate-200 bg-white p-5 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-4 text-xs font-bold tracking-[0.16em] text-slate-500'>PRODUCT TYPE</p>
          <div className='flex flex-col gap-3 text-sm text-slate-700'>
            {productTypes.map((value) => (
              <label key={value} className='flex items-center gap-3 cursor-pointer hover:text-blue-600'>
                <input type="checkbox" value={value} className='size-4 accent-blue-600 cursor-pointer' onChange={() => toggleValue(setSubCategory, value)} />
                {value}
              </label>
            ))}
          </div>
        </div>
      </aside>

      <div className='flex-1'>
        <div className='flex flex-col xs:flex-row gap-4 justify-between text-base sm:text-2xl mb-7'>
          <div>
            <Title text1='SHOP' text2='TECH' />
            <p className='text-sm text-slate-500 mt-1'>{filteredProducts.length} products</p>
          </div>
          <select value={sortType} onChange={(event) => setSortType(event.target.value)} className='self-start rounded-lg border border-slate-300 bg-white text-sm px-3 py-2.5 text-slate-700'>
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-7'>
          {filteredProducts.map((item) => (
            <ProductItem key={item._id} id={item._id} image={item.image} name={item.name} price={item.price}  />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className='rounded-2xl border border-dashed border-slate-300 py-20 text-center'>
            <p className='font-medium text-slate-700'>No products match these filters.</p>
            <p className='text-sm text-slate-500 mt-1'>Try clearing a category or product type.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Collections
