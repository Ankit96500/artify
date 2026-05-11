import { useContext } from 'react'
import { assets } from "../assets/assets";
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Navbar() {
    const {user,setShowLogin,username, credit} = useContext(AppContext);
    const navigate  = useNavigate();
    
    const handleLogout = () => {
        // clear all localstorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.replace('/');
    }



    return (
        <div className='flex items-center justify-between py-6'>
            <Link to='/'>
                <img src={assets?.logo} alt="Logo" className='w-28 sm:w-32 lg:w-40' />
            </Link>
            <div>
                {user
                    ?
                    <div className='flex items-center gap-2 sm:gap-3'>
                        {/* logout user {user available in app} */}
                        <button onClick={()=>navigate('/buy')} className='flex items-center gap-2 bg-purple-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700'>
                            <img className='w-5' src={assets.credit_star} alt="" />
                            <p  className='text-sm sm:text-sm font-medium  cursor-pointer text-gray-600'>Credit left : {credit}</p>
                        </button> 
                        <p className='text-gray-600 max-sm:hidden pl-4'>
                            Hi, {username.toUpperCase()[0]+username.slice(1)}
                        </p>
                        <div className='relative group'>
                            <img src={assets.profile_icon} className='w-10 drop-shadow-2xl' alt="" />
                            <div className='absolute hidden group-hover:block top-0 z-10 text-black rounded pt-12'>
                                <ul className='list-none m-0 p-2 bg-white rounded-md drop-shadow-md text-sm'>
                                    <li onClick={handleLogout}
                                    className='py-1 px-2 cursor-pointer'>Logout</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    :

                    <div className=' flex items-center gap-2 sm:gap-5'>
                        {/* login user */}
                        <p onClick= {()=>navigate('/buy')} className='cursor-pointer'>Pricing</p>
                        <button
                        onClick={()=>{setShowLogin(true)}} 
                        className='bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full cursor-pointer'>Login</button>

                    </div>

                }
            </div>
        </div>
    )
}

export default Navbar