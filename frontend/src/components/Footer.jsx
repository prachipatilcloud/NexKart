import React from 'react'
import { FaFacebookSquare, FaLinkedin, FaInstagram } from "react-icons/fa";


const Footer = () => {
  return (
    <div>
        <footer className=' border-t '>
            <div className=' flex text-center items-center container mx-auto p-4 flex-col gap-2 lg:flex-row lg:justify-between '>
                <p>©All rights reserved 2025.</p>


                <div className='flex items-center gap-4 justify-center text-2xl'>
                    <a href='' className='hover:text-blue-800'>
                        <FaFacebookSquare/>
                    </a>
                    <a href="">
                        <FaInstagram className='hover:text-blue-800'/>
                    </a>
                    <a href="">
                        <FaLinkedin className='hover:text-blue-800'/>
                    </a>
                    <a href='#' className='text-blue-600 hover:text-blue-800'>Contact
                    </a>
                    
                </div>
            </div>
        </footer>
    </div>
  )
}

export default Footer