import React, { useState } from 'react'
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';


const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "", 
    })

    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const validValue = Object.values(data).every((el) => el)

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        try {
            const response = await Axios({
                ...SummaryApi.login,
                data : data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setData({
                    email: "",
                    password: "",
                })
                navigate("/")
            }
        } catch (error) {
            AxiosToastError(error)
            
        }

    }

    return (
        <section className='w-full container mx-auto px-2 '>
            <div className='bg-white my-4 max-w-lg mx-auto rounded p-7'>

                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    
                    <div className='grid gap-1'>
                        <label htmlFor="email">Email : </label>
                        <input
                            type="email"
                            id='email'
                            name='email'
                            className='bg--blue-50 p-2 rounded outline-none focus-within:border-[#ffbf00] border border-blue-200'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="password">Password : </label>
                        <div className='bg-blue-50 p-2 flex items-center rounded outline-none border focus-within:border-[#ffbf00] border-blue-200'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                name='password'
                                className='w-full outline-none bg-transparent'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter your password'
                            />
                            <div onClick={() => setShowPassword(prev => !prev)} className='cursor-pointer' >
                                {
                                    showPassword ? (
                                        <FaEye />
                                    ) : (
                                        <FaEyeSlash />
                                    )
                                }

                            </div>
                        </div>
                        <Link to={"/forgot-password"} className='block ml-auto text-sm text-blue-600 cursor-pointer hover:underline'>
                          Forgot password?
                        </Link>
                    </div>
                    

                    <button disabled={!validValue} className={` ${validValue ? "bg-green-800 hover:bg-[#1B5E20]/80" : "bg-gray-500"}  text-white py-2 rounded font-semibold my-3 leading-4 tracking-wide transition-all duration-300`}>
                        Login
                    </button>
                </form>

                <p>
                    Don't have an account? <Link to={"/register"} className='text-blue-600 font-semibold cursor-pointer'>Register</Link>
                </p>
            </div>
        </section>
    )
}

export default Login