import { useContext } from 'react'
import { plans, assets } from "../assets/assets";
import { AppContext } from '../context/AppContext';
import { motion } from "framer-motion";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



function BuyCredit() {

  const { user, setUser, backendUrl, setShowLogin, loadCreditData } = useContext(AppContext);
  const navigate = useNavigate();


  const initPay = async (order) => {

    var options = {
      "key": import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      "amount": order.amount, // Amount is in currency subunits. 
      "currency": order.currency,
      "name": "Credit Payments", //your business name
      "description": "Test Transaction for payment",
      "order_id": order.id, //
      "receipt": order.receipt,
      handler: async (response:any) => {
        try {
          const verifyPaymentResult = await fetch(backendUrl + '/api/user/verify', {
            method: "POST",
            headers: {
              'Content-Type': "application/json",
              'authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id
            })

          }).then(data => data.json())
            .catch(err => console.log(err));

          // console.log("verifyPaymentResult - > > ",verifyPaymentResult)


          if (verifyPaymentResult.success) {
            loadCreditData();
            navigate("/")
            toast.success("Credits added successfully")
          }

        } catch (error) {
          toast.error(error)
        }

      }
    }

    const rzp = new window.Razorpay(options);

    rzp.open();

  }


  const razorPaymentInit = async (planId: any) => {
    try {
      if (!user) {
        setShowLogin(true);
      }

      let result = await fetch(backendUrl + '/api/user/pay-razorpay',
        {
          method: "POST",
          headers: {
            'Content-Type': "application/json",
            'authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            planId
          })
        }
      ).then(data => data.json()).catch(err => console.log(err));

      if (result.success) {
        initPay(result.order);
      }

    } catch (error) {
      toast.error(error)
    }
  }



  return (
    <motion.div
      initial={{ opacity: 0.1, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: false }}
      className='min-h-[80vh] text-center pt-14 mb-10'>
      <button
        className='rounded-full border border-gray-400 px-10 py-2 mb-6'>
        Our Plans
      </button>
      <h1 className='text-center text-3xl font-medium mb-6 sm:mb-10'>Choose the plans that works for you</h1>

      <div className='flex flex-wrap justify-center items-center gap-6 text-left'>
        {plans.map((item, index) => (
          <div key={index}
            className='bg-white rounded-lg drop-shadow-sm py-12 px-8
        text-gray-600 hover:scale-105 transition-all duration-500
        '>
            <img src={assets.logo_icon} alt="" width={40} />
            <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>
            <p className='mt-6'>
              <span className='text-3xl font-medium'> ${item.price} </span>/ {item.credits} credits</p>
            <button
              onClick={() => razorPaymentInit(item?.id)}
              className='w-full bg-gray-800 rounded-md text-white mt-8 text-sm py-2.5 min-w-52 cursor-pointer'>
              {user ? 'Purchase' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>



    </motion.div>
  )
}

export default BuyCredit