import userModel from "../models/user.model.js";
import * as userService from '../services/user.service.js';
import {validationResult} from "express-validator"
import redisClient from "../services/redis.service.js";
import mongoose from "mongoose";
export const createUserController=async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        // Call service to create user
        const user = await userService.createUser({ email, password });
        const token=await user.generateJWT();
        delete user._doc.password;
        res.status(201).json({ message: "User created successfully", user,token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const logincontroller=async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        // Call service to create user
        const user = await userModel.findOne({ email}).select('+password');
        if(!user){
            return res.status(401).json({
                errors:'Invald credentials'
            })
        }

        const isMatch=await user.isValidPassword(password);

        if(!isMatch){
            return res.status(401).json({
                errors:'Invald credentials'
            })
        }

        const token=await user.generateJWT();
        delete user._doc.password;
        res.status(201).json({ message: "User loged in successfully", user,token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const profilecontroller=async(req,res)=>{
    console.log(req.user);
    res.status(200).json({
        user:req.user
    })
}


export const logoutcontroller=async(req,res)=>{
    try{
        const token =req.cookies.token || req.headers.authorization.split(' ')[1];

        redisClient.set(token,'logout','EX',60*60*24);
        res.status(200).json({
            message:"LOGGED OUT SUCCESFULLY"
        });
    }
    catch(err){
        console.log(err);
        res.status(400).send(err.message)
    }
}


export const getAllUsersController = async (req, res) => {
    try {
        // console.log("User from request:", req.user); // Debugging

        if (!req.user || !req.user.email) {
            return res.status(400).json({ message: "User email is required" });
        }

        const loggedInUser = await userModel.findOne({ email: req.user.email });

        if (!loggedInUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // console.log(loggedInUser)
        const allUsers = await userService.getAllUsers({
            userId: loggedInUser._id 
        });

        return res.status(200).json({users:allUsers });
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
};

