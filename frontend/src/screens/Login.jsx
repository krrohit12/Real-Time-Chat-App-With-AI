import React, { useContext, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import axios from '../config/axios';
import {UserContext} from '../context/user.context'

const Login = () => {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('')
    const {setUser}=useContext(UserContext);



    const navigate=useNavigate();
    function handler(e) {
      e.preventDefault();
      axios.post('/users/login', { email, password })
          .then((res) => {
              console.log("User Logged In:", res.data.user);
              sessionStorage.setItem('token', res.data.token);
              setUser(res.data.user); // This will update both context and localStorage automatically
              navigate('/')
          })
          .catch((err) => {
              console.log(err.response.data);
          });
  }  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-purple-900 to-gray-500">
      <div className="w-full max-w-md bg-gray-800 bg-opacity-90 p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-white text-center">Welcome Back</h2>
        <form className="mt-6 space-y-4" onSubmit={handler}>
            
          <div>
            <label className="block text-gray-300">Email</label>
            <input
            onChange={(e)=>setemail(e.target.value)}
              type="email"
              className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-300">Password</label>
            <input
            onChange={(e)=>setpassword(e.target.value)}
              type="password"
              className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-gray-300 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
