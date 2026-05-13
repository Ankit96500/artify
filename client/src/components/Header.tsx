import { useContext } from 'react';
import { assets } from '../assets/assets'
import { motion } from "motion/react";
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

function Header() {
    const { user, setShowLogin } = useContext(AppContext);

    const navigate = useNavigate();

    const OnClickHandler = () => {
        if (user) {
            navigate('/result');
        } else {
            setShowLogin(true);
        }
    }


    return (
        <motion.div
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className='flex flex-col justify-center items-center text-center my-20'>
            <motion.div
                initial={{ opacity: 0.2, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className=' text-stone-500 inline-flex text-center gap-2 
                bg-white px-6 py-1 rounded-full border border-neutral-500'>
                <p>Best text to image generator</p>
                <img src={assets.star_icon} alt="" />
            </motion.div>
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                className='text-4xl max-w-[300px] sm:text-7xl sm:max-w-[590px] mx-auto mt-10 text-center'>
                Turn Text to <span className='text-purple-600'>image</span>, in seconds.
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className='text-center max-w-xl mx-auto mt-5'>Lorem ipsum dolor sit
                amet consectetur adipisicing elit. Corporis facere quod vitae adipisci et aspernatur,
                ipsum delectus impedit quibusdam fugit?
            </motion.p>

            <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ default: { duration: 0.5 }, opacity: { delay: 0.8, duration: 1 } }}
                onClick={OnClickHandler}
                className='sm:text-lg text-white bg-black w-auto mt-8 px-12 
                py-2.5 flex items-center gap-2 rounded-full 
                cursor-pointer'>Generate Image
                <img className='h-6' src={assets.star_group} alt="" />
            </motion.button>


            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className='flex flex-wrap justify-center mt-16 gap-3'>
                {Array(6).fill('').map((_: any, index) => (
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        className='hover:scale-105 transition-all 
                    duration-300 cursor-pointer max-sm:w-10 rounded-sm'
                        src={index % 2 === 0 ? assets.sample_img_2 : assets.sample_img_1}
                        key={index} width={70} alt="" />
                ))}
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.8 }}

                className='mt-2 text-neutral-600'>Generated images from artify</motion.p>

        </motion.div>
    )
}

export default Header