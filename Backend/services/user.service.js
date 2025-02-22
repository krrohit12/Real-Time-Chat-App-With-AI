import userModel from '../models/user.model.js';
import mongoose from 'mongoose';
export const createUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error('Email and password both are required');
    }
    // Hash the password before saving
    const hashedPassword = await userModel.hashPassword(password);

    // Create the user in the database
    const user = await userModel.create({
        email,
        password: hashedPassword
    });

    return user;
};

export const getAllUsers = async ({ userId }) => {
    console.log("Received userId:", userId); // Debugging

    const users = await userModel.find({
        _id: { $ne: userId } 
    });

    return users;
};