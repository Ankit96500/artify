import { useContext } from 'react'
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';


function GenerateBtn() {
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
            className='pb-16 text-center'>
            <h1 className='text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold 
            text-shadow-neutral-800 py-6 md:py-16'>See the magic. Try now</h1>
            <button
                onClick={OnClickHandler}
                className='inline-flex item-center gap-2
            px-10 py-3 rounded-full bg-black text-white m-auto 
            hover:scale-105 transition-all duration-500
            cursor-pointer'>Generate Images
                <img className='h-6' src={assets.star_group} alt="Generate" />

            </button>
        </motion.div>
    )
}

export default GenerateBtn