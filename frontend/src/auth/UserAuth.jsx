import React,{useContext, useEffect, useState} from 'react'
import { UserContext } from '../context/user.context'
import { Navigate, useNavigate } from 'react-router-dom'
const UserAuth = ({children}) => {
    const {user}=useContext(UserContext)
    // console.log(user)
    const navigate=useNavigate()
    const [loading, setloading] = useState(true)
    const token=sessionStorage.getItem('token');
    
    useEffect(()=>{
        if(user){
            setloading(false)
        }
        if(!token){
            navigate('/login')
        }
        if(!user){
            navigate('/login')
        }
        
    },[])
    if(loading){
        return <div>Loading...</div>
    }
  return (
    <>
        {children}
    </>
  )
}

export default UserAuth
