import { useContext, useState } from 'react'
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { AppContext } from '../context/AppContext';



function Result() {

  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const { loadCreditData, generateImage } = useContext(AppContext);




  const onSubmitHandler = async (e:any) => {
    e.preventDefault();

    if(!input) return;

    setLoading(true);

    if (input) {
      const result = await generateImage(input);
      if (result) {
        setImage(result);
        setLoading(false)
        setImageLoaded(true);
        loadCreditData();
      }else{
        //reset
        setLoading(false)
        setImageLoaded(false);
      }
    }

    setInput("")

  }



  return (
    <motion.form
      initial={{ opacity: 0.5, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: false }}
      onSubmit={onSubmitHandler} className='flex flex-col min-h-[90vh] justify-center items-center'>
      <div>
        <div className='relative'>
          <img src={image} alt="" className='max-w-sm rounded-sm' />
          <span className={`absolute bottom-0 left-0 h-1  bg-blue-500 
        ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}  `}></span>
        </div>
        <div className={!loading ? 'hidden' : ''}>Loading......</div>
      </div>
      {!isImageLoaded &&
        <div className='flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full'>
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value) }}
            className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color'
            type="text"
            placeholder='Describe what you want to generate' />

          <button
            type='submit'
            className='bg-zinc-900  px-10 sm:px-16 py-3 rounded-full cursor-pointer'>
            Generate
          </button>
        </div>
      }

      {isImageLoaded &&
        <div className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'>
          <p
            onClick={() => { setImageLoaded(false) }}
            className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'>Generate Another</p>
          <a href={image} download className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer'>Download</a>
        </div>
      }
    </motion.form>
  )
}

export default Result