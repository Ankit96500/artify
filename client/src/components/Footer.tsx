import React from 'react'
import { assets } from "../assets/assets";




function Footer() {
    return (
        <div className='flex item-center justify-between gap-4 py-3 mt-20'>
            <img src={assets.logo} alt="" width={150} />
            <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden
                pt-3'>
                Copyright @Imagio.dev | All right reserved.</p>

            <div className='flex gap-3'>
                <img src={assets.facebook_icon} alt="" width={35} className='cursor-pointer' />
                <img src={assets.twitter_icon} alt="" width={35} className='cursor-pointer' />
                <img src={assets.instagram_icon} alt="" width={35} className='cursor-pointer' />
            </div>
        </div>
    )
}

export default Footer