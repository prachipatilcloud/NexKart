import React, { useState } from 'react'
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';


const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    })

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
                ...SummaryApi.forgot_Password,
                data : data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                navigate("/verify-otp", { state: data })
                setData({
                    email: "",
                })
            }
        } catch (error) {
            AxiosToastError(error)
            
        }

    }

    return (
        <section className='w-full container mx-auto px-2 '>
            <div className='bg-white my-4 max-w-lg mx-auto rounded p-7'>
                <p className='font-semibold text-lg '>Forgot Password</p>

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
                    
                    <button disabled={!validValue} className={` ${validValue ? "bg-green-800 hover:bg-[#1B5E20]/80" : "bg-gray-500"}  text-white py-2 rounded font-semibold my-3 leading-4 tracking-wide transition-all duration-300`}>
                        Send OTP
                    </button>
                </form>

                <p>
                    Already have an account? 
                    <Link to={"/login"} className='text-blue-600 font-semibold cursor-pointer'>
                        Login
                    </Link>
                </p>
            </div>
        </section>
    )
}

export default ForgotPassword