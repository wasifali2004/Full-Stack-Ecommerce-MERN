import React from 'react'
import Title from '../Components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../Components/NewsletterBox'

const About = () => {
  return (
    <div>
        <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'ABOUT'} text2={'US'} />
        </div>

        <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img src={assets.about_img} alt="" className='w-full md:max-w-[450px]' />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>At Forever, we are passionate about bringing you the best in fashion and lifestyle. Our mission is to provide high-quality, trendy, and affordable products that suit every style and occasion. We focus on delivering an exceptional shopping experience with a wide selection of carefully curated items, secure transactions, and fast shipping.</p>
          <p>Whether you're looking for the latest fashion trends or timeless essentials, Forever is here to make your shopping journey effortless and enjoyable. Join us and experience style, quality, and convenience all in one place.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Forever is your go-to destination for trendy, high-quality fashion at affordable prices. We are committed to providing a seamless shopping experience with a curated selection of stylish products, secure payments, and fast delivery. Shop with us and stay ahead in fashion effortlessly!</p>
          </div>
        </div>

        <div className='text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
        </div>

        <div className='flex flex-col md:flex-row text-sm mb-20 gap-5'>
          <div className='border border-gray-400 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Quality Assurance: </b>
            <p className='text-gray-600'>We are committed to providing high-quality products that meet the highest standards. Every item is carefully selected and inspected to ensure durability, style, and customer satisfaction. Shop with confidence, knowing you're getting the best.</p>
          </div>
          <div className='border border-gray-400 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Convenience:</b>
            <p className='text-gray-600'>We make shopping easy and hassle-free with a seamless online experience. Browse, order, and receive your favorite products from the comfort of your home. Enjoy fast shipping and secure payment options for a smooth shopping journey.</p>
          </div>
          <div className='border border-gray-400 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Exceptional Customer Service:</b>
            <p className='text-gray-600'>We prioritize exceptional customer service to ensure a smooth and satisfying shopping experience. Our dedicated team is always ready to assist you with inquiries, orders, and any concerns, making your journey with Forever hassle-free and enjoyable.</p>
          </div>
        </div>

        <NewsletterBox />
    </div>
  )
}

export default About