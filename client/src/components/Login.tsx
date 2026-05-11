import { useContext, useEffect, useState } from 'react'
import { assets } from "../assets/assets";
import { AppContext } from '../context/AppContext';
import { motion } from "framer-motion";
import { toast } from 'react-toastify';


function Login() {

    const [state, setState] = useState('Login');
    const { setShowLogin, setUser, setUsername,backendUrl,setCredit } = useContext(AppContext);
    const [userData, setUserData] = useState({ name: "", email: "", password: "" });

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, []);


    const handleSubmit = async (e:any) => {
        e.preventDefault();
        try {
            if (state === 'Login') {
                const result = await fetch(backendUrl+'/api/user/login',
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: userData.email,
                            password: userData.password
                        })
                    })
                    .then(data => data.json())
                    .catch(err => alert(err));

                if (!result.success) {
                    toast.error(result.msg);
                } else {
                    // store token in localstorage
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('username', result.user.name);

                    setUser(true);
                    setUsername(result.user.name);
                    setShowLogin(false);
                    setCredit(result.user.credits);
                }
                


            } else {
                const result2 = await fetch(backendUrl+'/api/user/register', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: userData.name,
                        email: userData.email,
                        password: userData.password
                    })
                }).then(data => data.json())
                    .catch(err => alert(err));

                if (!result2.success) {
                    toast.error(result2.msg);
                } else {

                    localStorage.setItem('token', result2.token);
                    localStorage.setItem('username', result2.user.name);

                    setUser(true);
                    setUsername(result2.user.name);
                    setCredit(result2.user.credits);
                    setShowLogin(false);
                }

            }

        } catch (error) {
            console.log("error -> ", error)

        }
    }



    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <motion.form
                initial={{ opacity: 0.2, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
                className='relative bg-white p-10 rounded-xl text-slate-500'
            >
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
                <p className='text-sm'>Welcome back! Please sign in to continue</p>

                {state !== 'Login' &&
                    <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                        <img src={assets.profile_icon} alt="" width={20} />
                        <input
                            value={userData.name}
                            onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                            className='outline-none text-sm'
                            type="text"
                            placeholder='Full Name' required />
                    </div>
                }
                <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                    <img src={assets.email_icon} alt="" width={14} />
                    <input
                        value={userData.email}
                        onChange={(e) => { setUserData(prev => ({ ...prev, email: e.target.value })) }}
                        className='outline-none text-sm'
                        type="email"
                        placeholder='Email id' required />
                </div>
                <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                    <img src={assets.lock_icon} alt="" width={14} />
                    <input
                        value={userData.password}
                        onChange={(e) => { setUserData(prev => ({ ...prev, password: e.target.value })) }}
                        className='outline-none text-sm'
                        type="password"
                        placeholder='Password' required />
                </div>
                <p className='text-sm text-purple-600 my-4 cursor-pointer'>Forgot Password?</p>
                <button
                    type='submit'
                    onClick={handleSubmit}
                    className='bg-purple-600 w-full text-white py-2 rounded-full cursor-pointer'>{state === 'Login' ? 'login' : 'Create account'}</button>

                {state === 'Login' ?
                    <p className='mt-5 text-center'>
                        Don't have an account?
                        <span
                            onClick={() => setState('SignUp')}
                            className='text-purple-600 cursor-pointer'>Sign Up</span>
                    </p>

                    :
                    <p className='mt-5 text-center'>
                        Already have an account?
                        <span
                            onClick={() => setState('Login')}
                            className='text-purple-600 cursor-pointer'>Login</span>
                    </p>
                }


                <img
                    onClick={() => { setShowLogin(false) }}
                    className='absolute top-5 right-5 cursor-pointer'
                    src={assets.cross_icon} alt="" />


            </motion.form>
        </div>
    )
}

export default Login