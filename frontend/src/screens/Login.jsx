import React, { useContext, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import axios from '../config/axios';
import { UserContext } from '../context/user.context'

const Login = () => {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('')
    const [errors, setErrors] = useState([]);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    function handler(e) {
        e.preventDefault();
        setErrors([]);

        // Frontend validation
        const errs = [];
        if (!email) errs.push('Email is required');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.push('Enter a valid email address');
        if (!password) errs.push('Password is required');
        else if (password.length < 6) errs.push('Password must be at least 6 characters');
        if (errs.length > 0) return setErrors(errs);

        axios.post('/users/login', { email, password })
            .then((res) => {
                sessionStorage.setItem('token', res.data.token);
                setUser(res.data.user);
                navigate('/')
            })
            .catch((err) => {
                const data = err.response?.data;
                if (Array.isArray(data?.errors)) {
                    setErrors(data.errors.map(e => e.msg));
                } else if (typeof data?.errors === 'string') {
                    setErrors([data.errors]);
                } else if (data?.message) {
                    setErrors([data.message]);
                } else {
                    setErrors(['Something went wrong. Please try again.']);
                }
            });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <i className="ri-code-box-line text-white"></i>
                    </div>
                    <span className="text-white font-bold text-lg">DevCollab</span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
                <p className="text-gray-400 text-sm mb-6">Login to your account</p>

                {/* Error messages */}
                {errors.length > 0 && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        {errors.map((err, i) => (
                            <p key={i} className="text-red-400 text-sm flex items-center gap-2">
                                <i className="ri-error-warning-line"></i> {err}
                            </p>
                        ))}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handler}>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Email</label>
                        <input
                            onChange={(e) => setemail(e.target.value)}
                            value={email}
                            type="email"
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Password</label>
                        <input
                            onChange={(e) => setpassword(e.target.value)}
                            value={password}
                            type="password"
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium mt-2"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-5 text-gray-400 text-sm text-center">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-400 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    )
}

export default Login
