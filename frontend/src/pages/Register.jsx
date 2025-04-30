import React, { useState } from 'react'
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';


const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
        
        if(data.password !== data.confirmPassword) {
            toast.error("Password and confirm password do not match")
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data : data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                })
                navigate("/login")
            }
        } catch (error) {
            AxiosToastError(error)
            
        }



    }

    return (
        <section className='w-full container mx-auto px-2 '>
            <div className='bg-white my-4 max-w-lg mx-auto rounded p-7'>
                <p>Welcome to NexKart</p>

                <form className='grid gap-4 mt-7' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor="name">Name : </label>
                        <input
                            type="text"
                            id='name'
                            autoFocus
                            className='bg--blue-50 p-2 rounded outline-none border focus-within:border-[#ffbf00] border-blue-200'
                            name='name'
                            value={data.name}
                            onChange={handleChange}
                            placeholder='Enter your name'
                        />
                    </div>
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
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="confirmPassword">Confirm Password : </label>
                        <div className='bg-blue-50 p-2 flex items-center rounded outline-none border focus-within:border-[#ffbf00] border-blue-200'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='confirmPassword'
                                name='confirmPassword'
                                className='w-full outline-none bg-transparent'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Enter your confirm password'
                            />
                            <div onClick={() => setShowConfirmPassword(prev => !prev)} className='cursor-pointer' >
                                {
                                    showConfirmPassword ? (
                                        <FaEye />
                                    ) : (
                                        <FaEyeSlash />
                                    )
                                }

                            </div>
                        </div>
                    </div>

                    <button disabled={!validValue} className={` ${validValue ? "bg-green-800 hover:bg-[#1B5E20]/80" : "bg-gray-500"}  text-white py-2 rounded font-semibold my-3 leading-4 tracking-wide transition-all duration-300`}>
                        Register
                    </button>
                </form>

                <p>
                    Already have an account? <Link to={"/login"} className='text-blue-600 font-semibold cursor-pointer'>Login</Link>
                </p>
            </div>
        </section>
    )
}

export default Register