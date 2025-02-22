import React, { useContext, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import axios from '../config/axios';
import { UserContext } from '../context/user.context';
const Register = () => {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('')
    const {setUser}=useContext(UserContext);
    const navigate=useNavigate();
    function handler(e){
        e.preventDefault()
        axios.post('/users/register',{
            email,password
        }).then((res)=>{
            console.log(res.data)
            localStorage.setItem('token',res.data.token);
            setUser(res.data.user);
            navigate('/')
        }).catch((err)=>{
            console.log(err.response.data)
        })
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-900 via-pink-800 to-red-900">
      <div className="w-full max-w-md bg-gray-800 bg-opacity-90 p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-white text-center">Create an Account</h2>
        <form className="mt-6 space-y-4" onSubmit={handler}>
          <div>
            <label className="block text-gray-300">Email</label>
            <input 
            onChange={(e)=>setemail(e.target.value)}
              type="email"
              className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-300">Password</label>
            <input
            onChange={(e)=>setpassword(e.target.value)}
              type="password"
              className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-gray-300 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
