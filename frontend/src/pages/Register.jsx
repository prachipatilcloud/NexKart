import React, { useState } from 'react'

const Register = () => {
    const [data,setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => {
            return{
            ...prev,
            [name]: value
        }})
    }

  return (
    <section className='w-full container mx-auto px-2 '>
        <div className='bg-white my-4 max-w-lg mx-auto rounded p-4'>
            <p>Welcome to NexKart</p>

            <form action="">
                <div className='grid gap-2 mt-7'>
                    <label htmlFor="name">Name : </label>
                    <input 
                        type="text" 
                        autoFocus
                        className='bg--blue-50 p-2 rounded outline-none border border-blue-200'
                        value={data.name}
                        onChange={handleChange}
                        />
                </div>
            </form>
        </div>
    </section>
  )
}

export default Register