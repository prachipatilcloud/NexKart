import React, { useEffect, useRef, useState } from 'react'
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const OtpVerification = () => {
    const [data, setData] = useState(["","","","","",""])

    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()

    useEffect(() => {
      if(!location?.state?.email){
        navigate("/forgot-password")
      }
      }
    ,[])
    

    const validValue = data.every(el => el)

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        try {
            const response = await Axios({
                ...SummaryApi.verify_forgot_password_otp,
                data : {
                  otp: data.join(""),
                  email: location?.state?.email
                }
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setData(["","","","","",""])
                navigate("/reset-password", {
                  state: {
                    data: response.data,
                    email: location?.state?.email
                  }
                })
            }
        } catch (error) {
            AxiosToastError(error)
            
        }

    }

    return (
        <section className='w-full container mx-auto px-2 '>
            <div className='bg-white my-4 max-w-lg mx-auto rounded p-7'>
                <p className='font-semibold text-lg '>Enter OTP</p>

                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    
                    <div className='grid gap-1'>
                        <label htmlFor="otp">Enter your OTP : </label>
                        <div className='flex items-center gap-2 justify-between mt-3'>
                          {
                            data.map((element, index) =>{
                              return (
                                <input
                                  key={"otp"+index}
                                  type="text"
                                  id='otp'
                                  ref= {(ref) => {
                                    inputRef.current[index] = ref
                                    return ref
                                  }}
                                  maxLength={1}
                                  value={data[index]}
                                  onChange ={(e) => {
                                    const value = e.target.value

                                    const newData = [...data]
                                    newData[index] = value
                                    setData(newData)

                                    if(value && index < 5){
                                      inputRef.current[index+1].focus()
                                    }
                                  }}
                                  className='bg-blue-50 p-2 w-full max-w-16 rounded outline-none focus-within:border-[#ffbf00] 
                                  text-center font-semibold border border-blue-200'
                                />
                              )
                            })
                          }
                        </div>
                        
                    </div>
                    
                    <button disabled={!validValue} className={` ${validValue ? "bg-green-800 hover:bg-[#1B5E20]/80" : "bg-gray-500"}  text-white py-2 rounded font-semibold my-3 leading-4 tracking-wide transition-all duration-300`}>
                        Verify OTP
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

export default OtpVerification