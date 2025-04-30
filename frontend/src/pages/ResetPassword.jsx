import React, { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: {},
        newPassword: "",
        confirmPassword: ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const validValue = Object.values(data).every((el) => el)

    useEffect(() => {
        if(!(location?.state?.data?.success)){
            navigate("/")
        }

        if (location?.state?.email) {
            setData((prev) => {
                return{
                    ...prev,
                    email: location?.state?.email
                }
            })
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()

        if(data.newPassword !== data.confirmPassword) { 
            toast.error("New password and confirm password do not match")
            return
        }
        
        try {
            const response = await Axios({
                ...SummaryApi.resetPassword, //change
                data : data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                navigate("/login")
                setData({
                    email: "",
                    newPassword: "",
                    confirmPassword: ""
                })
            }
        } catch (error) {
            AxiosToastError(error)
            
        }
    }

    return (
        <section className='w-full container mx-auto px-2 '>
            <div className='bg-white my-4 max-w-lg mx-auto rounded p-7'>
                <p className='font-semibold text-lg '>Enter your new Password</p>

                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    
                    <div className='grid gap-1'>
                        <label htmlFor="newPassword">New Password : </label>
                        
                            <div className='bg-blue-50 p-2 flex items-center rounded outline-none border focus-within:border-[#ffbf00] border-blue-200'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id='password'
                                    name='newPassword'
                                    className='w-full outline-none bg-transparent'
                                    value={data.newPassword}
                                    onChange={handleChange}
                                    placeholder='Enter your new password'
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
                                    id='Password'
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
                        Change Password
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

export default ResetPassword